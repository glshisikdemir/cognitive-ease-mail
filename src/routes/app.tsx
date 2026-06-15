import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { toast } from "sonner";
import { ArrowRight, Inbox, ShieldCheck, Lock } from "lucide-react";
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
import { DailyBriefing } from "@/components/DailyBriefing";
import { TrustStrip } from "@/components/TrustStrip";
import { ProductFooter } from "@/components/ProductFooter";
import { AddEmailPanel } from "@/components/AddEmailPanel";
import { useCustomEmails } from "@/lib/custom-emails";
import {
  OperationalSection,
  type SectionKey,
  type WorkspaceItem,
} from "@/components/OperationalSection";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "ISURA — Operational workspace" },
      {
        name: "description",
        content:
          "ISURA organizes operational attention. Decisions, risks, follow-ups, and quieted noise — laid out with calm.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { lang } = useLang();
  const store = useEmailStore();
  const custom = useCustomEmails();

  const enriched: WorkspaceItem[] = useMemo(
    () =>
      [...custom, ...allEmails].map((email) => {
        const status = (store[email.id]?.status ?? "active") as EmailStatus;
        return { email, status, assessment: quickAssess(email) };
      }),
    [store, custom],
  );

  const relief = useMemo(
    () => computeRelief(enriched.map((e) => ({ assessment: e.assessment, status: e.status }))),
    [enriched],
  );

  // Section grouping by operational state.
  const groups: Record<SectionKey, WorkspaceItem[]> = {
    decision: [],
    risk: [],
    waiting: [],
    followup: [],
    review: [],
    low: [],
    resolved: [],
  };

  for (const item of enriched) {
    const { status, assessment } = item;
    if (status === "replied") {
      groups.review.push(item);
      groups.resolved.push(item);
      continue;
    }
    if (status === "archived" || status === "ignored") {
      groups.resolved.push(item);
      continue;
    }
    // active
    if (assessment.category === "risk") groups.risk.push(item);
    else if (assessment.category === "decision") groups.decision.push(item);
    else if (assessment.category === "waiting") {
      groups.waiting.push(item);
      groups.followup.push(item);
    } else groups.low.push(item);
  }

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

  // Section render order — risk-first, then decisions, then forward-looking, then quieter zones.
  const order: SectionKey[] = ["risk", "decision", "followup", "waiting", "review", "low", "resolved"];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-5xl space-y-10 px-6 py-10">
        {/* Daily briefing */}
        <DailyBriefing items={enriched.map((e) => ({ assessment: e.assessment, status: e.status }))} />

        {/* Cognitive relief metrics */}
        <section className="rounded-2xl border border-border/70 bg-surface px-6 py-6">
          <div>
            <h2 className="font-display text-xl text-foreground">{t(lang, "reliefTitle")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t(lang, "reliefSubtitle")}</p>
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
              {t(lang, "trustPersistentNoSend")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Lock className="h-3 w-3" />
              {t(lang, "trustPersistentReadOnly")}
            </span>
          </div>
        </section>

        {/* Workspace header */}
        <section className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              <Inbox className="h-3.5 w-3.5" />
              {t(lang, "inbox")}
            </div>
            <h1 className="mt-2 font-display text-2xl text-foreground sm:text-3xl">
              {t(lang, "workspaceTitle")}
            </h1>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              {t(lang, "workspaceSubtitle")}
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

        {/* Manual email add */}
        <AddEmailPanel />

        {/* Operational sections */}
        <div className="space-y-4">

          {order.map((key) => (
            <OperationalSection
              key={key}
              section={key}
              items={groups[key]}
              onArchive={handleArchive}
              onIgnore={handleIgnore}
              onRestore={handleRestore}
            />
          ))}
        </div>

        <TrustStrip />

        <p className="text-center text-xs text-muted-foreground">{t(lang, "positioning")}</p>
      </main>
      <ProductFooter />
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
