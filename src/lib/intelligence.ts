// ISURA Intelligence Guard — evidence-first signal layer.
//
// Core principle:
//   AI CAN INTERPRET. EVIDENCE MUST SUPPORT. GUARD MUST CHECK.
//   HUMANS HANDLE UNCERTAINTY.
//
// Every important signal carries provenance (source message + excerpt),
// a separated model confidence and evidence strength, a validation verdict
// from the Guard, contradiction status, and an audit trail.
//
// All data in this module is clearly-labelled fictional demo data for
// fictional agency accounts. It is never presented as a real connected
// mailbox.

export type SignalType =
  | "sentiment"
  | "intent"
  | "commitment"
  | "response_pattern"
  | "relationship_change"
  | "risk"
  | "revenue_at_risk";

/** How directly the source material supports the interpretation. */
export type EvidenceStrength = "strong" | "direct" | "indirect" | "weak" | "insufficient";

/** Guard verdict / trust state for a signal. */
export type TrustStatus = "verified" | "likely" | "uncertain" | "conflicting" | "unsupported";

export type ContradictionStatus =
  | "none"
  | "client_state_changed"
  | "ai_error"
  | "insufficient_evidence";

export interface EvidenceRef {
  /** Fictional demo message id. */
  messageId: string;
  /** Human label, e.g. "May 14 client email". */
  source: string;
  /** Verbatim excerpt from the source message — never paraphrased. */
  excerpt: string;
  date: string; // ISO
}

export interface Signal {
  id: string;
  clientId: string;
  signalType: SignalType;
  /** Short, plain-language statement of what ISURA believes. */
  value: string;
  /** Provenance. Empty means: no source material — the Guard must reject it. */
  evidence: EvidenceRef[];
  timestamp: string; // ISO — when the underlying message arrived
  extractedBy: string; // e.g. "isura-extract-v1"
  modelConfidence: number; // 0..1 — how confident the model is in its reading
  evidenceStrength: EvidenceStrength; // how well the source supports it
  /** Guard verdict. Computed, but stored so the audit trail is stable. */
  validationStatus: TrustStatus;
  contradictionStatus: ContradictionStatus;
  /** Prior account context this signal conflicts with, when applicable. */
  previousContext?: string;
  humanReviewRequired: boolean;
  /** Why the Guard landed on this verdict, in account-manager language. */
  guardNote: string;
  /** Explicit limits of what ISURA can conclude. */
  notKnown?: string;
  severity: "low" | "medium" | "high"; // impact on the relationship
  createdAt: string; // ISO — when the signal was extracted
}

// ---------------------------------------------------------------------------
// Presentation metadata
// ---------------------------------------------------------------------------

export const TRUST_META: Record<
  TrustStatus,
  { label: string; glyph: string; chip: string; blurb: string }
> = {
  verified: {
    label: "Verified",
    glyph: "✓",
    chip: "bg-load-low text-load-low-foreground",
    blurb: "Supported by direct evidence in the client's own words.",
  },
  likely: {
    label: "Likely",
    glyph: "◍",
    chip: "bg-surface-muted text-foreground",
    blurb: "Strong evidence, but some interpretation is involved.",
  },
  uncertain: {
    label: "Uncertain",
    glyph: "?",
    chip: "bg-load-medium text-load-medium-foreground",
    blurb: "Not enough evidence for a definitive conclusion.",
  },
  conflicting: {
    label: "Conflicting",
    glyph: "⚠",
    chip: "bg-load-medium text-load-medium-foreground",
    blurb: "This conflicts with what we previously recorded on the account.",
  },
  unsupported: {
    label: "Unsupported",
    glyph: "×",
    chip: "bg-load-high text-load-high-foreground",
    blurb: "The interpretation cannot be supported by the source material.",
  },
};

export const STRENGTH_META: Record<EvidenceStrength, { label: string; weight: number }> = {
  strong: { label: "Strong", weight: 1 },
  direct: { label: "Direct", weight: 0.85 },
  indirect: { label: "Indirect", weight: 0.5 },
  weak: { label: "Weak", weight: 0.3 },
  insufficient: { label: "Insufficient", weight: 0 },
};

export const SIGNAL_TYPE_LABEL: Record<SignalType, string> = {
  sentiment: "Sentiment",
  intent: "Intent",
  commitment: "Commitment",
  response_pattern: "Response pattern",
  relationship_change: "Relationship change",
  risk: "Risk",
  revenue_at_risk: "Revenue at risk",
};

export const CONTRADICTION_LABEL: Record<ContradictionStatus, string> = {
  none: "None detected",
  client_state_changed: "Client state changed",
  ai_error: "Unsupported claim",
  insufficient_evidence: "Insufficient evidence",
};

// ---------------------------------------------------------------------------
// The Guard — deterministic validation stage, separate from extraction.
//
// This intentionally does NOT ask the extraction model "are you sure?".
// It compares the claim against structured facts: is evidence present, is the
// interpretation stronger than its source, does prior account context conflict,
// are entities (dates, amounts, people, commitments) grounded in the excerpt.
//
// `validateSignal` is the single seam a future model-backed verifier or an
// AI Action Guard plugs into — same input, same verdict shape.
// ---------------------------------------------------------------------------

/** Hedging language: possibility, not a confirmed commitment. */
const HEDGE = /\b(should be able|maybe|might|may|we'?ll see|see if|hope|hoping|around|probably|likely|try to|aim to|explore|considering|thinking about)\b/i;

/** Entities that must be grounded in the excerpt, never inferred. */
const ENTITY_PATTERNS: { kind: string; re: RegExp }[] = [
  { kind: "amount", re: /\$\s?[\d,.]+(k|m)?/i },
  { kind: "date", re: /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{1,2}\/\d{1,2}|q[1-4])\b/i },
  { kind: "percentage", re: /\d+(\.\d+)?\s?%/ },
];

export interface GuardVerdict {
  status: TrustStatus;
  contradiction: ContradictionStatus;
  humanReviewRequired: boolean;
  /** Ordered plain-language findings from the checks that fired. */
  findings: string[];
  /** Entities in the claim that are not grounded in any excerpt. */
  ungroundedEntities: string[];
}

export interface GuardInput {
  signalType: SignalType;
  value: string;
  evidence: EvidenceRef[];
  modelConfidence: number;
  evidenceStrength: EvidenceStrength;
  previousContext?: string;
  /** Set when prior context differs because the client genuinely changed. */
  contradictionHint?: ContradictionStatus;
}

/** Entity kinds asserted by the claim but absent from every excerpt. */
function findUngroundedEntities(value: string, evidence: EvidenceRef[]): string[] {
  const corpus = evidence.map((e) => e.excerpt).join(" ");
  const out: string[] = [];
  for (const { kind, re } of ENTITY_PATTERNS) {
    if (re.test(value) && !re.test(corpus)) out.push(kind);
  }
  return out;
}

/**
 * Deterministic validation of one extracted signal.
 * Pure function — safe to run on the server or in the browser.
 */
export function validateSignal(input: GuardInput): GuardVerdict {
  const findings: string[] = [];
  const strength = STRENGTH_META[input.evidenceStrength].weight;
  const hasEvidence = input.evidence.length > 0;
  const corpus = input.evidence.map((e) => e.excerpt).join(" ");
  const hedged = HEDGE.test(corpus);
  const ungroundedEntities = findUngroundedEntities(input.value, input.evidence);

  // 1. No source material at all → never a fact.
  if (!hasEvidence) {
    findings.push("No source message supports this interpretation.");
    return {
      status: "unsupported",
      contradiction: "ai_error",
      humanReviewRequired: true,
      findings,
      ungroundedEntities,
    };
  }

  // 2. Prior account context conflicts.
  if (input.previousContext) {
    const kind = input.contradictionHint ?? "ai_error";
    if (kind === "client_state_changed") {
      findings.push(
        "The client previously said something different. This reads as a genuine change of mind, not an analysis error — the earlier note is kept alongside it.",
      );
      return {
        status: "conflicting",
        contradiction: "client_state_changed",
        humanReviewRequired: true,
        findings,
        ungroundedEntities,
      };
    }
    findings.push("This conflicts with existing account context and cannot be reconciled from the evidence.");
    return {
      status: "conflicting",
      contradiction: kind,
      humanReviewRequired: true,
      findings,
      ungroundedEntities,
    };
  }

  // 3. Entities asserted but not present in the source.
  if (ungroundedEntities.length > 0) {
    findings.push(
      `The ${ungroundedEntities.join(" and ")} in this conclusion does not appear in the client's message.`,
    );
    return {
      status: "unsupported",
      contradiction: "ai_error",
      humanReviewRequired: true,
      findings,
      ungroundedEntities,
    };
  }

  // 4. Evidence simply isn't enough.
  if (input.evidenceStrength === "insufficient") {
    findings.push("The source material does not go far enough to support a definitive conclusion.");
    return {
      status: "uncertain",
      contradiction: "insufficient_evidence",
      humanReviewRequired: true,
      findings,
      ungroundedEntities,
    };
  }

  // 5. A commitment built on hedging language is a possibility, not a promise.
  if (input.signalType === "commitment" && hedged) {
    findings.push(
      "The wording expresses possibility rather than a confirmed commitment, so ISURA records it as a possible commitment only.",
    );
    return {
      status: "uncertain",
      contradiction: "insufficient_evidence",
      humanReviewRequired: true,
      findings,
      ungroundedEntities,
    };
  }

  // 6. Interpretation stronger than its source.
  if (input.modelConfidence > 0.8 && strength <= 0.5) {
    findings.push(
      "The interpretation is more confident than the evidence behind it, so ISURA holds it as uncertain.",
    );
    return {
      status: "uncertain",
      contradiction: "insufficient_evidence",
      humanReviewRequired: true,
      findings,
      ungroundedEntities,
    };
  }

  // 7. Well-supported.
  if (strength >= 0.85 && input.modelConfidence >= 0.85) {
    findings.push("The client's own words directly support this, and nothing on the account conflicts with it.");
    return {
      status: "verified",
      contradiction: "none",
      humanReviewRequired: false,
      findings,
      ungroundedEntities,
    };
  }

  findings.push("Evidence points this way, but reading it required some interpretation.");
  return {
    status: "likely",
    contradiction: "none",
    humanReviewRequired: false,
    findings,
    ungroundedEntities,
  };
}

// ---------------------------------------------------------------------------
// Risk scoring — quality-weighted, not severity alone.
// Internal principle: severity × evidence strength × recency × confidence.
// Never surfaced to users as a formula.
// ---------------------------------------------------------------------------

const SEVERITY_WEIGHT = { low: 0.3, medium: 0.6, high: 1 } as const;

/** Verified signals count fully; uncertain ones count little; unsupported never count. */
const TRUST_WEIGHT: Record<TrustStatus, number> = {
  verified: 1,
  likely: 0.75,
  uncertain: 0.25,
  conflicting: 0.4,
  unsupported: 0,
};

function recencyWeight(iso: string, now = Date.now()): number {
  const days = Math.max(0, (now - new Date(iso).getTime()) / 86_400_000);
  if (days <= 7) return 1;
  if (days <= 21) return 0.8;
  if (days <= 45) return 0.55;
  return 0.3;
}

export interface RiskAssessment {
  score: number; // 0..100, quality-weighted
  level: "low" | "medium" | "high";
  /** Signals that carry weight, strongest contribution first. */
  contributing: { signal: Signal; contribution: number }[];
  /** Signals the Guard refused to count as fact. */
  excluded: Signal[];
  verifiedCount: number;
  uncertainCount: number;
  needsReviewCount: number;
}

export function assessRisk(signals: Signal[], now = Date.now()): RiskAssessment {
  const scored = signals
    .filter((s) => s.signalType !== "revenue_at_risk")
    .map((s) => {
      const contribution =
        SEVERITY_WEIGHT[s.severity] *
        STRENGTH_META[s.evidenceStrength].weight *
        TRUST_WEIGHT[s.validationStatus] *
        s.modelConfidence *
        recencyWeight(s.timestamp, now);
      return { signal: s, contribution };
    });

  const contributing = scored
    .filter((x) => x.contribution > 0.01)
    .sort((a, b) => b.contribution - a.contribution);
  const excluded = scored.filter((x) => x.contribution <= 0.01).map((x) => x.signal);

  const raw = contributing.reduce((sum, x) => sum + x.contribution, 0);
  // Saturating curve: several verified high-severity signals approach 100.
  const score = Math.round(100 * (1 - Math.exp(-raw / 2.2)));

  return {
    score,
    level: score >= 65 ? "high" : score >= 35 ? "medium" : "low",
    contributing,
    excluded,
    verifiedCount: signals.filter((s) => s.validationStatus === "verified").length,
    uncertainCount: signals.filter((s) => s.validationStatus === "uncertain").length,
    needsReviewCount: signals.filter((s) => s.humanReviewRequired).length,
  };
}

// ---------------------------------------------------------------------------
// Guard summary — one state a non-technical user can read at a glance.
// ---------------------------------------------------------------------------

export type GuardSummaryState = "verified" | "needs_review" | "conflicting" | "insufficient";

export const SUMMARY_META: Record<
  GuardSummaryState,
  { label: string; glyph: string; chip: string; blurb: string }
> = {
  verified: {
    label: "Verified",
    glyph: "✓",
    chip: "bg-load-low text-load-low-foreground",
    blurb: "Every signal behind this view is backed by the client's own words.",
  },
  needs_review: {
    label: "Needs review",
    glyph: "◐",
    chip: "bg-load-medium text-load-medium-foreground",
    blurb: "Some signals need a human read before you act on them.",
  },
  conflicting: {
    label: "Conflicting evidence",
    glyph: "⚠",
    chip: "bg-load-medium text-load-medium-foreground",
    blurb: "New information conflicts with what the account previously showed.",
  },
  insufficient: {
    label: "Insufficient evidence",
    glyph: "?",
    chip: "bg-surface-muted text-foreground",
    blurb: "There isn't enough source material to draw a conclusion yet.",
  },
};

export function summarize(signals: Signal[]): GuardSummaryState {
  if (signals.length === 0) return "insufficient";
  if (signals.some((s) => s.validationStatus === "conflicting")) return "conflicting";
  if (signals.some((s) => s.validationStatus === "unsupported")) return "needs_review";
  if (signals.some((s) => s.humanReviewRequired)) return "needs_review";
  if (signals.every((s) => s.validationStatus === "uncertain")) return "insufficient";
  return "verified";
}

export const knownSignals = (signals: Signal[]) =>
  signals.filter((s) => s.validationStatus === "verified" || s.validationStatus === "likely");

export const uncertainSignals = (signals: Signal[]) =>
  signals.filter(
    (s) =>
      s.validationStatus === "uncertain" ||
      s.validationStatus === "conflicting" ||
      s.validationStatus === "unsupported",
  );

// ---------------------------------------------------------------------------
// Audit trail — every important conclusion is traceable end to end.
// ---------------------------------------------------------------------------

export type AuditStage =
  | "email_received"
  | "signal_extracted"
  | "evidence_attached"
  | "guard_validated"
  | "risk_updated"
  | "human_review";

export interface AuditEntry {
  id: string;
  at: string; // ISO
  stage: AuditStage;
  detail: string;
}

export const AUDIT_STAGE_LABEL: Record<AuditStage, string> = {
  email_received: "Email received",
  signal_extracted: "Signal extracted",
  evidence_attached: "Evidence attached",
  guard_validated: "Guard validation",
  risk_updated: "Client risk updated",
  human_review: "Human review",
};

/** Rebuilds the audit trail for a client's signals from their provenance. */
export function auditTrail(signals: Signal[], riskLevel: string): AuditEntry[] {
  const out: AuditEntry[] = [];
  const ordered = [...signals].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );
  for (const s of ordered) {
    const ev = s.evidence[0];
    if (ev) {
      out.push({
        id: `${s.id}-recv`,
        at: ev.date,
        stage: "email_received",
        detail: ev.source,
      });
    }
    out.push({
      id: `${s.id}-extract`,
      at: s.createdAt,
      stage: "signal_extracted",
      detail: `${SIGNAL_TYPE_LABEL[s.signalType]}: ${s.value}`,
    });
    if (ev) {
      out.push({
        id: `${s.id}-evidence`,
        at: s.createdAt,
        stage: "evidence_attached",
        detail: `"${ev.excerpt}" — ${ev.source}`,
      });
    }
    out.push({
      id: `${s.id}-guard`,
      at: s.createdAt,
      stage: "guard_validated",
      detail: `${TRUST_META[s.validationStatus].label} · evidence ${STRENGTH_META[s.evidenceStrength].label.toLowerCase()}`,
    });
    if (s.humanReviewRequired) {
      out.push({
        id: `${s.id}-review`,
        at: s.createdAt,
        stage: "human_review",
        detail: "Flagged for your review before it counts as fact",
      });
    }
  }
  out.push({
    id: "risk",
    at: ordered[ordered.length - 1]?.createdAt ?? new Date().toISOString(),
    stage: "risk_updated",
    detail: `Client risk recalculated from verified signals: ${riskLevel}`,
  });
  return out;
}

export function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function fmtConfidence(c: number): string {
  return `${Math.round(c * 100)}%`;
}
