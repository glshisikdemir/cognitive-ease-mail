import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway";

const segmentSchema = z.object({
  emailId: z.string().nullable().describe("Source email id, or null for intro/outro"),
  kind: z.enum(["intro", "email", "outro"]),
  title: z.string().describe("Short spoken title for this segment, in the target language"),
  spoken: z
    .string()
    .describe(
      "The full spoken narration for this segment. Warm, calm, podcast-host voice. 2–5 sentences. In the target language.",
    ),
});

const briefingSchema = z.object({
  segments: z.array(segmentSchema).min(2),
});

export type BriefingSegment = z.infer<typeof segmentSchema>;

export const generateBriefing = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        lang: z.enum(["en", "tr"]),
        emails: z
          .array(
            z.object({
              id: z.string(),
              sender: z.string(),
              subject: z.string(),
              body: z.string().max(4000),
              category: z.string().optional(),
            }),
          )
          .min(1)
          .max(20),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway("google/gemini-3-flash-preview");

    const langName = data.lang === "tr" ? "Turkish" : "English";

    const system = `You are ISURA — a calm, intelligent audio briefing host, like a private chief-of-staff narrating a short, premium podcast about the operator's inbox.
Write everything in ${langName}.
Style: warm, composed, human, never robotic. No hype, no aggressive automation language. You reduce cognitive load and keep the operator in control.
Produce a sequence of spoken segments meant to be read aloud by a text-to-speech voice:
- ONE "intro": greet the listener and give a one-line overview of how many items matter today.
- ONE "email" segment per email provided (in priority order, most consequential first): say who it is from, what it asks, why it matters, and a calm recommendation. Add a brief, insightful commentary — like a podcast host reacting.
- ONE "outro": a short, calming sign-off reminding them they stay fully in control of every action.
Keep each spoken text natural for listening (no markdown, no bullet symbols, no email addresses read out). Each spoken text 2–5 sentences.`;

    const list = data.emails
      .map(
        (e, i) =>
          `[${i + 1}] id=${e.id} | from: ${e.sender} | category: ${e.category ?? "unknown"} | subject: ${e.subject}\n${e.body}`,
      )
      .join("\n\n---\n\n");

    const prompt = `Today's inbox (${data.emails.length} messages). Create the audio briefing script.\n\n${list}`;

    try {
      const { experimental_output } = await generateText({
        model,
        system,
        prompt,
        experimental_output: Output.object({ schema: briefingSchema }),
      });
      return experimental_output;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("429")) throw new Error("Rate limit reached. Please retry in a moment.");
      if (msg.includes("402")) throw new Error("AI credits exhausted. Add credits in workspace settings.");
      throw e;
    }
  });
