import { createFileRoute, Link } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useMemo } from "react";
import { toast } from "sonner";
import {
  ArrowRight,
  Archive as ArchiveIcon,
  EyeOff,
  MessageSquare,
  RotateCcw,
  Inbox,
  CheckCircle2,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { Header } from "@/components/Header";
import { emails as allEmails } from "@/lib/emails";
import { quickAssess, computeRelief } from "@/lib/heuristics";
import { useLang, t } from "@/lib/i18n";
import {
  useEmailStore,
  setStatus,
  resetEmail,
  type EmailStatus,
} from "@/lib/email-store";
import { CategoryBadge, ConfidenceTag, ReasonList } from "@/components/LoadBadge";

const tabSchema = z.enum(["active", "replied", "archived", "ignored"]);
type Tab = z.infer<typeof tabSchema>;

const searchSchema = z.object({
  view: fallback(tabSchema, "active").default("active"),
});

export const Route = createFileRoute("/")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "ISURA — Operations" },
      {
        name: "description",
        content:
          "ISURA is the operational cognition layer for your communications. Surface real consequences, quiet the rest.",
      },
    ],
  }),
  component: Index,
});

function aiSummary(body: string, preview: string) {
  const first = body.split("\n").map((l) => l.trim()).find((l) => l.length > 20) ?? preview;
  return first.length > 140 ? first.slice(0, 140).trimEnd() + "…" : first;
}

function Index() {
  const { lang } = useLang();
  const { view } = Route.useSearch();
  const navigate = Route.useNavigate();
  const store = useEmailStore();

  const enriched = useMemo(
    () =>
      allEmails.map((email) => {
        const state = store[email.id] ?? { status: "active" as EmailStatus };
        return { email, state, assessment: quickAssess(email) };
      }),
    [store],
  );

  const counts = {
    active: enriched.filter((e) => e.state.status === "active").length,
    replied: enriched.filter((e) => e.state.status === "replied").length,
    archived: enriched.filter((e) => e.state.status === "archived").length,
    ignored: enriched.filter((e) => e.state.status === "ignored").length,
  };

  const relief = useMemo(
    () => computeRelief(enriched.map((e) => ({ assessment: e.assessment, status: e.state.status }))),
    [enriched],
  );

  const visible = enriched.filter((e) => e.state.status === view);

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "active", label: t(lang, "tab_active"), count: counts.active },
    { key: "replied", label: t(lang, "tab_replied"), count: counts.replied },
    { key: "archived", label: t(lang, "tab_archived"), count: counts.archived },
    { key: "ignored", label: t(lang, "tab_ignored"), count: counts.ignored },
  ];

  const handleArchive = (id: string) => {
    setStatus(id, "archived");
    toast.success(t(lang, "archivedOneToast"), {
      action: { label: t(lang, "undo"), onClick: () => resetEmail(id) },
    });
  };
  const handleIgnore = (id: string) => {
    setStatus(id, "ignored");
    toast.success(t(lang, "ignoredToast"), {
      action: { label: t(lang, "undo"), onClick: () => resetEmail(id) },
    });
  };
  const handleRestore = (id: string) => {
    resetEmail(id);
    toast.success(t(lang, "restoredOk"));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-5xl space-y-10 px-6 py-10">
        {/* Header */}
        <section className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              <Inbox className="h-3.5 w-3.5" />
              {t(lang, "inbox")}
            </div>
            <h1 className="mt-2 font-display text-3xl text-foreground sm:text-4xl">
              {counts.active === 0 ? t(lang, "allCaughtUp") : t(lang, "heroTitle")}
            </h1>
            <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">
              {t(lang, "heroSubtitle")}
            </p>
          </div>
          <Link
            to="/priority"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t(lang, "reviewPriority")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        {/* Cognitive relief metrics */}
        <section className="rounded-2xl border border-border/70 bg-surface px-6 py-6">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <h2 className="font-display text-xl text-foreground">{t(lang, "reliefTitle")}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t(lang, "reliefSubtitle")}</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border/70 bg-border/70 sm:grid-cols-3 lg:grid-cols-5">
            <Metric label={t(lang, "metric_decisions_simplified")} value={String(relief.decisionsSimplified)} />
            <Metric label={t(lang, "metric_risks_detected")} value={String(relief.risksDetected)} tone="risk" />
            <Metric
              label={t(lang, "metric_focus_recovered")}
              value={`${relief.focusMinutesRecovered} ${t(lang, "minutesShort")}`}
            />
            <Metric label={t(lang, "metric_pressure_reduced")} value={`${relief.pressureReduced}%`} />
            <Metric
              label={t(lang, "metric_load_score")}
              value={`${relief.cognitiveLoadScore}`}
              tone={relief.cognitiveLoadScore > 50 ? "risk" : "calm"}
            />
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              {t(lang, "trustNoAutoSend")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Lock className="h-3 w-3" />
              {t(lang, "trustReadOnly")}
            </span>
          </div>
        </section>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 rounded-lg border border-border/70 bg-surface p-1 text-sm">
          {tabs.map((tab) => {
            const active = view === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => navigate({ search: { view: tab.key } })}
                className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-surface-muted hover:text-foreground"
                }`}
              >
                {tab.label}
                <span
                  className={`rounded-full px-1.5 text-[10px] tabular-nums ${
                    active ? "bg-primary-foreground/20" : "bg-muted/60"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* List */}
        <section className="overflow-hidden rounded-2xl border border-border/70 bg-surface">
          {visible.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <CheckCircle2 className="h-8 w-8 text-muted-foreground/60" />
              <p className="mt-4 font-display text-xl text-foreground">
                {view === "active" ? t(lang, "allCaughtUp") : t(lang, "noEmailsHere")}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{t(lang, "nothingUrgentSub")}</p>
            </div>
          ) : (
            <ul>
              {visible.map(({ email, state, assessment }) => {
                const showWhy =
                  state.status === "active" &&
                  (assessment.category === "decision" || assessment.category === "risk");
                return (
                  <li
                    key={email.id}
                    className="flex flex-col gap-3 border-b border-border/60 px-6 py-5 last:border-b-0 sm:flex-row sm:items-start"
                  >
                    <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-accent text-sm font-medium text-accent-foreground">
                      {email.sender[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="truncate text-sm font-medium text-foreground">{email.sender}</span>
                        <CategoryBadge category={assessment.category} />
                        <ConfidenceTag confidence={assessment.confidence} />
                        {state.status !== "active" && (
                          <span className="rounded-full border border-border bg-background px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                            {t(
                              lang,
                              state.status === "replied"
                                ? "replied"
                                : state.status === "archived"
                                ? "archived"
                                : "ignored",
                            )}
                          </span>
                        )}
                      </div>
                      <Link
                        to="/email/$id"
                        params={{ id: email.id }}
                        className="mt-1 block truncate text-sm font-medium text-foreground hover:underline"
                      >
                        {email.subject}
                      </Link>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {aiSummary(email.body, email.preview)}
                      </p>

                      {showWhy && (
                        <div className="mt-3 rounded-lg border border-border/70 bg-background/60 px-3 py-2.5">
                          <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                            {t(lang, "whyThisMatters")}
                          </div>
                          <ReasonList reasons={assessment.reasons} />
                        </div>
                      )}

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <Link
                          to="/email/$id"
                          params={{ id: email.id }}
                          className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                        >
                          {t(lang, "view")}
                        </Link>
                        {state.status === "active" ? (
                          <>
                            <Link
                              to="/email/$id"
                              params={{ id: email.id }}
                              className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground hover:bg-surface-muted"
                            >
                              <MessageSquare className="h-3 w-3" />
                              {t(lang, "reply")}
                            </Link>
                            <button
                              onClick={() => handleArchive(email.id)}
                              className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground hover:bg-surface-muted"
                            >
                              <ArchiveIcon className="h-3 w-3" />
                              {t(lang, "archive")}
                            </button>
                            <button
                              onClick={() => handleIgnore(email.id)}
                              className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                            >
                              <EyeOff className="h-3 w-3" />
                              {t(lang, "ignore")}
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleRestore(email.id)}
                            className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground hover:bg-surface-muted"
                          >
                            <RotateCcw className="h-3 w-3" />
                            {t(lang, "restore")}
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <p className="text-center text-xs text-muted-foreground">{t(lang, "positioning")}</p>
      </main>
    </div>
  );
}

function Metric({
  label,
  value,
  tone = "calm",
}: {
  label: string;
  value: string;
  tone?: "calm" | "risk";
}) {
  return (
    <div className="bg-surface px-4 py-4">
      <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </div>
      <div
        className={`mt-2 font-display text-2xl tabular-nums ${
          tone === "risk" ? "text-load-high-foreground" : "text-foreground"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
