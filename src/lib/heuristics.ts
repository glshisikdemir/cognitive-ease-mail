import type { Email } from "./emails";

// Lightweight, deterministic operational-cognition heuristics.
// The detail page enriches this with the AI analysis.

export type Load = "low" | "medium" | "high";
export type Priority = "urgent" | "normal" | "ignore";

// ISURA's operational categories (replace generic "load" terminology).
export type OpCategory =
  | "decision"     // Requires Decision
  | "risk"         // Operational Risk
  | "waiting"      // Waiting On Others
  | "low_value"    // Low Cognitive Value
  | "safe_ignore"; // Safe to Ignore

export type Confidence = "high" | "medium" | "review";

// Reason chips shown in "Why this matters". Each entry is a translation key
// in src/lib/i18n.tsx with optional vars for templating.
export type Reason = { key: string; vars?: Record<string, string | number> };

export type Assessment = {
  load: Load;
  priority: Priority;
  category: OpCategory;
  confidence: Confidence;
  reasons: Reason[];
};

const noiseSenders = ["linkedin", "notion", "newsletter", "noreply", "no-reply", "notifications", "digest"];
const urgentWords = [
  "urgent", "today", "asap", "immediately", "deadline", "expires", "tonight", "before 6",
  "acil", "bugün", "hemen", "son tarih",
];
const riskWords = [
  "interruption", "outage", "expires", "expire", "liability", "breach", "risk", "down",
  "kesinti", "ihlal", "risk",
];
const decisionWords = [
  "sign", "signature", "approve", "decide", "decision", "review", "renewal", "contract",
  "imza", "onay", "karar", "sözleşme",
];
const waitingWords = [
  "follow up", "following up", "any update", "checking in", "waiting", "ping",
  "takip", "geri dönüş", "bekliyorum",
];
const complaintWords = ["disagree", "concern", "issue", "problem", "complain", "endişe", "şikayet", "sorun"];

export function quickAssess(email: Email): Assessment {
  const hay = `${email.sender} ${email.senderEmail} ${email.subject} ${email.preview} ${email.body}`.toLowerCase();
  const reasons: Reason[] = [];

  const isNoise = noiseSenders.some((s) => hay.includes(s));
  if (isNoise) {
    reasons.push({ key: "rsn_automated_sender" });
    reasons.push({ key: "rsn_no_action_required" });
    return {
      load: "low",
      priority: "ignore",
      category: "safe_ignore",
      confidence: "high",
      reasons,
    };
  }

  const urgent = urgentWords.some((w) => hay.includes(w));
  const isRisk = riskWords.some((w) => hay.includes(w));
  const needsDecision = decisionWords.some((w) => hay.includes(w));
  const isWaiting = waitingWords.some((w) => hay.includes(w));
  const isComplex = complaintWords.some((w) => hay.includes(w)) || email.body.length > 600;

  // Operational risk takes precedence — these have downstream consequences.
  if (isRisk && urgent) {
    reasons.push({ key: "rsn_service_interruption" });
    if (needsDecision) reasons.push({ key: "rsn_signature_required" });
    reasons.push({ key: "rsn_time_critical" });
    return {
      load: "high",
      priority: "urgent",
      category: "risk",
      confidence: "high",
      reasons,
    };
  }

  if (needsDecision && urgent) {
    reasons.push({ key: "rsn_decision_required_today" });
    reasons.push({ key: "rsn_blocks_others" });
    return {
      load: "high",
      priority: "urgent",
      category: "decision",
      confidence: "high",
      reasons,
    };
  }

  if (isComplex) {
    reasons.push({ key: "rsn_substantive_input_needed" });
    if (hay.includes("methodology") || hay.includes("yöntem")) reasons.push({ key: "rsn_affects_outcome" });
    return {
      load: "high",
      priority: "normal",
      category: "decision",
      confidence: "medium",
      reasons,
    };
  }

  if (isWaiting) {
    reasons.push({ key: "rsn_awaiting_external_response" });
    return {
      load: "medium",
      priority: "normal",
      category: "waiting",
      confidence: "medium",
      reasons,
    };
  }

  if (urgent) {
    reasons.push({ key: "rsn_time_critical" });
    return {
      load: "high",
      priority: "urgent",
      category: "decision",
      confidence: "medium",
      reasons,
    };
  }

  // Default: medium-load conversational email needing a thoughtful, low-stakes reply.
  reasons.push({ key: "rsn_routine_correspondence" });
  return {
    load: "medium",
    priority: "normal",
    category: "low_value",
    confidence: "medium",
    reasons,
  };
}

// Compact metrics for the cognitive relief dashboard.
export type ReliefMetrics = {
  decisionsSimplified: number;     // emails ISURA pre-decided (any non-active or auto-categorized)
  risksDetected: number;           // operational risk count
  focusMinutesRecovered: number;   // estimated minutes saved by hiding low-value items
  pressureReduced: number;         // 0-100 score
  cognitiveLoadScore: number;      // 0-100, lower is better
};

export function computeRelief(
  assessments: { assessment: Assessment; status: string }[],
): ReliefMetrics {
  const total = assessments.length || 1;
  const risks = assessments.filter((a) => a.assessment.category === "risk").length;
  const lowValue = assessments.filter(
    (a) => a.assessment.category === "low_value" || a.assessment.category === "safe_ignore",
  ).length;
  const decisions = assessments.filter(
    (a) => a.status !== "active" || a.assessment.category === "safe_ignore",
  ).length;
  const highCount = assessments.filter((a) => a.assessment.load === "high").length;

  const focusMinutesRecovered = lowValue * 3;
  const pressureReduced = Math.min(100, Math.round((lowValue / total) * 100));
  const cognitiveLoadScore = Math.min(100, Math.round((highCount / total) * 100));

  return {
    decisionsSimplified: decisions,
    risksDetected: risks,
    focusMinutesRecovered,
    pressureReduced,
    cognitiveLoadScore,
  };
}
