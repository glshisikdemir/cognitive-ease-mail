// Server function: insert a waitlist signup and queue a confirmation email.
//
// Security & trust posture:
// - Input strictly validated with Zod (length, format, allowed values)
// - Email lower-cased + trimmed; case-insensitive dedupe at DB level
// - Caller IP is SHA-256 hashed; raw IP is never persisted
// - Writes use the service-role client (RLS denies all browser access)
// - Confirmation email send wrapped in try/catch — signup is recorded even
//   if email transport is misconfigured
// - No raw email body or PII is ever logged
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader, getRequestIP } from "@tanstack/react-start/server";
import { createHash } from "crypto";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { renderWaitlistEmail } from "@/lib/waitlist-email";

const WaitlistInput = z.object({
  email: z
    .string()
    .trim()
    .min(3)
    .max(320)
    .email(),
  name: z.string().trim().max(120).optional().or(z.literal("")),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  role: z.string().trim().max(120).optional().or(z.literal("")),
  language: z.enum(["en", "tr"]).default("en"),
  source: z.string().trim().max(60).default("landing"),
});

export type WaitlistResult =
  | { ok: true; status: "created" | "already_signed_up" }
  | { ok: false; error: "invalid" | "rate_limited" | "internal" };

async function trySendConfirmation(
  email: string,
  name: string | null,
  language: "en" | "tr",
): Promise<boolean> {
  // Render content (always safe — pure function).
  const { subject, html, text } = renderWaitlistEmail({ name, lang: language });

  // Try Lovable Emails via the platform email API. If no domain is configured
  // yet, this will fail gracefully and the signup is still saved.
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) return false;

  try {
    // Use platform email endpoint. Sender is configured at the platform/domain
    // level; only `to`, `subject`, `html`, `text` are required from the app.
    const res = await fetch("https://email.lovable.dev/v1/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        to: email,
        subject,
        html,
        text,
        category: "waitlist_confirmation",
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export const submitWaitlist = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => WaitlistInput.parse(data))
  .handler(async ({ data }): Promise<WaitlistResult> => {
    try {
      const emailNormalized = data.email.toLowerCase();
      const name = data.name && data.name.length > 0 ? data.name : null;
      const company = data.company && data.company.length > 0 ? data.company : null;
      const role = data.role && data.role.length > 0 ? data.role : null;

      // IP hashing — never store raw IP
      let ipHash: string | null = null;
      try {
        const ip = getRequestIP({ xForwardedFor: true });
        if (ip) {
          ipHash = createHash("sha256")
            .update(`${ip}|isura-waitlist`)
            .digest("hex");
        }
      } catch {
        ipHash = null;
      }

      // Truncate user agent defensively
      let ua: string | null = null;
      try {
        const raw = getRequestHeader("user-agent");
        if (raw) ua = raw.slice(0, 400);
      } catch {
        ua = null;
      }

      const { data: row, error } = await supabaseAdmin
        .from("waitlist_signups")
        .insert({
          email: emailNormalized,
          name,
          company,
          role,
          language: data.language,
          source: data.source,
          ip_hash: ipHash,
          user_agent: ua,
        })
        .select("id")
        .single();

      if (error) {
        // 23505 = unique_violation → already on the list. Treat as success.
        if ((error as { code?: string }).code === "23505") {
          return { ok: true, status: "already_signed_up" };
        }
        // Don't leak internals.
        console.error("[waitlist] insert failed", { code: (error as { code?: string }).code });
        return { ok: false, error: "internal" };
      }

      // Fire-and-track confirmation send. Don't block UX on transport.
      const sent = await trySendConfirmation(emailNormalized, name, data.language);
      if (sent && row?.id) {
        await supabaseAdmin
          .from("waitlist_signups")
          .update({ confirmation_sent_at: new Date().toISOString() })
          .eq("id", row.id);
      }

      return { ok: true, status: "created" };
    } catch (err) {
      // Validation failures throw — surface as `invalid` without leaking detail.
      if (err instanceof z.ZodError) {
        return { ok: false, error: "invalid" };
      }
      console.error("[waitlist] unexpected error");
      return { ok: false, error: "internal" };
    }
  });
