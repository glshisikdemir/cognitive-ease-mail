import { ShieldCheck, ShieldAlert, Lock } from "lucide-react";
import { CATEGORY_META, LEVEL_META, LEVEL_TOKEN, type GuardianGate } from "@/lib/guardian";

// Small chip that surfaces the Decision Guardian verdict for a draft/suggestion.
export function GuardianBadge({ gate }: { gate: GuardianGate }) {
  const token = LEVEL_TOKEN[gate.level];
  const Icon = !gate.canExecute ? Lock : gate.requiresApproval ? ShieldAlert : ShieldCheck;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${token.chip}`}
      title={`${CATEGORY_META[gate.category].label.en} · ${LEVEL_META[gate.level].label.en}`}
    >
      <Icon className="h-3 w-3" />
      {token.label.en}
    </span>
  );
}

// One-line explanation shown above the action buttons.
export function guardianExplainer(gate: GuardianGate): string {
  const cat = CATEGORY_META[gate.category].label.en;
  switch (gate.level) {
    case "level1_autonomous":
      return `Guardian: ${cat} is fully autonomous. ISURA can send this on its own — approving just confirms.`;
    case "level2_silent":
      return `Guardian: ${cat} runs on silent confirmation. It sends unless you object.`;
    case "level3_approval":
      return `Guardian: ${cat} is high-impact. ISURA paused this and needs your approval before it sends.`;
    case "level4_strategic":
      return `Guardian: ${cat} is human-only. ISURA prepared this recommendation but cannot send it — only you can.`;
  }
}
