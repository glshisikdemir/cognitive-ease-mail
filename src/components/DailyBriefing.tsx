import { emails } from "@/lib/emails";
import { quickAssess } from "@/lib/heuristics";
import { useLang, t } from "@/lib/i18n";

export function DailyBriefing() {
  const { lang } = useLang();
  const assessed = emails.map((e) => quickAssess(e));
  const total = emails.length;
  const high = assessed.filter((a) => a.priority === "urgent" || a.load === "high").length;
  const ignore = assessed.filter((a) => a.priority === "ignore").length;
  const drafts = total - ignore;
  const focusMin = Math.max(10, high * 8 + (total - high - ignore) * 3);

  const stats = [
    { label: t(lang, "totalEmails"), value: total },
    { label: t(lang, "highPriority"), value: high },
    { label: t(lang, "safeIgnore"), value: ignore },
    { label: t(lang, "draftsReady"), value: drafts },
    { label: t(lang, "focusTime"), value: `${focusMin} ${t(lang, "minutes")}` },
  ];

  return (
    <section className="surface-veil rounded-2xl border border-border/70 px-7 py-8">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        {t(lang, "briefingTitle")}
      </div>
      <h1 className="mt-3 max-w-2xl font-display text-3xl leading-tight text-foreground sm:text-4xl">
        {t(lang, "briefingNarrative")}
      </h1>
      <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col">
            <span className="font-display text-3xl text-foreground">{s.value}</span>
            <span className="mt-1 text-xs text-muted-foreground">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
