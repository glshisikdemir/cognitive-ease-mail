import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway";

const schema = z.object({
  subject: z.string().describe("A clear, concise subject line for the email."),
  body: z.string().describe("The full, ready-to-send email body, warmly signed off."),
});

export type ComposedEmail = z.infer<typeof schema>;

export const composeEmail = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        lang: z.enum(["en", "tr"]),
        instruction: z.string().min(1).max(2000),
        to: z.string().max(200).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }): Promise<ComposedEmail> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway("google/gemini-3-flash-preview");
    const langName = data.lang === "tr" ? "Turkish" : "English";

    const system = `You write professional, warm, and concise emails in ${langName}.
Return a clear subject line and a complete, ready-to-send body.
Do not use placeholders like [name] unless the instruction makes it unavoidable. Sign off naturally.`;

    const prompt = `Write a brand-new email${data.to ? ` addressed to ${data.to}` : ""} based on this instruction:\n\n"${data.instruction}"`;

    try {
      const { experimental_output } = await generateText({
        model,
        system,
        prompt,
        experimental_output: Output.object({ schema }),
      });
      return experimental_output;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("429")) throw new Error("Rate limit reached. Please retry in a moment.");
      if (msg.includes("402")) throw new Error("AI credits exhausted. Add credits in workspace settings.");
      throw e;
    }
  });
