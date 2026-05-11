import { useLang, t } from "@/lib/i18n";
import type { OpCategory, Confidence } from "@/lib/heuristics";

type Load = "low" | "medium" | "high";
type Priority = "urgent" | "normal" | "ignore";

// Kept for backward compatibility — maps load level into operational tone.
export function LoadBadge({ load }: { load: Load }) {
  const { lang } = useLang();
  const styles = {
    low: "bg-load-low text-load-low-foreground",
    medium: "bg-load-medium text-load-medium-foreground",
    high: "bg-load-high text-load-high-foreground",
  }[load];
  const label = { low: "loadLow", medium: "loadMedium", high: "loadHigh" }[load] as
    | "loadLow"
    | "loadMedium"
    | "loadHigh";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${styles}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {t(lang, label)}
    </span>
  );
}

export function PriorityTag({ priority }: { priority: Priority }) {
  const { lang } = useLang();
  const cls = {
    urgent: "text-priority-urgent",
    normal: "text-priority-normal",
    ignore: "text-priority-ignore",
  }[priority];
  const label = { urgent: "prUrgent", normal: "prNormal", ignore: "prIgnore" }[priority] as
    | "prUrgent"
    | "prNormal"
    | "prIgnore";
  return (
    <span className={`text-[11px] font-medium uppercase tracking-wider ${cls}`}>
      {t(lang, label)}
    </span>
  );
}

// Operational category badge — replaces "load" terminology.
export function CategoryBadge({ category }: { category: OpCategory }) {
  const { lang } = useLang();
  const map = {
    decision: { cls: "bg-load-high text-load-high-foreground", key: "cat_decision" },
    risk: { cls: "bg-load-high text-load-high-foreground", key: "cat_risk" },
    waiting: { cls: "bg-load-medium text-load-medium-foreground", key: "cat_waiting" },
    low_value: { cls: "bg-muted text-muted-foreground", key: "cat_low_value" },
    safe_ignore: { cls: "bg-muted text-muted-foreground", key: "cat_safe_ignore" },
  }[category];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${map.cls}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {t(lang, map.key)}
    </span>
  );
}

export function ConfidenceTag({ confidence }: { confidence: Confidence }) {
  const { lang } = useLang();
  const map = {
    high: { cls: "text-emerald-700", key: "conf_high", dot: "bg-emerald-500" },
    medium: { cls: "text-muted-foreground", key: "conf_medium", dot: "bg-amber-500" },
    review: { cls: "text-muted-foreground", key: "conf_review", dot: "bg-rose-500" },
  }[confidence];
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${map.cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${map.dot}`} />
      {t(lang, map.key)}
    </span>
  );
}

// Compact bullet list for "Why this matters" / operational reasoning.
export function ReasonList({ reasons }: { reasons: { key: string; vars?: Record<string, string | number> }[] }) {
  const { lang } = useLang();
  if (!reasons?.length) return null;
  return (
    <ul className="mt-1 space-y-1.5">
      {reasons.map((r, i) => (
        <li key={i} className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
          <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-foreground/40" />
          <span className="text-foreground/85">{t(lang, r.key, r.vars)}</span>
        </li>
      ))}
    </ul>
  );
}
