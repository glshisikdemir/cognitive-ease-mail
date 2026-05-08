import { useLang, t } from "@/lib/i18n";

type Load = "low" | "medium" | "high";
type Priority = "urgent" | "normal" | "ignore";

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
