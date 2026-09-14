// Fictional demo signals for the ISURA Intelligence Guard.
// Each seed is passed through the real Guard (`validateSignal`) so the demo
// verdicts are produced by the same deterministic checks production uses.

import {
  validateSignal,
  type ContradictionStatus,
  type EvidenceRef,
  type EvidenceStrength,
  type Signal,
  type SignalType,
} from "./intelligence";

interface Seed {
  id: string;
  clientId: string;
  signalType: SignalType;
  value: string;
  evidence: EvidenceRef[];
  modelConfidence: number;
  evidenceStrength: EvidenceStrength;
  severity: "low" | "medium" | "high";
  previousContext?: string;
  contradictionHint?: ContradictionStatus;
  notKnown?: string;
}

const SEEDS: Seed[] = [
  // --- Meridian Retail: verified negative sentiment + real commitment ------
  {
    id: "s-meridian-sentiment",
    clientId: "meridian",
    signalType: "sentiment",
    value: "Sarah is unhappy with the last campaign and wants to talk about it",
    evidence: [
      {
        messageId: "m-1401",
        source: "Sarah Lindqvist · client email",
        excerpt: "The last campaign was disappointing and we need to discuss this.",
        date: "2026-07-04T09:12:00Z",
      },
    ],
    modelConfidence: 0.93,
    evidenceStrength: "strong",
    severity: "high",
  },
  {
    id: "s-meridian-commitment",
    clientId: "meridian",
    signalType: "commitment",
    value: "We committed to deliver the revised homepage cut before Friday",
    evidence: [
      {
        messageId: "m-1402",
        source: "Nadia Okafor · our reply",
        excerpt: "We will have the updated cut with you before Friday.",
        date: "2026-07-04T15:40:00Z",
      },
    ],
    modelConfidence: 0.95,
    evidenceStrength: "strong",
    severity: "medium",
  },
  {
    id: "s-meridian-renewal",
    clientId: "meridian",
    signalType: "intent",
    value: "Renewal is confirmed for the next term",
    evidence: [
      {
        messageId: "m-1403",
        source: "Sarah Lindqvist · client email",
        excerpt: "We're happy with the work, but we need to review the budget internally.",
        date: "2026-06-15T11:02:00Z",
      },
    ],
    modelConfidence: 0.71,
    evidenceStrength: "insufficient",
    severity: "high",
    notKnown:
      "Sarah expressed satisfaction but never confirmed renewal. Budget review is still open.",
  },
  {
    id: "s-meridian-pattern",
    clientId: "meridian",
    signalType: "response_pattern",
    value: "Their replies have slowed noticeably over the last two weeks",
    evidence: [
      {
        messageId: "m-1404",
        source: "Reply timings across 6 recent threads",
        excerpt: "Median reply time moved from 5 hours to 31 hours across the last 6 threads.",
        date: "2026-07-02T08:00:00Z",
      },
    ],
    modelConfidence: 0.88,
    evidenceStrength: "direct",
    severity: "medium",
  },

  // --- Bluestone Health: hedged commitment + unsupported amount ------------
  {
    id: "s-bluestone-possible",
    clientId: "bluestone",
    signalType: "commitment",
    value: "Michael will send the revised deck next Thursday",
    evidence: [
      {
        messageId: "m-2201",
        source: "Michael Cho · client email",
        excerpt: "We should be able to send the revised deck next Thursday.",
        date: "2026-07-01T16:20:00Z",
      },
    ],
    modelConfidence: 0.86,
    evidenceStrength: "direct",
    severity: "medium",
    notKnown: "The wording is a possibility, not a confirmed date.",
  },
  {
    id: "s-bluestone-budget",
    clientId: "bluestone",
    signalType: "revenue_at_risk",
    value: "Client signalled a $40,000 budget cut for Q3",
    evidence: [
      {
        messageId: "m-2202",
        source: "Lena Ford · client email",
        excerpt: "Finance is taking another look at next quarter's spend.",
        date: "2026-06-29T10:05:00Z",
      },
    ],
    modelConfidence: 0.79,
    evidenceStrength: "indirect",
    severity: "high",
    notKnown: "No figure was mentioned by the client. The amount is not grounded in any message.",
  },
  {
    id: "s-bluestone-sentiment",
    clientId: "bluestone",
    signalType: "sentiment",
    value: "Tone is neutral-to-concerned about paid search performance",
    evidence: [
      {
        messageId: "m-2203",
        source: "Michael Cho · client email",
        excerpt: "Our cost per lead jumped last week and I want to understand why before the board call.",
        date: "2026-07-03T07:45:00Z",
      },
    ],
    modelConfidence: 0.9,
    evidenceStrength: "strong",
    severity: "medium",
  },

  // --- Arcadia Travel: genuine client state change -------------------------
  {
    id: "s-arcadia-change",
    clientId: "arcadia",
    signalType: "relationship_change",
    value: "Isabella is considering expanding the campaign next month",
    evidence: [
      {
        messageId: "m-3301",
        source: "Isabella Romano · client email",
        excerpt: "We may want to expand the campaign next month.",
        date: "2026-07-05T13:30:00Z",
      },
    ],
    modelConfidence: 0.84,
    evidenceStrength: "direct",
    severity: "low",
    previousContext: "Client asked for no additional scope this quarter (recorded May 20).",
    contradictionHint: "client_state_changed",
  },
  {
    id: "s-arcadia-silence",
    clientId: "arcadia",
    signalType: "response_pattern",
    value: "Fourteen days of silence on a live retainer",
    evidence: [
      {
        messageId: "m-3302",
        source: "Thread activity on the Arcadia account",
        excerpt: "No inbound message from the client for 14 consecutive days.",
        date: "2026-06-24T09:00:00Z",
      },
    ],
    modelConfidence: 0.97,
    evidenceStrength: "strong",
    severity: "high",
  },
  {
    id: "s-arcadia-unkept",
    clientId: "arcadia",
    signalType: "commitment",
    value: "We promised the reporting deck by Thursday and the date passed",
    evidence: [
      {
        messageId: "m-3303",
        source: "Priya Shah · our reply",
        excerpt: "You'll have the reporting deck by Thursday.",
        date: "2026-06-30T12:10:00Z",
      },
    ],
    modelConfidence: 0.96,
    evidenceStrength: "strong",
    severity: "high",
  },

  // --- Northwind: commitment + uncertain intent ----------------------------
  {
    id: "s-northwind-commitment",
    clientId: "northwind",
    signalType: "commitment",
    value: "We said the technical SEO audit would land this week",
    evidence: [
      {
        messageId: "m-4401",
        source: "Marcus Bell · our reply",
        excerpt: "The technical SEO audit will be with you this week.",
        date: "2026-07-02T14:00:00Z",
      },
    ],
    modelConfidence: 0.94,
    evidenceStrength: "strong",
    severity: "medium",
  },
  {
    id: "s-northwind-intent",
    clientId: "northwind",
    signalType: "intent",
    value: "Grant is evaluating other agencies",
    evidence: [
      {
        messageId: "m-4402",
        source: "Grant Wu · client email",
        excerpt: "We're doing our usual annual review of partners.",
        date: "2026-06-27T09:20:00Z",
      },
    ],
    modelConfidence: 0.68,
    evidenceStrength: "weak",
    severity: "high",
    notKnown: "An annual partner review is routine. Nothing states that other agencies are involved.",
  },

  // --- Cedar & Vantage: healthy, verified positives ------------------------
  {
    id: "s-cedar-sentiment",
    clientId: "cedar",
    signalType: "sentiment",
    value: "Olivia is positive about the recent social work",
    evidence: [
      {
        messageId: "m-5501",
        source: "Olivia Grant · client email",
        excerpt: "The new social cuts landed really well with our audience — great work.",
        date: "2026-07-05T08:15:00Z",
      },
    ],
    modelConfidence: 0.95,
    evidenceStrength: "strong",
    severity: "low",
  },
  {
    id: "s-vantage-sentiment",
    clientId: "vantage",
    signalType: "sentiment",
    value: "Relationship tone is steady and collaborative",
    evidence: [
      {
        messageId: "m-6601",
        source: "Recent Vantage thread",
        excerpt: "Thanks for turning that around so quickly — appreciated.",
        date: "2026-07-06T10:00:00Z",
      },
    ],
    modelConfidence: 0.91,
    evidenceStrength: "strong",
    severity: "low",
  },
];

function build(seed: Seed): Signal {
  const verdict = validateSignal({
    signalType: seed.signalType,
    value: seed.value,
    evidence: seed.evidence,
    modelConfidence: seed.modelConfidence,
    evidenceStrength: seed.evidenceStrength,
    previousContext: seed.previousContext,
    contradictionHint: seed.contradictionHint,
  });
  const last = seed.evidence[seed.evidence.length - 1];
  return {
    id: seed.id,
    clientId: seed.clientId,
    signalType: seed.signalType,
    value: seed.value,
    evidence: seed.evidence,
    timestamp: last?.date ?? new Date().toISOString(),
    extractedBy: "isura-extract-v1",
    modelConfidence: seed.modelConfidence,
    evidenceStrength: seed.evidenceStrength,
    validationStatus: verdict.status,
    contradictionStatus: verdict.contradiction,
    previousContext: seed.previousContext,
    humanReviewRequired: verdict.humanReviewRequired,
    guardNote: verdict.findings.join(" "),
    notKnown: seed.notKnown,
    severity: seed.severity,
    createdAt: last?.date ?? new Date().toISOString(),
  };
}

export const SIGNALS: Signal[] = SEEDS.map(build);

export function signalsForClient(clientId: string): Signal[] {
  return SIGNALS.filter((s) => s.clientId === clientId);
}

export const REVIEW_SIGNALS = SIGNALS.filter((s) => s.humanReviewRequired);
