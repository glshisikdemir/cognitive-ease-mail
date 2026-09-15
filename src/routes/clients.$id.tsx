import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  ArrowLeft,
  FileText,
  Mail,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { Sparkline, HealthBadge } from "@/components/app/Sparkline";
import { GuardPanel, GuardChip } from "@/components/app/GuardPanel";
import { signalsForClient } from "@/lib/intelligence-data";
import { clientById, bandLabel, bandOf, fmtMoney, DRAFTS } from "@/lib/mock-data";

export const Route = createFileRoute("/clients/$id")({
  head: ({ params }) => {
    const client = clientById(params.id);
    return {
      meta: [
        { title: client ? `${client.name} — ISURA` : "Client — ISURA" },
        {
          name: "description",
          content: client
            ? `Relationship health, open loops and timeline for ${client.name}.`
            : "Client account.",
        },
      ],
    };
  },
  component: ClientDetail,
  notFoundComponent: NotFound,
});

function NotFound() {
  return (
    <AppShell>
      <h1 className="font-display text-2xl text-foreground">Client not found</h1>
      <Link to="/clients" className="mt-3 inline-block text-sm text-primary hover:underline">
        Back to clients
      </Link>
    </AppShell>
  );
}

function ClientDetail() {
  const { id } = Route.useParams();
  const router = useRouter();
  const client = clientById(id);

  if (!client) return <NotFound />;

  const draft = DRAFTS.find((d) => d.clientId === client.id);
  const band = bandOf(client.health);
  const signals = signalsForClient(client.id);

  return (
    <AppShell>
      <button
        onClick={() => router.history.back()}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      {/* Header */}
      <header className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-3xl text-foreground sm:text-4xl">{client.name}</h1>
            <HealthBadge health={client.health} />
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {client.owner} · {fmtMoney(client.retainer)}/mo · {bandLabel(band)}
          </p>
          {client.reason && (
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-foreground">{client.reason}</p>
          )}
        </div>
        <div className="rounded-xl border border-border/60 bg-surface px-4 py-3">
          <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            90-day health
          </div>
          <Sparkline data={client.trend90} width={160} height={40} />
        </div>
      </header>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        {/* Left column */}
        <div className="space-y-5">
          {/* Health factors */}
          <section className="rounded-2xl border border-border/70 bg-surface p-5">
            <h2 className="font-display text-lg text-foreground">What's moving health</h2>
            <div className="mt-3 space-y-2">
              {client.factors.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3 rounded-lg bg-surface-muted px-3 py-2.5"
                >
                  <span className="flex items-center gap-2 text-sm text-foreground">
                    {f.delta < 0 ? (
                      <TrendingDown className="h-4 w-4 text-load-high-foreground" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-load-low-foreground" />
                    )}
                    {f.label}
                  </span>
                  <span
                    className={`text-sm font-medium tabular-nums ${
                      f.delta < 0 ? "text-load-high-foreground" : "text-load-low-foreground"
                    }`}
                  >
                    {f.delta > 0 ? `+${f.delta}` : f.delta}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Open loops */}
          <section className="rounded-2xl border border-border/70 bg-surface p-5">
            <h2 className="font-display text-lg text-foreground">Open loops</h2>
            {client.openLoops.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">Nothing open — all clear.</p>
            ) : (
              <div className="mt-3 space-y-2">
                {client.openLoops.map((l) => (
                  <div
                    key={l.id}
                    className="flex items-start justify-between gap-3 rounded-lg border border-border/60 px-3 py-2.5"
                  >
                    <span className="text-sm text-foreground">{l.summary}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">{l.age}</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Draft */}
          {draft && (
            <section className="rounded-2xl border border-border/70 bg-surface p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg text-foreground">Prepared draft</h2>
                <span className="text-xs text-muted-foreground">from {draft.toneSource}</span>
              </div>
              <p className="mt-2 text-sm font-medium text-foreground">{draft.subject}</p>
              <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-surface-muted px-3 py-3 font-sans text-sm leading-relaxed text-foreground">
                {draft.draftBody}
              </pre>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => toast.success(`Draft approved for ${client.name}`)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Approve &amp; send
                </button>
                <button
                  onClick={() => toast.success("Draft opened for editing")}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground transition-colors hover:bg-surface-muted"
                >
                  <FileText className="h-3.5 w-3.5" />
                  Edit first
                </button>
              </div>
            </section>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Contacts */}
          <section className="rounded-2xl border border-border/70 bg-surface p-5">
            <h2 className="font-display text-lg text-foreground">Contacts</h2>
            <div className="mt-3 space-y-2">
              {client.contacts.map((c) => (
                <div key={c.email} className="rounded-lg bg-surface-muted px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{c.name}</span>
                    {c.decisionMaker && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                        Decision maker
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">{c.role}</div>
                  <div className="text-xs text-muted-foreground">{c.email}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Timeline */}
          <section className="rounded-2xl border border-border/70 bg-surface p-5">
            <h2 className="font-display text-lg text-foreground">Timeline</h2>
            <div className="mt-3 space-y-3">
              {client.timeline.map((t) => (
                <div key={t.id} className="flex gap-3">
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                      t.kind === "positive"
                        ? "bg-load-low-foreground"
                        : t.kind === "risk"
                        ? "bg-load-high-foreground"
                        : "bg-muted-foreground"
                    }`}
                  />
                  <div>
                    <div className="text-sm text-foreground">{t.label}</div>
                    <div className="text-xs text-muted-foreground">{t.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Tone */}
          <section className="rounded-2xl border border-border/70 bg-surface p-5">
            <h2 className="font-display text-lg text-foreground">Tone profile</h2>
            <dl className="mt-3 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Greeting</dt>
                <dd className="text-foreground">{client.tone.greeting}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Tone</dt>
                <dd className="text-foreground">{client.tone.tone}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Length</dt>
                <dd className="text-foreground">{client.tone.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Sign-off</dt>
                <dd className="text-foreground">{client.tone.signOff}</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>

      <p className="mt-6 flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5" />
        Drafts are prepared, never sent without your approval.
      </p>
    </AppShell>
  );
}
