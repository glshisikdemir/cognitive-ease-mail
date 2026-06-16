import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY = "https://connector-gateway.lovable.dev";

const inputSchema = z.object({
  channel: z.enum(["slack", "telegram", "whatsapp"]),
  target: z.string().min(1).max(120),
  lang: z.enum(["en", "tr"]).default("en"),
});

export type TestResult = { ok: boolean; reason?: string };

function testMessage(lang: "en" | "tr"): string {
  return lang === "tr"
    ? "✅ ISURA test mesajı — bağlantın çalışıyor. Brifinglerin buraya gelecek."
    : "✅ ISURA test message — your connection works. Your briefings will arrive here.";
}

async function sendSlack(channel: string, text: string): Promise<TestResult> {
  const lovable = process.env.LOVABLE_API_KEY;
  const apiKey = process.env.SLACK_API_KEY;
  if (!lovable || !apiKey) return { ok: false, reason: "not_connected" };
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
  return { ok: res.ok && data?.ok === true, reason: data?.error };
}

async function sendTelegram(chatId: string, text: string): Promise<TestResult> {
  const lovable = process.env.LOVABLE_API_KEY;
  const apiKey = process.env.TELEGRAM_API_KEY;
  if (!lovable || !apiKey) return { ok: false, reason: "not_connected" };
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
  return { ok: res.ok && data?.ok === true, reason: data?.description };
}

async function sendWhatsApp(to: string, text: string): Promise<TestResult> {
  const lovable = process.env.LOVABLE_API_KEY;
  const apiKey = process.env.TWILIO_API_KEY;
  const from = process.env.TWILIO_WHATSAPP_FROM;
  if (!lovable || !apiKey) return { ok: false, reason: "not_connected" };
  if (!from) return { ok: false, reason: "missing_from_number" };
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
  return { ok: res.ok && !!data?.sid, reason: data?.message };
}

export const sendTestMessage = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }): Promise<TestResult> => {
    const text = testMessage(data.lang);
    if (data.channel === "slack") return sendSlack(data.target, text);
    if (data.channel === "telegram") return sendTelegram(data.target, text);
    return sendWhatsApp(data.target, text);
  });
