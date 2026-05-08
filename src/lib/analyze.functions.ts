import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway";

const analysisSchema = z.object({
  language: z.enum(["en", "tr"]).describe("Detected language of the email"),
  cognitiveLoad: z.enum(["low", "medium", "high"]),
  priority: z.enum(["urgent", "normal", "ignore"]),
  summary: z.string().describe("1–2 sentence summary in the same language as the email"),
  intent: z.enum(["support", "sales", "question", "complaint", "informational", "other"]),
  shouldRespond: z.enum(["yes", "no", "delegate"]),
  reasoning: z.string().describe("One short, plain-language sentence in the email's language"),
  urgencyLevel: z.enum(["low", "medium", "high"]),
  tone: z.enum(["formal", "neutral", "friendly"]),
  replyDraft: z.string().describe("A complete, ready-to-send reply in the same language and matching tone"),
});

export type EmailAnalysis = z.infer<typeof analysisSchema>;

export const analyzeEmail = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({
      sender: z.string(),
      subject: z.string(),
      body: z.string(),
      regenerate: z.boolean().optional(),
    }).parse(data),
  )
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway("google/gemini-3-flash-preview");

    const system = `You are ISURA, a calm, decisive Chief of Staff for email.
Your job: reduce the user's cognitive load. Be grounded strictly in the email content. Never invent facts.
- Detect the email's language (English or Turkish) and respond in THAT language for: summary, reasoning, replyDraft.
- Cognitive load: "low" = quick reply or ignore; "medium" = needs attention; "high" = urgent or complex.
- Priority: "urgent" needs action today; "normal" needs a thoughtful reply; "ignore" is noise (newsletters, automated digests).
- Decision: "yes" if user must reply, "no" for noise, "delegate" if it should go to someone else.
- Tone: match the sender's register and cultural style. For Turkish, preserve appropriate politeness ("Merhaba", "Saygılarımla", etc.). For English, match formal/neutral/friendly to context.
- Reply draft: complete, ready-to-send. Concise. No placeholders like [Your Name].
- Sign drafts simply (e.g., "Best," or "Saygılarımla,").`;

    const prompt = `From: ${data.sender}
Subject: ${data.subject}

${data.body}

Analyze this email.${data.regenerate ? " Provide a fresh take with different phrasing." : ""}`;

    try {
      const { experimental_output } = await generateText({
        model,
        system,
        prompt,
        experimental_output: Output.object({ schema: analysisSchema }),
      });
      return experimental_output;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("429")) throw new Error("Rate limit reached. Please retry in a moment.");
      if (msg.includes("402")) throw new Error("AI credits exhausted. Add credits in workspace settings.");
      throw e;
    }
  });
