import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Json } from "@/integrations/supabase/types";
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  type AutonomyCategory,
  type AutonomyLevel,
  type DecisionStatus,
  type RiskLevel,
} from "./guardian";

const categoryEnum = z.enum([
  "marketing",
  "sales",
  "finance",
  "legal",
  "calendar",
  "email_followup",
  "pricing",
  "contracts",
  "data",
]);

const levelEnum = z.enum([
  "level1_autonomous",
  "level2_silent",
  "level3_approval",
  "level4_strategic",
]);

const statusEnum = z.enum([
  "pending",
  "approved",
  "rejected",
  "executed",
  "undone",
  "expired",
]);

const riskEnum = z.enum(["low", "medium", "high", "critical"]);

export type PermissionSetting = {
  category: AutonomyCategory;
  level: AutonomyLevel;
};

export type DecisionRow = {
  id: string;
  category: AutonomyCategory;
  level: AutonomyLevel;
  status: DecisionStatus;
  title: string;
  recommendation: string;
  reasoning: string | null;
  evidence: string[];
  alternatives: string[];
  do_nothing_outcome: string | null;
  confidence: number | null;
  risk: RiskLevel;
  business_impact: string | null;
  financial_impact: string | null;
  proposed_by: string;
  initiated_by: string | null;
  approved_by: string | null;
  approval_reason: string | null;
  outcome: string | null;
  executed_at: string | null;
  created_at: string;
};

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((v) => String(v));
  return [];
}

// Fetch the user's Permission Center config, seeding sensible defaults once.
export const getPermissions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<PermissionSetting[]> => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("permission_settings")
      .select("category, level")
      .eq("user_id", userId);
    if (error) throw new Error(error.message);

    if (!data || data.length === 0) {
      const seed = CATEGORY_ORDER.map((category) => ({
        user_id: userId,
        category,
        level: CATEGORY_META[category].defaultLevel,
      }));
      const { data: inserted, error: seedErr } = await supabase
        .from("permission_settings")
        .insert(seed)
        .select("category, level");
      if (seedErr) throw new Error(seedErr.message);
      return (inserted ?? []) as PermissionSetting[];
    }
    return data as PermissionSetting[];
  });

export const setPermission = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ category: categoryEnum, level: levelEnum }).parse(d),
  )
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("permission_settings")
      .upsert(
        { user_id: userId, category: data.category, level: data.level },
        { onConflict: "user_id,category" },
      );
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listDecisions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ status: statusEnum.optional() }).optional().parse(d),
  )
  .handler(async ({ data, context }): Promise<DecisionRow[]> => {
    const { supabase, userId } = context;
    let q = supabase
      .from("decisions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(100);
    if (data?.status) q = q.eq("status", data.status);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return (rows ?? []).map((r) => ({
      ...r,
      evidence: toStringArray(r.evidence),
      alternatives: toStringArray(r.alternatives),
    })) as DecisionRow[];
  });

export const createDecision = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        category: categoryEnum,
        level: levelEnum,
        status: statusEnum.optional(),
        title: z.string().min(1).max(200),
        recommendation: z.string().min(1).max(4000),
        reasoning: z.string().max(4000).optional(),
        evidence: z.array(z.string().max(500)).max(20).optional(),
        alternatives: z.array(z.string().max(500)).max(20).optional(),
        doNothingOutcome: z.string().max(2000).optional(),
        confidence: z.number().min(0).max(100).optional(),
        risk: riskEnum.optional(),
        businessImpact: z.string().max(1000).optional(),
        financialImpact: z.string().max(1000).optional(),
        initiatedBy: z.string().max(120).optional(),
        actionPayload: z.record(z.string(), z.unknown()).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }): Promise<{ id: string }> => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("decisions")
      .insert({
        user_id: userId,
        category: data.category,
        level: data.level,
        status: data.status ?? "pending",
        title: data.title,
        recommendation: data.recommendation,
        reasoning: data.reasoning ?? null,
        evidence: data.evidence ?? [],
        alternatives: data.alternatives ?? [],
        do_nothing_outcome: data.doNothingOutcome ?? null,
        confidence: data.confidence ?? null,
        risk: data.risk ?? "low",
        business_impact: data.businessImpact ?? null,
        financial_impact: data.financialImpact ?? null,
        initiated_by: data.initiatedBy ?? "ISURA",
        action_payload: (data.actionPayload ?? {}) as Json,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

// Approve / reject / execute / undo — every transition is recorded.
export const updateDecisionStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        status: statusEnum,
        approvalReason: z.string().max(1000).optional(),
        outcome: z.string().max(2000).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    const { supabase, userId } = context;
    const patch: {
      status: DecisionStatus;
      approved_by?: string;
      approval_reason?: string;
      executed_at?: string;
      outcome?: string;
    } = { status: data.status };
    if (data.status === "approved" || data.status === "rejected") {
      patch.approved_by = "human";
      if (data.approvalReason) patch.approval_reason = data.approvalReason;
    }
    if (data.status === "executed") {
      patch.executed_at = new Date().toISOString();
      if (data.outcome) patch.outcome = data.outcome;
    }
    if (data.outcome && data.status !== "executed") patch.outcome = data.outcome;
    const { error } = await supabase
      .from("decisions")
      .update(patch)
      .eq("id", data.id)
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
