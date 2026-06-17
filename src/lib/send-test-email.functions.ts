import { createServerFn } from "@tanstack/react-start";
import { getRequestUrl, getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";

const inputSchema = z.object({
  to: z.string().email().max(200),
  lang: z.enum(["en", "tr"]).default("en"),
});

export type EmailTestResult = { ok: boolean; reason?: string };

function subject(lang: "en" | "tr"): string {
  return lang === "tr" ? "ISURA test e-postası" : "ISURA test email";
}

export const sendTestEmail = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }): Promise<EmailTestResult> => {
    // Forward to the Lovable transactional email send route (same origin).
    const origin = new URL(getRequestUrl()).origin;
    const auth = getRequestHeader("authorization");

    try {
      const res = await fetch(`${origin}/lovable/email/transactional/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(auth ? { Authorization: auth } : {}),
        },
        body: JSON.stringify({
          templateName: "channel-test",
          recipientEmail: data.to,
          idempotencyKey: `channel-test-${data.to}-${Date.now()}`,
          templateData: { lang: data.lang, subject: subject(data.lang) },
        }),
      });

      if (res.status === 404) return { ok: false, reason: "not_ready" };
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        return { ok: false, reason: txt?.slice(0, 120) || `http_${res.status}` };
      }
      return { ok: true };
    } catch {
      return { ok: false, reason: "not_ready" };
    }
  });
