import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway";

const GATEWAY = "https://connector-gateway.lovable.dev";

const inputSchema = z.object({
  lang: z.enum(["en", "tr"]),
  assistantByChannel: z.record(
    z.enum(["email", "whatsapp", "slack", "telegram"]),
    z.enum(["operational", "concise", "formal"]),
  ),
  targets: z.object({
    email: z.string().max(200).optional(),
    whatsapp: z.string().max(40).optional(),
    slack: z.string().max(120).optional(),
    telegram: z.string().max(60).optional(),
  }),
  emails: z
    .array(
      z.object({
        sender: z.string().max(200),
        subject: z.string().max(300),
        body: z.string().max(4000),
        category: z.string().max(40).optional(),
      }),
    )
    .min(1)
    .max(20),
});

type ChannelResult = { channel: string; ok: boolean; reason?: string };

const TONE: Record<string, string> = {
  operational:
    "Full operational briefing covering risks and decisions, calm and clear.",
  concise: "Very short, to-the-point summary. A few lines maximum.",
  formal: "Polished, professional, formal tone.",
};

async function buildText(
  key: string,
  lang: "en" | "tr",
  assistant: string,
  emails: z.infer<typeof inputSchema>["emails"],
): Promise<string> {
  const gateway = createLovableAiGatewayProvider(key);
  const model = gateway("google/gemini-3-flash-preview");
  const langName = lang === "tr" ? "Turkish" : "English";
  const list = emails
    .map(
      (e, i) =>
        `[${i + 1}] from: ${e.sender} | ${e.category ?? ""} | subject: ${e.subject}\n${e.body}`,
    )
    .join("\n\n---\n\n");
  const { text } = await generateText({
    model,
    system: `You are ISURA, writing a plain-text message to send to a messaging channel. Write in ${langName}. ${TONE[assistant] ?? TONE.operational} No markdown, no headings symbols. Keep it readable in a chat message.`,
    prompt: `Today's inbox (${emails.length} messages). Write the message to send.\n\n${list}`,
  });
  return text.trim();
}

async function sendSlack(channel: string, text: string): Promise<ChannelResult> {
  const lovable = process.env.LOVABLE_API_KEY;
  const apiKey = process.env.SLACK_API_KEY;
  if (!lovable || !apiKey)
    return { channel: "slack", ok: false, reason: "not_connected" };
  const res = await fetch(`${GATEWAY}/slack/api/chat.postMessage`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovable}`,
      "X-Connection-Api-Key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ channel, text }),
  });
  const data = await res.json().catch(() => ({}));
  return { channel: "slack", ok: res.ok && data?.ok === true, reason: data?.error };
}

async function sendTelegram(chatId: string, text: string): Promise<ChannelResult> {
  const lovable = process.env.LOVABLE_API_KEY;
  const apiKey = process.env.TELEGRAM_API_KEY;
  if (!lovable || !apiKey)
    return { channel: "telegram", ok: false, reason: "not_connected" };
  const res = await fetch(`${GATEWAY}/telegram/sendMessage`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovable}`,
      "X-Connection-Api-Key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
  const data = await res.json().catch(() => ({}));
  return { channel: "telegram", ok: res.ok && data?.ok === true, reason: data?.description };
}

async function sendWhatsApp(to: string, text: string): Promise<ChannelResult> {
  const lovable = process.env.LOVABLE_API_KEY;
  const apiKey = process.env.TWILIO_API_KEY;
  const from = process.env.TWILIO_WHATSAPP_FROM;
  if (!lovable || !apiKey)
    return { channel: "whatsapp", ok: false, reason: "not_connected" };
  if (!from)
    return { channel: "whatsapp", ok: false, reason: "missing_from_number" };
  const res = await fetch(`${GATEWAY}/twilio/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovable}`,
      "X-Connection-Api-Key": apiKey,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      To: `whatsapp:${to}`,
      From: `whatsapp:${from}`,
      Body: text,
    }),
  });
  const data = await res.json().catch(() => ({}));
  return { channel: "whatsapp", ok: res.ok && !!data?.sid, reason: data?.message };
}

export const sendBriefing = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const results: ChannelResult[] = [];
    const textCache = new Map<string, string>();
    const getText = async (assistant: string) => {
      if (!textCache.has(assistant)) {
        textCache.set(assistant, await buildText(key, data.lang, assistant, data.emails));
      }
      return textCache.get(assistant)!;
    };

    if (data.targets.slack) {
      const txt = await getText(data.assistantByChannel.slack ?? "operational");
      results.push(await sendSlack(data.targets.slack, txt));
    }
    if (data.targets.telegram) {
      const txt = await getText(data.assistantByChannel.telegram ?? "concise");
      results.push(await sendTelegram(data.targets.telegram, txt));
    }
    if (data.targets.whatsapp) {
      const txt = await getText(data.assistantByChannel.whatsapp ?? "concise");
      results.push(await sendWhatsApp(data.targets.whatsapp, txt));
    }
    if (data.targets.email) {
      results.push({ channel: "email", ok: false, reason: "not_connected" });
    }

    return { results };
  });
