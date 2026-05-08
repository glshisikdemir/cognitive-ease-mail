import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { LoadBadge, PriorityTag } from "@/components/LoadBadge";
import { emails as allEmails } from "@/lib/emails";
import { quickAssess } from "@/lib/heuristics";
import { useArchived, archiveEmails, unarchive } from "@/lib/archive";
import { toast } from "sonner";
import { useLang, t } from "@/lib/i18n";

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

function PriorityPage() {
  const { lang } = useLang();
  const archived = useArchived();
  const priority = allEmails
    .map((e) => ({ email: e, ...quickAssess(e) }))
    .filter(({ email, load, priority }) =>
      !archived.has(email.id) && (priority === "urgent" || load === "high"),
    );

  const totalMin = priority.length * 4;

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
            {priority.length === 0
              ? t(lang, "priorityCleared")
              : t(lang, "priorityHeading", { n: priority.length })}
          </h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            {priority.length === 0
              ? t(lang, "priorityClearedSub")
              : t(lang, "priorityHeadingSub", { min: totalMin })}
          </p>
        </header>

        {priority.length > 0 && (
          <ol className="mt-8 space-y-3">
            {priority.map(({ email, load, priority: p }, i) => (
              <li
                key={email.id}
                className="rounded-2xl border border-border/70 bg-surface px-6 py-5 transition-colors hover:border-border-strong"
              >
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="font-display text-base text-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <PriorityTag priority={p} />
                  <LoadBadge load={load} />
                  <span className="ml-auto">{email.sender}</span>
                </div>
                <Link
                  to="/email/$id"
                  params={{ id: email.id }}
                  className="mt-2 block font-display text-xl leading-snug text-foreground hover:underline"
                >
                  {email.subject}
                </Link>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{email.preview}</p>
                <div className="mt-4 flex items-center gap-2">
                  <Link
                    to="/email/$id"
                    params={{ id: email.id }}
                    className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    {t(lang, "openAndDecide")}
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                  <button
                    onClick={() => {
                      archiveEmails([email.id]);
                      toast.success(t(lang, "archivedOneToast"), {
                        action: { label: t(lang, "undo"), onClick: () => unarchive(email.id) },
                      });
                    }}
                    className="rounded-md px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {t(lang, "ignore")}
                  </button>
                </div>
              </li>
            ))}
          </ol>
        )}

        {priority.length === 0 && (
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
