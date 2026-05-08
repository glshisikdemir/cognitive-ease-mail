import { emails } from "@/lib/emails";
import { quickAssess } from "@/lib/heuristics";
import { useLang, t } from "@/lib/i18n";

function useStats() {
  const assessed = emails.map((e) => ({ email: e, ...quickAssess(e) }));
  const total = assessed.length;
  const high = assessed.filter((a) => a.priority === "urgent" || a.load === "high").length;
  const low = assessed.filter((a) => a.priority === "ignore" || a.load === "low").length;
  const medium = Math.max(0, total - high - low);
  const drafts = assessed.filter((a) => a.priority !== "ignore").length;
  return { total, high, medium, low, drafts };
}

export function HeroStatus() {
  const { lang } = useLang();
  const s = useStats();
  const stats = [
    { label: t(lang, "emailsToday"), value: s.total },
    { label: t(lang, "highPriority"), value: s.high, accent: "text-priority-urgent" },
    { label: t(lang, "mediumPriority"), value: s.medium },
    { label: t(lang, "lowPriority"), value: s.low },
    { label: t(lang, "draftsReady"), value: s.drafts },
  ];
  return (
    <section className="surface-veil rounded-2xl border border-border/70 px-7 py-10">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        ISURA
      </div>
      <h1 className="mt-3 max-w-2xl font-display text-4xl leading-[1.1] text-foreground sm:text-5xl">
        {t(lang, "heroTitle")}
      </h1>
      <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
        {t(lang, "heroSubtitle")}
      </p>
      <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col">
            <span className={`font-display text-3xl ${s.accent ?? "text-foreground"}`}>{s.value}</span>
            <span className="mt-1 text-xs text-muted-foreground">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export type DashboardView = "all" | "priority" | "replies" | "low";

export function PrimaryActions({ activeView }: { activeView: DashboardView }) {

export function PrimaryActions({ activeView }: { activeView: DashboardView }) {
  const { lang } = useLang();
  const s = useStats();
  const archived = useArchived();
  const lowIds = emails
    .filter((e) => {
      const a = quickAssess(e);
      return (a.priority === "ignore" || a.load === "low") && !archived.has(e.id);
    })
    .map((e) => e.id);

  const actions = [
    { key: "reviewPriority" as const, view: "priority" as DashboardView, count: s.high, primary: true },
    { key: "seeReplies" as const, view: "replies" as DashboardView, count: s.drafts, primary: false },
    { key: "archiveLow" as const, view: "low" as DashboardView, count: lowIds.length, primary: false, onClick: () => archiveEmails(lowIds) },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-3">
      {actions.map((a) => {
        const isActive = activeView === a.view;
        return (
          <Link
            key={a.key}
            to="/"
            search={{ view: a.view }}
            onClick={a.onClick}
            hash="emails"
            className={`group rounded-xl border px-5 py-4 text-left text-sm font-medium transition-colors ${
              a.primary
                ? "border-transparent bg-primary text-primary-foreground hover:bg-primary/90"
                : isActive
                ? "border-border-strong bg-surface-muted text-foreground"
                : "border-border/70 bg-surface text-foreground hover:bg-surface-muted"
            }`}
          >
            <span className="flex items-center justify-between">
              <span>{t(lang, a.key)}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] tabular-nums ${
                  a.primary ? "bg-primary-foreground/15 text-primary-foreground" : "bg-surface-muted text-muted-foreground"
                }`}
              >
                {a.count}
              </span>
            </span>
            <span
              className={`mt-2 inline-block text-xs ${
                a.primary ? "text-primary-foreground/70" : "text-muted-foreground"
              }`}
            >
              →
            </span>
          </Link>
        );
      })}
    </section>
  );
}

export function CognitiveOverview() {
  const { lang } = useLang();
  const s = useStats();
  const total = Math.max(1, s.total);
  const rows = [
    { label: t(lang, "loadLowLabel"), value: s.low, dot: "bg-emerald-500", bar: "bg-load-low" },
    { label: t(lang, "loadMediumLabel"), value: s.medium, dot: "bg-amber-500", bar: "bg-load-medium" },
    { label: t(lang, "loadHighLabel"), value: s.high, dot: "bg-rose-500", bar: "bg-load-high" },
  ];
  return (
    <section className="rounded-2xl border border-border/70 bg-surface px-7 py-7">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-2xl text-foreground">{t(lang, "cognitiveOverview")}</h2>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{t(lang, "cognitiveSubtitle")}</p>
      <div className="mt-6 space-y-4">
        {rows.map((r) => (
          <div key={r.label}>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-foreground">
                <span className={`h-2 w-2 rounded-full ${r.dot}`} />
                {r.label}
              </span>
              <span className="font-medium tabular-nums text-foreground">{r.value}</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
              <div
                className={`h-full ${r.bar}`}
                style={{ width: `${(r.value / total) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function AIInsight() {
  const { lang } = useLang();
  const s = useStats();
  const insight =
    s.low > s.high
      ? t(lang, "insightLow")
      : t(lang, "insightHigh", { n: s.high });
  return (
    <section className="rounded-2xl border border-border/70 bg-surface px-7 py-7">
      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {t(lang, "insightTitle")}
      </div>
      <p className="mt-3 font-display text-2xl leading-snug text-foreground">
        “{insight}”
      </p>
      <p className="mt-4 text-sm text-muted-foreground">{t(lang, "insightFocus")}</p>
    </section>
  );
}

export function MagicMoment() {
  const { lang } = useLang();
  const before = ["before1", "before2", "before3", "before4"] as const;
  const after = ["after1", "after2", "after3", "after4"] as const;
  return (
    <section className="rounded-2xl border border-border/70 bg-surface px-7 py-8">
      <h2 className="font-display text-2xl text-foreground">{t(lang, "whatChanged")}</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-border/60 bg-surface-muted/60 p-5">
          <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
            {t(lang, "beforeIsura")}
          </div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {before.map((k) => (
              <li key={k} className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-3 rounded-full bg-border-strong" />
                {t(lang, k)}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-border/60 bg-background p-5">
          <div className="text-xs uppercase tracking-[0.16em] text-foreground">
            {t(lang, "afterIsura")}
          </div>
          <ul className="mt-3 space-y-2 text-sm text-foreground">
            {after.map((k) => (
              <li key={k} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {t(lang, k)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function PositioningFooter() {
  const { lang } = useLang();
  return (
    <section className="px-7 py-12 text-center">
      <p className="mx-auto max-w-2xl font-display text-2xl leading-snug text-foreground sm:text-3xl">
        {t(lang, "positioning")}
      </p>
    </section>
  );
}
