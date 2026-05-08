import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Archive as ArchiveIcon, EyeOff } from "lucide-react";
import { Header } from "@/components/Header";
import { LoadBadge, PriorityTag } from "@/components/LoadBadge";
import { emails as allEmails } from "@/lib/emails";
import { quickAssess, type Load, type Priority } from "@/lib/heuristics";
import { useEmailStore, setStatus, resetEmail } from "@/lib/email-store";
import { toast } from "sonner";
import { useLang, t } from "@/lib/i18n";
import type { Email } from "@/lib/emails";

export const Route = createFileRoute("/priority")({
  head: () => ({
    meta: [
      { title: "Priority review — ISURA" },
      {
        name: "description",
        content: "Focus only on the emails that demand your cognitive effort today.",
      },
      { property: "og:title", content: "Priority review — ISURA" },
      {
        property: "og:description",
        content: "A calm, focused workspace to clear what truly matters.",
      },
    ],
  }),
  component: PriorityPage,
});

type Assessed = { email: Email; load: Load; priority: Priority };

function aiSummary(email: Email) {
  const first = email.body.split("\n").map((l) => l.trim()).find((l) => l.length > 20) ?? email.preview;
  return first.length > 140 ? first.slice(0, 140).trimEnd() + "…" : first;
}

function PriorityPage() {
  const { lang } = useLang();
  const archived = useArchived();

  const assessed: Assessed[] = allEmails
    .filter((e) => !archived.has(e.id))
    .map((e) => ({ email: e, ...quickAssess(e) }));

  const high = assessed.filter((a) => a.priority === "urgent" || a.load === "high");
  const medium = assessed.filter(
    (a) => !(a.priority === "urgent" || a.load === "high") && a.load === "medium" && a.priority !== "ignore",
  );
  const low = assessed.filter((a) => a.priority === "ignore" || a.load === "low").length;

  const visible = [...high, ...medium];

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

        {/* Top summary bar */}
        <section className="mt-8 grid grid-cols-3 gap-3">
          <SummaryCard
            label={t(lang, "highPriority")}
            value={high.length}
            tone="high"
          />
          <SummaryCard
            label={t(lang, "mediumPriority")}
            value={medium.length}
            tone="medium"
          />
          <SummaryCard
            label={t(lang, "hiddenLow")}
            value={low}
            tone="low"
            muted
          />
        </section>

        {visible.length > 0 && (
          <ol className="mt-8 space-y-3">
            {visible.map(({ email, load, priority: p }, i) => (
              <li
                key={email.id}
                className="rounded-2xl border border-border/70 bg-surface px-6 py-5 transition-colors hover:border-border-strong"
              >
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="font-display text-base text-foreground tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <PriorityTag priority={p} />
                  <LoadBadge load={load} />
                  <span className="ml-auto truncate">{email.sender}</span>
                </div>

                <Link
                  to="/email/$id"
                  params={{ id: email.id }}
                  className="mt-2 block font-display text-xl leading-snug text-foreground hover:underline"
                >
                  {email.subject}
                </Link>

                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {aiSummary(email)}
                </p>

                <div className="mt-4 flex items-center gap-2">
                  <Link
                    to="/email/$id"
                    params={{ id: email.id }}
                    className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    {t(lang, "view")}
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
                      archiveEmails([email.id]);
                      toast.success(t(lang, "archivedOneToast"), {
                        action: { label: t(lang, "undo"), onClick: () => unarchive(email.id) },
                      });
                    }}
                    className="ml-auto rounded-md px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {t(lang, "archive")}
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
  tone: "high" | "medium" | "low";
  muted?: boolean;
}) {
  const dot = {
    high: "bg-priority-urgent",
    medium: "bg-load-medium",
    low: "bg-muted-foreground/40",
  }[tone];
  return (
    <div
      className={`rounded-xl border px-4 py-4 ${
        muted
          ? "border-dashed border-border/60 bg-transparent"
          : "border-border/70 bg-surface"
      }`}
    >
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
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
