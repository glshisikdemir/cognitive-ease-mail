import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Json } from "@/integrations/supabase/types";
import { createLovableAiGatewayProvider } from "./ai-gateway";

// ---- Shared enums (kept in sync with the DB enums) ----
export const TASK_TYPES = [
  "research",
  "find",
  "enrich",
  "score",
  "segment",
  "message",
  "approve",
  "send",
  "track",
  "learn",
  "other",
] as const;
export type TaskType = (typeof TASK_TYPES)[number];

export const TASK_AGENTS = [
  "research",
  "sales",
  "email",
  "crm",
  "calendar",
  "analytics",
  "knowledge",
  "decision",
  "planner",
] as const;
export type TaskAgent = (typeof TASK_AGENTS)[number];

export const TASK_STATUSES = [
  "pending",
  "ready",
  "running",
  "blocked",
  "awaiting_approval",
  "done",
  "failed",
  "skipped",
] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const OBJECTIVE_STATUSES = [
  "planning",
  "active",
  "paused",
  "completed",
  "archived",
] as const;
export type ObjectiveStatus = (typeof OBJECTIVE_STATUSES)[number];

export type ObjectiveRow = {
  id: string;
  title: string;
  summary: string | null;
  source: "voice" | "text";
  language: "en" | "tr";
  status: ObjectiveStatus;
  created_at: string;
  updated_at: string;
};

export type TaskRow = {
  id: string;
  objective_id: string;
  order_index: number;
  type: TaskType;
  agent: TaskAgent;
  title: string;
  description: string | null;
  status: TaskStatus;
  requires_approval: boolean;
  decision_id: string | null;
  depends_on: string[];
  result: Json | null;
  created_at: string;
  updated_at: string;
};

// The Planner's structured decomposition of an objective into a task graph.
const planSchema = z.object({
  summary: z
    .string()
    .describe("A one or two sentence restatement of the objective and what ISURA will do, in the target language."),
  tasks: z
    .array(
      z.object({
        type: z
          .enum(TASK_TYPES)
          .describe("The kind of work this step is."),
        agent: z
          .enum(TASK_AGENTS)
          .describe("Which specialized agent owns this step."),
        title: z.string().describe("Short imperative title of the step, in the target language."),
        description: z
          .string()
          .describe("One sentence explaining what this step does and why, in the target language."),
        requiresApproval: z
          .boolean()
          .describe("True for impactful/irreversible steps (sending campaigns, deleting data, booking meetings, external changes)."),
      }),
    )
    .describe("The ordered list of steps, from research through learning. Keep it focused: 6-14 steps."),
});

async function planWithAI(title: string, lang: "en" | "tr") {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  const gateway = createLovableAiGatewayProvider(key);
  const model = gateway("google/gemini-3-flash-preview");
  const langName = lang === "tr" ? "Turkish" : "English";

  const system = `You are the Planner module of ISURA, a voice-first AI operating layer that acts like an executive chief of staff.
Given a business objective, decompose it into a clear, ordered task graph that specialized agents will execute.
Always write titles, descriptions and the summary in ${langName}.

Available agents and what they own:
- research: market/company research, web search, reading sites.
- sales: prospecting, lead scoring, prioritization, segmentation.
- email: drafting, personalizing, sending outreach and follow-ups.
- crm: recording contacts, organizations and relationship state.
- calendar: scheduling and booking meetings.
- analytics: tracking results (delivery, opens, replies, meetings, revenue).
- knowledge: organizational memory and reference lookups.
- decision: recommendations and next-best-action.
- planner: coordination, approval checkpoints.

Rules:
- Produce a realistic end-to-end plan: research -> find -> enrich -> score -> segment -> message -> approval -> send -> track -> learn (only include steps that fit the objective).
- Mark requiresApproval = true for any step that sends messages externally, deletes data, books meetings, or makes external changes. These pause for human approval.
- Always include an explicit approval checkpoint (type "approve", agent "planner") before any bulk send.
- Keep it concise and non-technical. Never mention tools, APIs, or code.`;

  const prompt = `Objective: "${title}"\n\nDecompose this into an ordered plan.`;

  const { experimental_output } = await generateText({
    model,
    system,
    prompt,
    experimental_output: Output.object({ schema: planSchema }),
  });
  return experimental_output;
}

// Create an objective and immediately generate its plan (task graph).
export const createObjective = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        title: z.string().min(3).max(500),
        source: z.enum(["voice", "text"]).default("text"),
        language: z.enum(["en", "tr"]).default("en"),
      })
      .parse(d),
  )
  .handler(async ({ data, context }): Promise<{ id: string }> => {
    const { supabase, userId } = context;

    const { data: obj, error } = await supabase
      .from("objectives")
      .insert({
        user_id: userId,
        title: data.title,
        source: data.source,
        language: data.language,
        status: "planning",
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);

    let plan: Awaited<ReturnType<typeof planWithAI>>;
    try {
      plan = await planWithAI(data.title, data.language);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      // Objective still exists; surface a clear error and let the user re-plan.
      if (msg.includes("429")) throw new Error("Rate limit reached. Please retry in a moment.");
      if (msg.includes("402")) throw new Error("AI credits exhausted. Add credits in workspace settings.");
      throw new Error("Planning failed. Please try again.");
    }

    const rows = plan.tasks.slice(0, 20).map((t, i) => ({
      user_id: userId,
      objective_id: obj.id,
      order_index: i,
      type: t.type,
      agent: t.agent,
      title: t.title.slice(0, 200),
      description: t.description.slice(0, 1000),
      requires_approval: t.requiresApproval,
      status: (i === 0 ? "ready" : "pending") as TaskStatus,
    }));

    if (rows.length) {
      const { error: tErr } = await supabase.from("tasks").insert(rows);
      if (tErr) throw new Error(tErr.message);
    }

    await supabase
      .from("objectives")
      .update({ summary: plan.summary.slice(0, 2000), status: "active" })
      .eq("id", obj.id)
      .eq("user_id", userId);

    return { id: obj.id };
  });

export const listObjectives = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ObjectiveRow[]> => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("objectives")
      .select("*")
      .eq("user_id", userId)
      .neq("status", "archived")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return (data ?? []) as ObjectiveRow[];
  });

export const getObjective = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }): Promise<{ objective: ObjectiveRow; tasks: TaskRow[] }> => {
    const { supabase, userId } = context;
    const { data: obj, error } = await supabase
      .from("objectives")
      .select("*")
      .eq("id", data.id)
      .eq("user_id", userId)
      .single();
    if (error) throw new Error(error.message);

    const { data: tasks, error: tErr } = await supabase
      .from("tasks")
      .select(
        "id, objective_id, order_index, type, agent, title, description, status, requires_approval, decision_id, depends_on, result, created_at, updated_at",
      )
      .eq("objective_id", data.id)
      .eq("user_id", userId)
      .order("order_index", { ascending: true });
    if (tErr) throw new Error(tErr.message);

    return {
      objective: obj as ObjectiveRow,
      tasks: (tasks ?? []).map((t) => ({
        ...t,
        depends_on: Array.isArray(t.depends_on) ? (t.depends_on as string[]) : [],
      })) as TaskRow[],
    };
  });

export const updateTaskStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), status: z.enum(TASK_STATUSES) }).parse(d),
  )
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("tasks")
      .update({ status: data.status })
      .eq("id", data.id)
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const setObjectiveStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), status: z.enum(OBJECTIVE_STATUSES) }).parse(d),
  )
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("objectives")
      .update({ status: data.status })
      .eq("id", data.id)
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
