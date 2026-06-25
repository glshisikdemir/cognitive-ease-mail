import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway";

// What ISURA decided to do in response to a spoken command.
const resultSchema = z.object({
  intent: z
    .enum(["overview", "read", "summarize", "draft", "send", "archive", "ignore", "none"])
    .describe(
      "The action to perform: overview (summarize the whole inbox), read (read one email aloud), summarize (summarize one email), draft (write a reply draft and wait for confirmation), send (the user confirmed — finalize/send the reply), archive, ignore, or none (just talk / ask for clarification).",
    ),
  emailId: z
    .string()
    .nullable()
    .describe("The id of the email this command targets, or null when it targets the whole inbox or none."),
  replyDraft: z
    .string()
    .nullable()
    .describe(
      "When intent is draft or send: the full reply text to that email, written in the email's own language, ready to send. Otherwise null.",
    ),
  spoken: z
    .string()
    .describe(
      "What ISURA says back to the operator, to be read aloud by a voice. Warm, calm, concise. In the target language. When a draft was written, read a short summary of it and ask for confirmation to send.",
    ),
});

export type VoiceAssistantResult = z.infer<typeof resultSchema>;

export const interpretVoiceCommand = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        lang: z.enum(["en", "tr"]),
        transcript: z.string().min(1).max(2000),
        pendingEmailId: z.string().nullable().optional(),
        history: z
          .array(z.object({ role: z.enum(["user", "isura"]), text: z.string().max(2000) }))
          .max(12)
          .optional(),
        emails: z
          .array(
            z.object({
              id: z.string(),
              sender: z.string(),
              subject: z.string(),
              body: z.string().max(4000),
              status: z.string().optional(),
            }),
          )
          .min(1)
          .max(30),
      })
      .parse(data),
  )
  .handler(async ({ data }): Promise<VoiceAssistantResult> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway("google/gemini-3-flash-preview");

    const langName = data.lang === "tr" ? "Turkish" : "English";

    const system = `You are ISURA — a calm, intelligent voice assistant that helps an operator manage their entire inbox hands-free, by talking.
You always reply in ${langName} for everything spoken to the operator.
The operator speaks natural commands. Figure out their intent against the inbox below and respond.

Capabilities:
- "overview": give a short spoken summary of what matters across the whole inbox. emailId = null.
- "read": identify the email they mean and read its essence aloud (who, what they ask, why it matters).
- "summarize": a tighter spoken summary of one email.
- "draft": when they ask you to reply / answer an email, WRITE the full reply in replyDraft (in the EMAIL's own language), then in spoken read a short summary of what you wrote and ask them to confirm sending. Honor their tone and instructions (e.g. "decline politely", "say yes and propose Tuesday").
- "send": ONLY when the operator confirms an already-drafted reply (e.g. "yes send it", "onayla", "gönder"). Reuse the pending draft. Put the final reply text in replyDraft.
- "archive" / "ignore": when they want to file or dismiss an email.
- "none": when unclear — ask a brief clarifying question in spoken.

Rules:
- Match emails loosely by sender name, subject topic, or order ("the first one", "Sarah's contract", "the demo request").
- Keep spoken text natural for listening: no markdown, no bullets, no email addresses, 1-4 sentences.
- Never invent emails that are not in the list. The operator stays fully in control — you draft, they confirm before anything is sent.`;

    const list = data.emails
      .map(
        (e, i) =>
          `[${i + 1}] id=${e.id} | from: ${e.sender} | status: ${e.status ?? "active"} | subject: ${e.subject}\n${e.body}`,
      )
      .join("\n\n---\n\n");

    const convo =
      data.history && data.history.length
        ? `\n\nRecent conversation:\n${data.history.map((h) => `${h.role === "user" ? "Operator" : "ISURA"}: ${h.text}`).join("\n")}`
        : "";

    const pending = data.pendingEmailId
      ? `\n\nThere is a reply draft awaiting confirmation for email id=${data.pendingEmailId}. If the operator confirms, use intent "send".`
      : "";

    const prompt = `Inbox (${data.emails.length} messages):\n\n${list}${convo}${pending}\n\nThe operator just said: "${data.transcript}"\n\nDecide the action and respond.`;

    try {
      const { experimental_output } = await generateText({
        model,
        system,
        prompt,
        experimental_output: Output.object({ schema: resultSchema }),
      });
      return experimental_output;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("429")) throw new Error("Rate limit reached. Please retry in a moment.");
      if (msg.includes("402")) throw new Error("AI credits exhausted. Add credits in workspace settings.");
      throw e;
    }
  });
