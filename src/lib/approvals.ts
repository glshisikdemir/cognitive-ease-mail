// Central Approval Queue logic — aggregates every item across Drafts and Radar
// that the Decision Guardian has paused for human approval, into one list.
import {
  ALERTS,
  ALERT_LABELS,
  DRAFTS,
  ageLabel,
  clientById,
  type Alert,
  type Draft,
} from "@/lib/mock-data";
import { gateForText, type GuardianGate } from "@/lib/guardian";

export type ApprovalSource = "draft" | "radar";

export interface ApprovalItem {
  id: string;
  source: ApprovalSource;
  clientId: string;
  clientName: string;
  retainer: number;
  person: string;
  title: string; // subject or alert label
  summary: string; // draft body preview or alert summary
  waiting: string; // human-readable age
  ageHours: number; // for sorting
  gate: GuardianGate;
}

function draftGate(d: Draft): GuardianGate {
  return gateForText(`${d.subject} ${d.originalEmail} ${d.draftBody}`);
}

function alertGate(a: Alert): GuardianGate {
  return gateForText(`${a.type} ${a.summary}`);
}

// Drafts don't carry an explicit age; approximate from list order so the queue
// still sorts deterministically alongside radar alerts.
function draftAge(index: number): number {
  return 48 + index * 12;
}

export function buildApprovalQueue(): ApprovalItem[] {
  const items: ApprovalItem[] = [];

  DRAFTS.forEach((d, i) => {
    const gate = draftGate(d);
    if (!gate.requiresApproval) return;
    const client = clientById(d.clientId);
    if (!client) return;
    const ageHours = draftAge(i);
    items.push({
      id: `draft-${d.id}`,
      source: "draft",
      clientId: client.id,
      clientName: client.name,
      retainer: client.retainer,
      person: d.person,
      title: d.subject,
      summary: d.draftBody.replace(/\n+/g, " ").slice(0, 160),
      waiting: ageLabel(ageHours),
      ageHours,
      gate,
    });
  });

  ALERTS.forEach((a) => {
    const gate = alertGate(a);
    if (!gate.requiresApproval) return;
    const client = clientById(a.clientId);
    if (!client) return;
    items.push({
      id: `radar-${a.id}`,
      source: "radar",
      clientId: client.id,
      clientName: client.name,
      retainer: client.retainer,
      person: a.person,
      title: ALERT_LABELS[a.type],
      summary: a.summary,
      waiting: ageLabel(a.ageHours),
      ageHours: a.ageHours,
      gate,
    });
  });

  return items.sort((a, b) => b.ageHours - a.ageHours);
}

export function pendingApprovalCount(): number {
  return buildApprovalQueue().length;
}
