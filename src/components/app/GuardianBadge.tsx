import { Check, Eye, Lock } from "lucide-react";
import { type GuardianGate } from "@/lib/guardian";

// Small chip that surfaces the Decision Guardian verdict for a draft/suggestion.
export function GuardianBadge({ gate }: { gate: GuardianGate }) {
  const display = !gate.canExecute
    ? { label: "You decide", chip: "bg-load-high text-load-high-foreground", Icon: Lock }
    : gate.requiresApproval
      ? { label: "Review before sending", chip: "bg-load-medium text-load-medium-foreground", Icon: Eye }
      : { label: "Ready", chip: "bg-load-low text-load-low-foreground", Icon: Check };
  const Icon = display.Icon;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${display.chip}`}
    >
      <Icon className="h-3 w-3" />
      {display.label}
    </span>
  );
}

// One-line explanation shown above the action buttons.
export function guardianExplainer(gate: GuardianGate): string {
  switch (gate.level) {
    case "level1_autonomous":
      return "This looks routine and is ready when you are.";
    case "level2_silent":
      return "This looks straightforward. Give it a quick read before sending.";
    case "level3_approval":
      return "This message could affect the client relationship, so ISURA paused it for your review.";
    case "level4_strategic":
      return "This includes a sensitive commitment. ISURA can help prepare it, but the final decision is yours.";
  }
}
