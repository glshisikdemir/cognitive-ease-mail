import type { Email } from "./emails";

// Lightweight, deterministic heuristics so the dashboard can show
// cognitive load + priority instantly without waiting on AI for every row.
// The detail page replaces this with the real AI analysis.

export type Load = "low" | "medium" | "high";
export type Priority = "urgent" | "normal" | "ignore";

const noiseSenders = ["linkedin", "notion", "newsletter", "noreply", "no-reply", "notifications", "digest"];
const urgentWords = [
  "urgent", "today", "asap", "immediately", "deadline", "expires", "tonight",
  "acil", "bugün", "hemen", "son tarih",
];
const complaintWords = ["disagree", "concern", "issue", "problem", "complain", "endişe", "şikayet", "sorun"];

export function quickAssess(email: Email): { load: Load; priority: Priority } {
  const hay = `${email.sender} ${email.senderEmail} ${email.subject} ${email.preview}`.toLowerCase();
  const isNoise = noiseSenders.some((s) => hay.includes(s));
  if (isNoise) return { load: "low", priority: "ignore" };

  const urgent = urgentWords.some((w) => hay.includes(w));
  const complex = complaintWords.some((w) => hay.includes(w)) || email.body.length > 600;

  if (urgent) return { load: "high", priority: "urgent" };
  if (complex) return { load: "high", priority: "normal" };
  return { load: "medium", priority: "normal" };
}
