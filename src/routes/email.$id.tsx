import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { ArrowLeft, Archive as ArchiveIcon, EyeOff, RotateCcw, CheckCircle2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { AIPanel } from "@/components/AIPanel";
import { getEmail } from "@/lib/emails";
import { quickAssess } from "@/lib/heuristics";
import { CategoryBadge, ConfidenceTag, ReasonList } from "@/components/LoadBadge";
import { useLang, t } from "@/lib/i18n";
import { useEmailState, setStatus, resetEmail } from "@/lib/email-store";

export const Route = createFileRoute("/email/$id")({
  loader: ({ params }) => {
    const email = getEmail(params.id);
    if (!email) throw notFound();
    return { email };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.email.subject} — ISURA` : "ISURA" },
    ],
  }),
  component: EmailDetail,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="text-muted-foreground">Email not found.</p>
        <Link to="/" className="mt-4 inline-block text-sm underline">Back to inbox</Link>
      </div>
    </div>
  ),
});

function EmailDetail() {
  const { email } = Route.useLoaderData();
  const { lang } = useLang();
  const state = useEmailState(email.id);
  const navigate = useNavigate();
  const assessment = quickAssess(email);
  const date = new Date(email.receivedAt).toLocaleString(lang === "tr" ? "tr-TR" : "en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const statusLabel = {
    active: null,
    archived: t(lang, "archived"),
    ignored: t(lang, "ignored"),
    replied: t(lang, "replied"),
  }[state.status];

  const statusTone = {
    active: "",
    archived: "border-border bg-surface text-muted-foreground",
    ignored: "border-border bg-surface text-muted-foreground",
    replied: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700",
  }[state.status];

  const onArchive = () => {
    setStatus(email.id, "archived");
    toast.success(t(lang, "archivedOneToast"), {
      action: { label: t(lang, "undo"), onClick: () => resetEmail(email.id) },
    });
    navigate({ to: "/", search: { view: "active" } });
  };
  const onIgnore = () => {
    setStatus(email.id, "ignored");
    toast.success(t(lang, "ignoredToast"), {
      action: { label: t(lang, "undo"), onClick: () => resetEmail(email.id) },
    });
    navigate({ to: "/", search: { view: "active" } });
  };
  const onRestore = () => {
    resetEmail(email.id);
    toast.success(t(lang, "restoredOk"));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex items-center justify-between gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t(lang, "back")}
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            {statusLabel && (
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${statusTone}`}>
                <CheckCircle2 className="h-3 w-3" />
                {statusLabel}
              </span>
            )}
            {state.status === "active" ? (
              <>
                <button
                  onClick={onArchive}
                  className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-foreground hover:bg-surface-muted"
                >
                  <ArchiveIcon className="h-3 w-3" />
                  {t(lang, "archive")}
                </button>
                <button
                  onClick={onIgnore}
                  className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  <EyeOff className="h-3 w-3" />
                  {t(lang, "ignore")}
                </button>
              </>
            ) : (
              <button
                onClick={onRestore}
                className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-foreground hover:bg-surface-muted"
              >
                <RotateCcw className="h-3 w-3" />
                {t(lang, "restore")}
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)]">
          <article className="overflow-hidden rounded-2xl border border-border/70 bg-surface">
            <header className="border-b border-border/70 px-7 py-6">
              <div className="flex flex-wrap items-center gap-2">
                <CategoryBadge category={assessment.category} />
                <ConfidenceTag confidence={assessment.confidence} />
              </div>
              <h1 className="mt-3 font-display text-2xl leading-tight text-foreground">{email.subject}</h1>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-medium text-accent-foreground">
                  {email.sender[0]}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-foreground">{email.sender}</div>
                  <div className="truncate text-xs text-muted-foreground">{email.senderEmail} · {date}</div>
                </div>
              </div>
            </header>

            {assessment.reasons.length > 0 && (
              <section className="border-b border-border/70 bg-background/40 px-7 py-5">
                <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  {t(lang, "operationalReasoning")}
                </div>
                <div className="mt-2 text-sm font-medium text-foreground">
                  {t(lang, "whyThisMatters")}
                </div>
                <ReasonList reasons={assessment.reasons} />
              </section>
            )}

            <div className="px-7 py-6">
              <pre className="whitespace-pre-wrap font-sans text-[15px] leading-relaxed text-foreground">
                {email.body}
              </pre>
            </div>
          </article>

          <aside className="rounded-2xl border border-border/70 bg-surface lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)]">
            <AIPanel email={email} />
          </aside>
        </div>
      </main>
    </div>
  );
}
