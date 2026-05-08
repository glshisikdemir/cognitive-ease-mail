import { createFileRoute, Link } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { ArrowRight, Sparkles, Inbox, Flame, CircleDot, EyeOff, MessageSquare } from "lucide-react";
import { Header } from "@/components/Header";
import { emails as allEmails } from "@/lib/emails";
import { quickAssess } from "@/lib/heuristics";
import { useLang, t } from "@/lib/i18n";
import { useArchived } from "@/lib/archive";
import { LoadBadge, PriorityTag } from "@/components/LoadBadge";

const searchSchema = z.object({
  view: fallback(z.enum(["all", "priority", "replies", "low"]), "all").default("all"),
});

export const Route = createFileRoute("/")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "ISURA — Your inbox is under control" },
      {
        name: "description",
        content:
          "ISURA has analyzed your emails and organized your attention. Review priorities, see suggested replies, and stay in control.",
      },
    ],
  }),
  component: Index,
});

function aiSummary(body: string, preview: string) {
  const first = body.split("\n").map((l) => l.trim()).find((l) => l.length > 20) ?? preview;
  return first.length > 110 ? first.slice(0, 110).trimEnd() + "…" : first;
}

function Index() {
  const { lang } = useLang();
  const archived = useArchived();

  const assessed = allEmails
    .filter((e) => !archived.has(e.id))
    .map((e) => ({ email: e, ...quickAssess(e) }));

  const high = assessed.filter((a) => a.priority === "urgent" || a.load === "high").length;
  const low = assessed.filter((a) => a.priority === "ignore" || a.load === "low").length;
  const medium = Math.max(0, assessed.length - high - low);
  const drafts = assessed.filter((a) => a.priority !== "ignore").length;

  const insight =
    low > high
      ? t(lang, "insightLow")
      : t(lang, "insightHigh", { n: high });

  const previews = assessed
    .filter((a) => a.priority !== "ignore" && a.load !== "low")
    .slice(0, 5);

  const cards = [
    {
      key: "high",
      label: t(lang, "highPriority"),
      value: high,
      icon: Flame,
      tone: "text-rose-600",
      ring: "ring-rose-500/20",
    },
    {
      key: "medium",
      label: t(lang, "mediumPriority"),
      value: medium,
      icon: CircleDot,
      tone: "text-amber-600",
      ring: "ring-amber-500/20",
    },
    {
      key: "low",
      label: t(lang, "hiddenMinimized"),
      value: low,
      icon: EyeOff,
      tone: "text-muted-foreground",
      ring: "ring-border",
    },
    {
      key: "drafts",
      label: t(lang, "draftsReady"),
      value: drafts,
      icon: MessageSquare,
      tone: "text-emerald-600",
      ring: "ring-emerald-500/20",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-5xl px-6 py-12 space-y-12">
        {/* Hero */}
        <section className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            ISURA
          </div>
          <h1 className="mt-5 font-display text-4xl leading-tight text-foreground sm:text-5xl">
            {t(lang, "heroTitle")}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[15px] text-muted-foreground sm:text-base">
            {t(lang, "heroSubtitle")}
          </p>
        </section>

        {/* Status cards */}
        <section className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.key}
                className={`rounded-xl border border-border/70 bg-surface px-5 py-5 ring-1 ${c.ring}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{c.label}</span>
                  <Icon className={`h-4 w-4 ${c.tone}`} />
                </div>
                <div className="mt-3 font-display text-3xl tabular-nums text-foreground">
                  {c.value}
                </div>
              </div>
            );
          })}
        </section>

        {/* Primary actions */}
        <section className="grid gap-3 sm:grid-cols-3">
          <Link
            to="/priority"
            className="group flex items-center justify-between rounded-xl bg-primary px-5 py-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <span>{t(lang, "reviewPriority")}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            to="/"
            search={{ view: "replies" }}
            hash="emails"
            className="group flex items-center justify-between rounded-xl border border-border/70 bg-surface px-5 py-4 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted"
          >
            <span>{t(lang, "seeReplies")}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            to="/"
            search={{ view: "all" }}
            hash="emails"
            className="group flex items-center justify-between rounded-xl border border-border/70 bg-surface px-5 py-4 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted"
          >
            <span>{t(lang, "viewAllEmails")}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </section>

        {/* Today's insight */}
        <section className="rounded-2xl border border-border/70 bg-surface px-7 py-7">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            {t(lang, "insightTitle")}
          </div>
          <p className="mt-3 font-display text-2xl leading-snug text-foreground">
            “{insight}”
          </p>
        </section>

        {/* Email preview */}
        <section id="emails" className="overflow-hidden rounded-2xl border border-border/70 bg-surface">
          <div className="flex items-center justify-between border-b border-border/70 px-6 py-4">
            <div className="flex items-center gap-2">
              <Inbox className="h-4 w-4 text-muted-foreground" />
              <h2 className="font-display text-lg text-foreground">
                {t(lang, "emailPreviewTitle")}
              </h2>
            </div>
            <Link
              to="/"
              search={{ view: "all" }}
              hash="emails"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              {t(lang, "viewAllEmails")} →
            </Link>
          </div>

          {previews.length === 0 ? (
            <div className="px-6 py-16 text-center text-sm text-muted-foreground">
              {t(lang, "nothingUrgent")}
            </div>
          ) : (
            <ul>
              {previews.map(({ email, load, priority }) => (
                <li
                  key={email.id}
                  className="flex items-start gap-4 border-b border-border/60 px-6 py-4 last:border-b-0 transition-colors hover:bg-surface-muted/60"
                >
                  <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-accent text-sm font-medium text-accent-foreground">
                    {email.sender[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="truncate text-sm font-medium text-foreground">
                        {email.sender}
                      </span>
                      <PriorityTag priority={priority} />
                      <LoadBadge load={load} />
                    </div>
                    <p className="mt-1 truncate text-sm text-foreground">
                      {email.subject}
                    </p>
                    <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                      {aiSummary(email.body, email.preview)}
                    </p>
                  </div>
                  <Link
                    to="/email/$id"
                    params={{ id: email.id }}
                    className="flex-none rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-surface-muted"
                  >
                    {t(lang, "view")}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
