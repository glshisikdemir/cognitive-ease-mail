// Central mock data for ISURA — realistic agency client relationship graph.
// Everything here is deterministic mock data so every surface looks alive.

export type Band = "healthy" | "watch" | "attention";

export type AlertType =
  | "unanswered_email" // client email we haven't answered
  | "cooling" // reply time degrading or long silence
  | "unkept_commitment" // we promised, date passed
  | "unanswered_question"; // a direct question left hanging

export interface Contact {
  name: string;
  role: string;
  email: string;
  decisionMaker: boolean;
}

export interface TimelineEvent {
  id: string;
  date: string; // ISO
  label: string;
  kind: "positive" | "neutral" | "risk";
}

export interface OpenLoop {
  id: string;
  summary: string;
  age: string; // e.g. "4 days"
}

export interface ToneProfile {
  greeting: string;
  tone: string;
  length: string;
  signOff: string;
}

export interface HealthFactor {
  label: string;
  delta: number; // negative or positive contribution
}

export interface Client {
  id: string;
  name: string;
  domains: string[];
  retainer: number; // monthly USD
  owner: string;
  health: number; // 0-100
  spark: number[]; // 7-day health values
  trend90: number[]; // 90-day trend samples (~13 points)
  factors: HealthFactor[];
  reason: string; // one-sentence attention reason
  contacts: Contact[];
  openLoops: OpenLoop[];
  timeline: TimelineEvent[];
  tone: ToneProfile;
}

export interface Alert {
  id: string;
  clientId: string;
  type: AlertType;
  person: string;
  summary: string;
  ageHours: number;
}

export interface Draft {
  id: string;
  clientId: string;
  person: string;
  subject: string;
  originalEmail: string;
  draftBody: string;
  toneSource: string;
}

export function bandOf(health: number): Band {
  if (health >= 80) return "healthy";
  if (health >= 60) return "watch";
  return "attention";
}

export function bandLabel(band: Band): string {
  return band === "healthy" ? "Healthy" : band === "watch" ? "Watch" : "Attention";
}

const owners = ["Nadia Okafor", "Tom Reyes", "Priya Shah", "Marcus Bell"];

// Deterministic spark generator around a base value.
function spark(base: number, seed: number, drift = 0): number[] {
  const out: number[] = [];
  for (let i = 0; i < 7; i++) {
    const wobble = Math.round(Math.sin(seed + i * 1.3) * 4);
    out.push(Math.max(0, Math.min(100, base + wobble + Math.round((drift * i) / 6))));
  }
  return out;
}

function trend90(start: number, end: number, seed: number): number[] {
  const out: number[] = [];
  const n = 13;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const base = start + (end - start) * t;
    const wobble = Math.sin(seed + i * 0.9) * 3;
    out.push(Math.round(Math.max(0, Math.min(100, base + wobble))));
  }
  return out;
}

export const CLIENTS: Client[] = [
  {
    id: "meridian",
    name: "Meridian Retail",
    domains: ["meridianretail.com"],
    retainer: 14000,
    owner: owners[0],
    health: 42,
    spark: spark(48, 1, -14),
    trend90: trend90(78, 42, 1),
    factors: [
      { label: "Revision request unanswered 4 days", delta: -8 },
      { label: "Negative sentiment trend (2 weeks)", delta: -10 },
      { label: "Open commitment: campaign assets", delta: -5 },
    ],
    reason: "Revision request unanswered 4 days + sentiment declining 2 weeks.",
    contacts: [
      { name: "Sarah Lindqvist", role: "VP Marketing", email: "sarah@meridianretail.com", decisionMaker: true },
      { name: "Dev Patel", role: "Brand Manager", email: "dev@meridianretail.com", decisionMaker: false },
    ],
    openLoops: [
      { id: "l1", summary: "Homepage revision round 2 feedback awaiting our reply", age: "4 days" },
      { id: "l2", summary: "Q3 campaign assets we committed to send", age: "2 days" },
    ],
    timeline: [
      { id: "t1", date: "2026-07-04", label: "Revision request received", kind: "risk" },
      { id: "t2", date: "2026-06-28", label: "Sentiment shift detected in replies", kind: "risk" },
      { id: "t3", date: "2026-06-15", label: "Contract renewal discussed", kind: "neutral" },
    ],
    tone: { greeting: "Hi Sarah", tone: "warm-professional", length: "short", signOff: "Best" },
  },
  {
    id: "bluestone",
    name: "Bluestone Health",
    domains: ["bluestonehealth.io"],
    retainer: 22000,
    owner: owners[1],
    health: 51,
    spark: spark(56, 2, -12),
    trend90: trend90(84, 51, 2),
    factors: [
      { label: "Reply time 2.3x slower vs baseline", delta: -6 },
      { label: "Unanswered client email (72h)", delta: -8 },
      { label: "Negative sentiment trend", delta: -10 },
    ],
    reason: "Their reply time doubled and a 72h email is still unanswered.",
    contacts: [
      { name: "Michael Cho", role: "Head of Growth", email: "michael@bluestonehealth.io", decisionMaker: true },
      { name: "Lena Ford", role: "Content Lead", email: "lena@bluestonehealth.io", decisionMaker: false },
    ],
    openLoops: [{ id: "l1", summary: "Paid search performance question awaiting answer", age: "3 days" }],
    timeline: [
      { id: "t1", date: "2026-07-05", label: "Direct question left unanswered", kind: "risk" },
      { id: "t2", date: "2026-06-30", label: "Reply times slowing", kind: "risk" },
      { id: "t3", date: "2026-06-10", label: "Positive review of ad creative", kind: "positive" },
    ],
    tone: { greeting: "Hi Michael", tone: "direct-professional", length: "medium", signOff: "Thanks" },
  },
  {
    id: "arcadia",
    name: "Arcadia Travel",
    domains: ["arcadiatravel.co"],
    retainer: 9500,
    owner: owners[2],
    health: 57,
    spark: spark(60, 3, -8),
    trend90: trend90(76, 57, 3),
    factors: [
      { label: "14 days silence on retainer", delta: -6 },
      { label: "Open commitment: reporting deck", delta: -5 },
    ],
    reason: "14 days of silence on a live retainer + a reporting deck we owe.",
    contacts: [
      { name: "Isabella Romano", role: "CMO", email: "isabella@arcadiatravel.co", decisionMaker: true },
    ],
    openLoops: [{ id: "l1", summary: "June reporting deck we committed to Thursday", age: "5 days" }],
    timeline: [
      { id: "t1", date: "2026-06-24", label: "3 weeks of silence began", kind: "risk" },
      { id: "t2", date: "2026-06-05", label: "Renewed for 6 months", kind: "positive" },
    ],
    tone: { greeting: "Hi Isabella", tone: "warm-professional", length: "short", signOff: "Warmly" },
  },
  {
    id: "northwind",
    name: "Northwind Logistics",
    domains: ["northwind.com"],
    retainer: 18000,
    owner: owners[3],
    health: 66,
    spark: spark(67, 4, 2),
    trend90: trend90(72, 66, 4),
    factors: [
      { label: "Open commitment: SEO audit", delta: -5 },
      { label: "Recent positive signal", delta: 5 },
    ],
    reason: "Momentum is fine but an SEO audit commitment is aging.",
    contacts: [
      { name: "Grant Wu", role: "Marketing Director", email: "grant@northwind.com", decisionMaker: true },
    ],
    openLoops: [{ id: "l1", summary: "Technical SEO audit promised this week", age: "2 days" }],
    timeline: [
      { id: "t1", date: "2026-07-02", label: "Praised last month's results", kind: "positive" },
      { id: "t2", date: "2026-06-27", label: "Requested SEO audit", kind: "neutral" },
    ],
    tone: { greeting: "Hi Grant", tone: "concise-professional", length: "short", signOff: "Best" },
  },
  {
    id: "cedar",
    name: "Cedar & Co.",
    domains: ["cedarandco.com"],
    retainer: 7500,
    owner: owners[0],
    health: 71,
    spark: spark(71, 5, 3),
    trend90: trend90(69, 71, 5),
    factors: [{ label: "Unanswered question (36h)", delta: 0 }],
    reason: "One open question, otherwise steady.",
    contacts: [
      { name: "Olivia Grant", role: "Founder", email: "olivia@cedarandco.com", decisionMaker: true },
    ],
    openLoops: [{ id: "l1", summary: "Question about social calendar cadence", age: "36 hours" }],
    timeline: [{ id: "t1", date: "2026-07-06", label: "Asked about posting cadence", kind: "neutral" }],
    tone: { greeting: "Hi Olivia", tone: "friendly-professional", length: "medium", signOff: "Cheers" },
  },
  {
    id: "vantage",
    name: "Vantage Finance",
    domains: ["vantagefin.com"],
    retainer: 26000,
    owner: owners[1],
    health: 84,
    spark: spark(84, 6, 1),
    trend90: trend90(80, 84, 6),
    factors: [{ label: "Recent positive signal", delta: 5 }],
    reason: "",
    contacts: [
      { name: "Daniel Frost", role: "CMO", email: "daniel@vantagefin.com", decisionMaker: true },
    ],
    openLoops: [],
    timeline: [{ id: "t1", date: "2026-07-01", label: "Approved next quarter scope", kind: "positive" }],
    tone: { greeting: "Hi Daniel", tone: "formal-professional", length: "medium", signOff: "Kind regards" },
  },
  {
    id: "harbor",
    name: "Harbor & Vine",
    domains: ["harborvine.com"],
    retainer: 6800,
    owner: owners[2],
    health: 88,
    spark: spark(88, 7, 0),
    trend90: trend90(85, 88, 7),
    factors: [{ label: "Recent positive signal", delta: 5 }],
    reason: "",
    contacts: [{ name: "Nora Bishop", role: "Owner", email: "nora@harborvine.com", decisionMaker: true }],
    openLoops: [],
    timeline: [{ id: "t1", date: "2026-06-29", label: "Referred a new lead", kind: "positive" }],
    tone: { greeting: "Hi Nora", tone: "warm", length: "short", signOff: "Warmly" },
  },
  {
    id: "atlas",
    name: "Atlas Robotics",
    domains: ["atlasrobotics.ai"],
    retainer: 31000,
    owner: owners[3],
    health: 91,
    spark: spark(91, 8, 0),
    trend90: trend90(88, 91, 8),
    factors: [{ label: "Recent positive signal", delta: 5 }],
    reason: "",
    contacts: [{ name: "Priya Nair", role: "VP Demand Gen", email: "priya@atlasrobotics.ai", decisionMaker: true }],
    openLoops: [],
    timeline: [{ id: "t1", date: "2026-07-03", label: "Expanded retainer", kind: "positive" }],
    tone: { greeting: "Hi Priya", tone: "direct", length: "medium", signOff: "Best" },
  },
  {
    id: "juniper",
    name: "Juniper Foods",
    domains: ["juniperfoods.com"],
    retainer: 8200,
    owner: owners[0],
    health: 82,
    spark: spark(82, 9, 1),
    trend90: trend90(79, 82, 9),
    factors: [{ label: "Recent positive signal", delta: 5 }],
    reason: "",
    contacts: [{ name: "Ben Carter", role: "Brand Lead", email: "ben@juniperfoods.com", decisionMaker: true }],
    openLoops: [],
    timeline: [{ id: "t1", date: "2026-06-26", label: "Signed off on packaging refresh", kind: "positive" }],
    tone: { greeting: "Hi Ben", tone: "friendly", length: "short", signOff: "Cheers" },
  },
  {
    id: "solace",
    name: "Solace Wellness",
    domains: ["solacewellness.co"],
    retainer: 5400,
    owner: owners[1],
    health: 80,
    spark: spark(80, 10, 0),
    trend90: trend90(78, 80, 10),
    factors: [{ label: "Recent positive signal", delta: 5 }],
    reason: "",
    contacts: [{ name: "Maya Ellison", role: "Founder", email: "maya@solacewellness.co", decisionMaker: true }],
    openLoops: [],
    timeline: [{ id: "t1", date: "2026-06-22", label: "Great feedback on newsletter", kind: "positive" }],
    tone: { greeting: "Hi Maya", tone: "warm", length: "medium", signOff: "Warmly" },
  },
  {
    id: "quill",
    name: "Quill Media",
    domains: ["quillmedia.com"],
    retainer: 11500,
    owner: owners[2],
    health: 86,
    spark: spark(86, 11, 0),
    trend90: trend90(84, 86, 11),
    factors: [{ label: "Recent positive signal", delta: 5 }],
    reason: "",
    contacts: [{ name: "Alex Turner", role: "Head of Marketing", email: "alex@quillmedia.com", decisionMaker: true }],
    openLoops: [],
    timeline: [{ id: "t1", date: "2026-07-01", label: "Approved video series", kind: "positive" }],
    tone: { greeting: "Hi Alex", tone: "concise", length: "short", signOff: "Best" },
  },
  {
    id: "orchard",
    name: "Orchard Realty",
    domains: ["orchardrealty.com"],
    retainer: 9000,
    owner: owners[3],
    health: 78,
    spark: spark(78, 12, -1),
    trend90: trend90(81, 78, 12),
    factors: [{ label: "Slight reply-time slowdown", delta: -6 }],
    reason: "",
    contacts: [{ name: "Rachel Kim", role: "VP Marketing", email: "rachel@orchardrealty.com", decisionMaker: true }],
    openLoops: [],
    timeline: [{ id: "t1", date: "2026-06-25", label: "On-track quarterly review", kind: "neutral" }],
    tone: { greeting: "Hi Rachel", tone: "warm-professional", length: "medium", signOff: "Best" },
  },
  {
    id: "lumen",
    name: "Lumen Studios",
    domains: ["lumenstudios.co"],
    retainer: 13500,
    owner: owners[0],
    health: 90,
    spark: spark(90, 13, 0),
    trend90: trend90(87, 90, 13),
    factors: [{ label: "Recent positive signal", delta: 5 }],
    reason: "",
    contacts: [{ name: "Chris Vale", role: "Creative Director", email: "chris@lumenstudios.co", decisionMaker: true }],
    openLoops: [],
    timeline: [{ id: "t1", date: "2026-07-02", label: "Loved the brand film cut", kind: "positive" }],
    tone: { greeting: "Hi Chris", tone: "creative-warm", length: "medium", signOff: "Cheers" },
  },
  {
    id: "sable",
    name: "Sable & Stone",
    domains: ["sableandstone.com"],
    retainer: 7000,
    owner: owners[1],
    health: 83,
    spark: spark(83, 14, 0),
    trend90: trend90(80, 83, 14),
    factors: [{ label: "Recent positive signal", delta: 5 }],
    reason: "",
    contacts: [{ name: "Emma Doyle", role: "Owner", email: "emma@sableandstone.com", decisionMaker: true }],
    openLoops: [],
    timeline: [{ id: "t1", date: "2026-06-28", label: "Renewed retainer", kind: "positive" }],
    tone: { greeting: "Hi Emma", tone: "warm", length: "short", signOff: "Warmly" },
  },
];

export const ALERTS: Alert[] = [
  {
    id: "a1",
    clientId: "meridian",
    type: "unanswered_email",
    person: "Sarah Lindqvist",
    summary: "Revision round 2 feedback needs our reply",
    ageHours: 96,
  },
  {
    id: "a2",
    clientId: "bluestone",
    type: "unanswered_question",
    person: "Michael Cho",
    summary: "Asked why paid search CPL rose last week",
    ageHours: 72,
  },
  {
    id: "a3",
    clientId: "arcadia",
    type: "cooling",
    person: "Isabella Romano",
    summary: "14 days of silence on a live retainer",
    ageHours: 336,
  },
  {
    id: "a4",
    clientId: "arcadia",
    type: "unkept_commitment",
    person: "Isabella Romano",
    summary: 'We said "reporting deck by Thursday" — Thursday passed',
    ageHours: 120,
  },
  {
    id: "a5",
    clientId: "bluestone",
    type: "unanswered_email",
    person: "Lena Ford",
    summary: "Content calendar approval waiting",
    ageHours: 54,
  },
  {
    id: "a6",
    clientId: "northwind",
    type: "unkept_commitment",
    person: "Grant Wu",
    summary: 'Promised technical SEO audit "this week"',
    ageHours: 60,
  },
  {
    id: "a7",
    clientId: "cedar",
    type: "unanswered_question",
    person: "Olivia Grant",
    summary: "Question about social posting cadence",
    ageHours: 36,
  },
];

export const DRAFTS: Draft[] = [
  {
    id: "d1",
    clientId: "meridian",
    person: "Sarah Lindqvist",
    subject: "Re: Homepage revision — round 2",
    originalEmail:
      "Hi team, we went through the latest homepage cut and had a few notes on the hero section and the testimonial block. Can you take another pass? We'd love to see it before Friday if possible. Thanks, Sarah",
    draftBody:
      "Hi Sarah,\n\nThanks for the detailed notes — really helpful. We'll revise the hero section and rework the testimonial block, and I'll have the updated cut to you by Thursday, July 9 so you have time before Friday.\n\nI'll also send the Q3 campaign assets alongside it.\n\nBest,\nNadia",
    toneSource: "Meridian Retail profile",
  },
  {
    id: "d2",
    clientId: "bluestone",
    person: "Michael Cho",
    subject: "Re: Paid search CPL question",
    originalEmail:
      "Quick one — our cost per lead jumped last week and I want to understand why before the board call on the 11th. Can you explain what happened? Michael",
    draftBody:
      "Hi Michael,\n\nGood question. CPL rose 18% last week, driven mainly by increased competition on 3 branded terms and a temporary budget cap we've since lifted. We expect it to normalize within 5 days.\n\nI'll send a one-page summary before your board call on the 11th.\n\nThanks,\nTom",
    toneSource: "Bluestone Health profile",
  },
  {
    id: "d3",
    clientId: "arcadia",
    person: "Isabella Romano",
    subject: "June reporting deck",
    originalEmail:
      "(No recent email — 14 days of silence detected on this retainer.)",
    draftBody:
      "Hi Isabella,\n\nApologies for the delay — the June reporting deck is attached. Highlights: bookings up 12% MoM and a 9% lift in email revenue.\n\nWould love 20 minutes this week to walk through Q3 priorities. Does Thursday at 2pm work?\n\nWarmly,\nPriya",
    toneSource: "Arcadia Travel profile",
  },
  {
    id: "d4",
    clientId: "northwind",
    person: "Grant Wu",
    subject: "Re: Technical SEO audit",
    originalEmail:
      "Looking forward to that SEO audit you mentioned — any update on timing? Grant",
    draftBody:
      "Hi Grant,\n\nThe technical SEO audit is nearly done — I'll deliver it Wednesday, July 8 with prioritized fixes and estimated impact.\n\nBest,\nMarcus",
    toneSource: "Northwind Logistics profile",
  },
];

export function clientById(id: string): Client | undefined {
  return CLIENTS.find((c) => c.id === id);
}

export const ATTENTION_CLIENTS = CLIENTS.filter((c) => c.health < 60);
export const HEALTHY_CLIENTS = CLIENTS.filter((c) => c.health >= 60);

export const totalAtRisk = ATTENTION_CLIENTS.reduce((s, c) => s + c.retainer, 0);

export const WEEKLY_WINS = {
  draftsSentNoEdits: 9,
  coolingCaught: 2,
};

export function fmtMoney(n: number): string {
  return "$" + n.toLocaleString("en-US");
}

export const ALERT_LABELS: Record<AlertType, string> = {
  unanswered_email: "Unanswered client email",
  cooling: "Cooling account",
  unkept_commitment: "Unkept commitment",
  unanswered_question: "Unanswered question",
};

export function ageLabel(hours: number): string {
  if (hours < 48) return `${hours}h`;
  const days = Math.round(hours / 24);
  return `${days}d`;
}
