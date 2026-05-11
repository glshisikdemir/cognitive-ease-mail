import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Archive as ArchiveIcon, EyeOff } from "lucide-react";
import { TrustStrip } from "@/components/TrustStrip";
import { Header } from "@/components/Header";
import { CategoryBadge, ConfidenceTag, ReasonList } from "@/components/LoadBadge";
import { emails as allEmails } from "@/lib/emails";
import { quickAssess, type Assessment } from "@/lib/heuristics";
import { useEmailStore, setStatus, resetEmail } from "@/lib/email-store";
import { toast } from "sonner";
import { useLang, t } from "@/lib/i18n";
import type { Email } from "@/lib/emails";

export const Route = createFileRoute("/priority")({
  head: () => ({
    meta: [
      { title: "Priority queue — ISURA" },
      {
        name: "description",
        content: "Operational decisions and risks that genuinely require your attention.",
      },
      { property: "og:title", content: "Priority queue — ISURA" },
      {
        property: "og:description",
        content: "ISURA surfaces only what carries operational consequence.",
      },
    ],
  }),
  component: PriorityPage,
});

type Assessed = { email: Email; assessment: Assessment };

function aiSummary(email: Email) {
  const first = email.body.split("\n").map((l) => l.trim()).find((l) => l.length > 20) ?? email.preview;
  return first.length > 160 ? first.slice(0, 160).trimEnd() + "…" : first;
}

function PriorityPage() {
  const { lang } = useLang();
  const store = useEmailStore();

  const assessed: Assessed[] = allEmails
    .filter((e) => (store[e.id]?.status ?? "active") === "active")
    .map((e) => ({ email: e, assessment: quickAssess(e) }));

  const decisions = assessed.filter((a) => a.assessment.category === "decision");
  const risks = assessed.filter((a) => a.assessment.category === "risk");
  const waiting = assessed.filter((a) => a.assessment.category === "waiting");
  const quieted = assessed.filter(
    (a) => a.assessment.category === "low_value" || a.assessment.category === "safe_ignore",
  ).length;

  // Risks first — they have downstream consequences. Then decisions, then waiting.
  const visible = [...risks, ...decisions, ...waiting];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t(lang, "back")}
        </Link>

        <header className="mt-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-priority-urgent" />
            {t(lang, "priorityReviewLabel")}
          </div>
          <h1 className="mt-3 font-display text-4xl leading-[1.1] text-foreground sm:text-5xl">
            {visible.length === 0
              ? t(lang, "priorityCleared")
              : t(lang, "priorityHeading", { n: visible.length })}
          </h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            {visible.length === 0 ? t(lang, "priorityClearedSub") : t(lang, "decisionHint")}
          </p>
        </header>

        {/* Operational summary */}
        <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <SummaryCard label={t(lang, "cat_risk")} value={risks.length} tone="risk" />
          <SummaryCard label={t(lang, "cat_decision")} value={decisions.length} tone="decision" />
          <SummaryCard label={t(lang, "cat_waiting")} value={waiting.length} tone="waiting" />
          <SummaryCard label={t(lang, "hiddenMinimized")} value={quieted} tone="quiet" muted />
        </section>

        {visible.length > 0 && (
          <ol className="mt-8 space-y-3">
            {visible.map(({ email, assessment }, i) => (
              <li
                key={email.id}
                className="rounded-2xl border border-border/70 bg-surface px-6 py-5 transition-colors hover:border-border-strong"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-display text-base text-foreground tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <CategoryBadge category={assessment.category} />
                  <ConfidenceTag confidence={assessment.confidence} />
                  <span className="ml-auto truncate">{email.sender}</span>
                </div>

                <Link
                  to="/email/$id"
                  params={{ id: email.id }}
                  className="mt-2 block font-display text-xl leading-snug text-foreground hover:underline"
                >
                  {email.subject}
                </Link>

                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{aiSummary(email)}</p>

                {assessment.reasons.length > 0 && (
                  <div className="mt-4 rounded-lg border border-border/70 bg-background/60 px-4 py-3">
                    <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                      {t(lang, "whyThisMatters")}
                    </div>
                    <ReasonList reasons={assessment.reasons} />
                  </div>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Link
                    to="/email/$id"
                    params={{ id: email.id }}
                    className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    {t(lang, "openAndDecide")}
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                  <Link
                    to="/email/$id"
                    params={{ id: email.id }}
                    className="rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs text-foreground transition-colors hover:bg-surface-muted"
                  >
                    {t(lang, "generateReply")}
                  </Link>
                  <button
                    onClick={() => {
                      setStatus(email.id, "archived");
                      toast.success(t(lang, "archivedOneToast"), {
                        action: { label: t(lang, "undo"), onClick: () => resetEmail(email.id) },
                      });
                    }}
                    className="ml-auto inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs text-foreground transition-colors hover:bg-surface-muted"
                  >
                    <ArchiveIcon className="h-3 w-3" />
                    {t(lang, "archive")}
                  </button>
                  <button
                    onClick={() => {
                      setStatus(email.id, "ignored");
                      toast.success(t(lang, "ignoredToast"), {
                        action: { label: t(lang, "undo"), onClick: () => resetEmail(email.id) },
                      });
                    }}
                    className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <EyeOff className="h-3 w-3" />
                    {t(lang, "ignore")}
                  </button>
                </div>
              </li>
            ))}
          </ol>
        )}

        {visible.length === 0 && (
          <div className="mt-10 rounded-2xl border border-border/70 bg-surface px-7 py-12 text-center">
            <p className="font-display text-2xl text-foreground">{t(lang, "nothingUrgent")}</p>
            <p className="mt-2 text-sm text-muted-foreground">{t(lang, "nothingUrgentSub")}</p>
            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-surface-muted"
            >
              {t(lang, "backToDashboard")}
            </Link>
          </div>
        )}

        <div className="mt-10">
          <TrustStrip />
        </div>
      </main>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  tone,
  muted,
}: {
  label: string;
  value: number;
  tone: "risk" | "decision" | "waiting" | "quiet";
  muted?: boolean;
}) {
  const dot = {
    risk: "bg-priority-urgent",
    decision: "bg-load-high-foreground/70",
    waiting: "bg-load-medium-foreground/70",
    quiet: "bg-muted-foreground/40",
  }[tone];
  return (
    <div
      className={`rounded-xl border px-4 py-4 ${
        muted ? "border-dashed border-border/60 bg-transparent" : "border-border/70 bg-surface"
      }`}
    >
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
        {label}
      </div>
      <div
        className={`mt-2 font-display text-3xl tabular-nums ${
          muted ? "text-muted-foreground" : "text-foreground"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
