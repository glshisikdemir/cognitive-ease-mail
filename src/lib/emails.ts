export type Email = {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  preview: string;
  body: string;
  receivedAt: string; // ISO
  language: "en" | "tr";
};

export const emails: Email[] = [
  {
    id: "1",
    sender: "Sarah Chen",
    senderEmail: "sarah.chen@northwind.io",
    subject: "Contract renewal — needs signature today",
    preview: "Hi — legal flagged the renewal as expiring tonight. Can you review and sign before 6pm?",
    body: `Hi,

Legal just flagged that our annual platform contract with Northwind expires tonight at midnight UTC. The renewal terms are unchanged from last year (same pricing, same SLA), but we need a countersignature before 6pm to avoid a service interruption tomorrow morning.

I've attached the redlined PDF. Two changes worth noting:
1. Liability cap raised from $500k to $1M (in our favor)
2. Auto-renew clause now opt-in instead of opt-out

Could you sign and send back today? Happy to jump on a quick call if anything is unclear.

Thanks,
Sarah`,
    receivedAt: "2026-05-08T08:14:00Z",
    language: "en",
  },
  {
    id: "2",
    sender: "Mehmet Aydın",
    senderEmail: "mehmet@kobiteknoloji.com.tr",
    subject: "Demo talebi — yeni ekibimiz için",
    preview: "Merhaba, ürününüzü 12 kişilik ekibimize tanıtmak için bir demo planlayabilir miyiz?",
    body: `Merhaba,

İstanbul merkezli bir fintech firmasında ürün müdürüyüm. Geçtiğimiz hafta web sitenizi inceledim ve özellikle bilişsel yük puanlama özelliği ekibimizin günlük iletişim yükünü azaltabileceğimizi düşündürdü.

12 kişilik bir ekibiz ve önümüzdeki iki hafta içinde bir demo ayarlayabilirsek çok memnun oluruz. Salı veya Perşembe öğleden sonraları bize uygun.

Fiyatlandırma hakkında da kısaca bilgi alabilir miyim?

Saygılarımla,
Mehmet Aydın
Ürün Müdürü, KOBİ Teknoloji`,
    receivedAt: "2026-05-08T07:42:00Z",
    language: "tr",
  },
  {
    id: "3",
    sender: "LinkedIn",
    senderEmail: "notifications@linkedin.com",
    subject: "You appeared in 14 searches this week",
    preview: "See who's looking at your profile. Recruiters from 6 companies viewed you.",
    body: `Hi,

You appeared in 14 searches this week — that's a 22% increase over last week.

Recruiters from these companies viewed your profile:
• Stripe
• Notion
• Linear
• Figma
• Vercel
• Anthropic

Upgrade to Premium to see who they are and message them directly.

— The LinkedIn Team`,
    receivedAt: "2026-05-08T06:30:00Z",
    language: "en",
  },
  {
    id: "4",
    sender: "Ayşe Demir",
    senderEmail: "ayse.demir@hukukofisi.com.tr",
    subject: "Sözleşme taslağı — geri bildirim",
    preview: "İletmiş olduğunuz sözleşme taslağını inceledim. Birkaç madde üzerinde küçük değişiklik öneriyorum.",
    body: `Sayın Yetkili,

Geçtiğimiz Cuma iletmiş olduğunuz hizmet sözleşmesi taslağını dikkatlice inceledim. Genel olarak metin oldukça net ve dengeli hazırlanmış.

Üç maddede küçük değişiklik öneriyorum:
1. Madde 7.2 — Fesih bildirim süresinin 30 günden 45 güne çıkarılması
2. Madde 11 — KVKK uyumu için ek bir paragraf ekledim
3. Madde 14 — Yetkili mahkeme tanımının netleştirilmesi

Düzeltilmiş versiyonu ek olarak iletiyorum. Acil değildir, önümüzdeki hafta içinde dönüş yapmanız yeterli.

Saygılarımla,
Av. Ayşe Demir`,
    receivedAt: "2026-05-07T16:05:00Z",
    language: "tr",
  },
  {
    id: "5",
    sender: "Notion Team",
    senderEmail: "team@notion.so",
    subject: "Your weekly digest",
    preview: "5 pages were updated in your workspace this week. Here's a summary.",
    body: `Hello,

Here's your weekly digest from Notion.

5 pages were updated in your workspace this week:
• Q2 Roadmap
• Engineering Standups
• Hiring Pipeline
• Customer Feedback Log
• Team Offsite Planning

You can manage notification frequency in Settings.

— Notion`,
    receivedAt: "2026-05-07T09:00:00Z",
    language: "en",
  },
  {
    id: "6",
    sender: "Dr. Elena Rossi",
    senderEmail: "e.rossi@miura-research.org",
    subject: "Disagreement on the methodology section",
    preview: "I've read your draft carefully and I have serious concerns about how we framed the control group.",
    body: `Dear colleague,

I've now read the latest draft of our joint paper twice. While I think the data is strong, I have serious concerns about how we framed the control group in the methodology section (pp. 8–11).

Specifically, the way we describe the exclusion criteria could be read as cherry-picking, and I think a reviewer at Nature would push back hard on this. I've drafted an alternative framing in the attached doc (track changes on).

I know we agreed to submit by Friday, but I'd rather delay by a week than send something we'll have to retract. Could we hop on a call tomorrow morning your time to discuss?

Best,
Elena`,
    receivedAt: "2026-05-07T22:30:00Z",
    language: "en",
  },
];

export function getEmail(id: string): Email | undefined {
  return emails.find((e) => e.id === id);
}
