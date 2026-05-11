// Waitlist confirmation email content. Plain templates so we can render them
// from any provider (Lovable Emails, Resend, etc.) without coupling.

export type WaitlistEmailLang = "en" | "tr";

export interface WaitlistEmailInput {
  name?: string | null;
  lang: WaitlistEmailLang;
}

const COPY = {
  en: {
    subject: "Welcome to ISURA Private Pilot",
    preheader: "You're on the list for ISURA private pilot access.",
    greeting: (name?: string | null) =>
      name ? `Hello ${name},` : "Hello,",
    intro:
      "Thank you for requesting access to ISURA — the operational cognition platform for overloaded teams.",
    process_h: "How the private pilot works",
    process: [
      "Access is invite-based. We onboard a small number of operators each week to keep quality of attention high.",
      "When we open a slot for you, our founders will reach out personally to walk you through setup.",
      "You'll connect your inbox in read-only mode first. ISURA never sends emails without your explicit approval.",
    ],
    trust_h: "How we protect you",
    trust: [
      "ISURA never sends emails without your approval.",
      "Read-only inbox analysis is available at any time.",
      "You can disconnect ISURA's access in one click.",
      "Your emails are never used to train AI models.",
    ],
    closing:
      "We will be in touch as soon as a pilot slot opens. In the meantime, no further action is needed from you.",
    signoff: "— The ISURA team",
    footer: "You received this because you requested access on isura.app.",
  },
  tr: {
    subject: "ISURA Özel Pilot Programına Hoş Geldiniz",
    preheader: "ISURA özel pilot erişimi için listedesiniz.",
    greeting: (name?: string | null) =>
      name ? `Merhaba ${name},` : "Merhaba,",
    intro:
      "ISURA'ya — aşırı yüklenmiş ekipler için operasyonel biliş platformuna — erişim talep ettiğiniz için teşekkür ederiz.",
    process_h: "Özel pilot süreci nasıl işler",
    process: [
      "Erişim davete bağlıdır. Dikkat kalitesini korumak için her hafta yalnızca az sayıda operatörü dahil ediyoruz.",
      "Sıranız geldiğinde kuruculardan biri sizinle bizzat iletişime geçer ve kurulumda eşlik eder.",
      "Önce gelen kutunuzu yalnızca okuma modunda bağlarsınız. ISURA, açık onayınız olmadan asla e-posta göndermez.",
    ],
    trust_h: "Sizi nasıl koruduğumuz",
    trust: [
      "ISURA, onayınız olmadan asla e-posta göndermez.",
      "Yalnızca okuma modunda gelen kutusu analizi her zaman mevcuttur.",
      "ISURA'nın erişimini istediğiniz an tek tıkla kesebilirsiniz.",
      "E-postalarınız hiçbir AI modelini eğitmek için kullanılmaz.",
    ],
    closing:
      "Bir pilot kontenjanı açılır açılmaz size ulaşacağız. O zamana kadar başka bir işlem yapmanız gerekmiyor.",
    signoff: "— ISURA ekibi",
    footer:
      "Bu e-postayı isura.app üzerinden erişim talep ettiğiniz için aldınız.",
  },
} as const;

export function renderWaitlistEmail(input: WaitlistEmailInput): {
  subject: string;
  text: string;
  html: string;
} {
  const c = COPY[input.lang] ?? COPY.en;

  const text = [
    c.greeting(input.name),
    "",
    c.intro,
    "",
    c.process_h.toUpperCase(),
    ...c.process.map((p) => `• ${p}`),
    "",
    c.trust_h.toUpperCase(),
    ...c.trust.map((p) => `• ${p}`),
    "",
    c.closing,
    "",
    c.signoff,
    "",
    c.footer,
  ].join("\n");

  // Brand-consistent, calm, premium HTML. White background.
  // Inline styles only (email client compatibility).
  const html = `<!doctype html>
<html lang="${input.lang}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${escapeHtml(c.subject)}</title>
</head>
<body style="margin:0;padding:0;background:#f7f7f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#0F1117;">
  <span style="display:none!important;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;mso-hide:all;">${escapeHtml(c.preheader)}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f7f7f5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;background:#ffffff;border:1px solid #ececea;border-radius:14px;overflow:hidden;">
          <tr>
            <td style="padding:28px 32px 0;">
              <div style="display:inline-flex;align-items:center;gap:10px;">
                <span style="display:inline-block;width:24px;height:24px;background:#0F1117;color:#ffffff;text-align:center;line-height:24px;border-radius:6px;font-weight:600;font-size:13px;">I</span>
                <span style="font-weight:600;letter-spacing:0.04em;font-size:13px;color:#0F1117;">ISURA</span>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 32px 8px;">
              <h1 style="margin:0;font-size:22px;line-height:1.25;font-weight:600;color:#0F1117;letter-spacing:-0.01em;">${escapeHtml(c.subject)}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:6px 32px 0;">
              <p style="margin:0 0 14px;font-size:14px;line-height:1.6;color:#0F1117;">${escapeHtml(c.greeting(input.name))}</p>
              <p style="margin:0 0 18px;font-size:14px;line-height:1.65;color:#3a3d44;">${escapeHtml(c.intro)}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 0;">
              <div style="font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#85878d;margin-bottom:10px;">${escapeHtml(c.process_h)}</div>
              <ul style="margin:0 0 18px;padding:0;list-style:none;">
                ${c.process.map((p) => `<li style="position:relative;padding:0 0 10px 16px;font-size:13.5px;line-height:1.6;color:#3a3d44;"><span style="position:absolute;left:0;top:9px;width:5px;height:5px;background:#0F1117;border-radius:50%;display:inline-block;"></span>${escapeHtml(p)}</li>`).join("")}
              </ul>
            </td>
          </tr>
          <tr>
            <td style="padding:6px 32px 0;">
              <div style="background:#f7f7f5;border:1px solid #ececea;border-radius:10px;padding:18px 18px 8px;">
                <div style="font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#85878d;margin-bottom:10px;">${escapeHtml(c.trust_h)}</div>
                <ul style="margin:0;padding:0;list-style:none;">
                  ${c.trust.map((p) => `<li style="position:relative;padding:0 0 10px 16px;font-size:13px;line-height:1.55;color:#0F1117;"><span style="position:absolute;left:0;top:8px;width:5px;height:5px;background:#0F1117;border-radius:50%;display:inline-block;"></span>${escapeHtml(p)}</li>`).join("")}
                </ul>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 8px;">
              <p style="margin:0 0 18px;font-size:13.5px;line-height:1.65;color:#3a3d44;">${escapeHtml(c.closing)}</p>
              <p style="margin:0 0 28px;font-size:13.5px;color:#0F1117;">${escapeHtml(c.signoff)}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:14px 32px 24px;border-top:1px solid #ececea;">
              <p style="margin:0;font-size:11.5px;line-height:1.55;color:#85878d;">${escapeHtml(c.footer)}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject: c.subject, text, html };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
