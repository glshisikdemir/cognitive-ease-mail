import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  UserPlus,
  ExternalLink,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { Sparkline, HealthBadge } from "@/components/app/Sparkline";
import {
  ATTENTION_CLIENTS,
  HEALTHY_CLIENTS,
  totalAtRisk,
  fmtMoney,
  WEEKLY_WINS,
  type Client,
} from "@/lib/mock-data";

export const Route = createFileRoute("/pulse")({
  head: () => ({
    meta: [
      { title: "Pulse — ISURA" },
      {
        name: "description",
        content: "Your 90-second morning ritual: which accounts need attention and which are healthy.",
      },
    ],
  }),
  component: PulsePage,
});

function PulsePage() {
  const [snoozed, setSnoozed] = useState<Set<string>>(new Set());
  const [showHealthy, setShowHealthy] = useState(false);

  const attention = useMemo(
    () => ATTENTION_CLIENTS.filter((c) => !snoozed.has(c.id)).slice(0, 5),
    [snoozed],
  );

  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 18 ? "Good afternoon" : "Good evening";

  return (
    <AppShell>
      {/* Header */}
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl leading-tight text-foreground sm:text-4xl">
            {greeting} — {attention.length} account{attention.length === 1 ? "" : "s"} need
            attention, {HEALTHY_CLIENTS.length} healthy.
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your 90-second morning ritual. Review, act, move on.
          </p>
        </div>
        <div className="rounded-xl border border-load-high/60 bg-load-high px-4 py-3 text-load-high-foreground">
          <div className="text-[10px] font-medium uppercase tracking-[0.16em] opacity-80">
            Revenue at risk
          </div>
          <div className="mt-1 font-display text-2xl tabular-nums">{fmtMoney(totalAtRisk)}</div>
          <div className="text-[11px] opacity-80">/ month across {attention.length} accounts</div>
        </div>
      </header>

      {/* Attention cards */}
      {attention.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="mt-8 space-y-3">
          {attention.map((c, i) => (
            <AttentionCard
              key={c.id}
              index={i + 1}
              client={c}
              onSnooze={() => {
                setSnoozed((s) => new Set(s).add(c.id));
                toast.success(`${c.name} snoozed for 3 days`);
              }}
            />
          ))}
        </div>
      )}

      {/* Healthy collapsed */}
      <section className="mt-6">
        <button
          onClick={() => setShowHealthy((v) => !v)}
          className="flex w-full items-center justify-between rounded-xl border border-border/60 bg-surface px-5 py-4 text-left transition-colors hover:border-border-strong"
        >
          <span className="flex items-center gap-2 text-sm font-medium text-foreground">
            <span className="text-load-low-foreground">✓</span>
            {HEALTHY_CLIENTS.length} accounts healthy
          </span>
          {showHealthy ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
        {showHealthy && (
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {HEALTHY_CLIENTS.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-lg border border-border/60 bg-surface px-4 py-3"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-foreground">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{fmtMoney(c.retainer)}/mo</div>
                </div>
                <div className="flex items-center gap-3">
                  <Sparkline data={c.spark} width={64} height={22} />
                  <HealthBadge health={c.health} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Weekly wins band */}
      <section className="mt-6 rounded-xl border border-border/60 bg-surface-muted px-5 py-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-foreground">
            This week
          </span>
          <span>
            <span className="font-semibold text-foreground tabular-nums">
              {WEEKLY_WINS.draftsSentNoEdits}
            </span>{" "}
            drafts sent without edits
          </span>
          <span className="hidden text-border-strong sm:inline">·</span>
          <span>
            <span className="font-semibold text-foreground tabular-nums">
              {WEEKLY_WINS.coolingCaught}
            </span>{" "}
            cooling accounts caught
          </span>
        </div>
      </section>

      <p className="mt-6 flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5" />
        Drafts are prepared, never sent without your approval.
      </p>
    </AppShell>
  );
}

function AttentionCard({
  index,
  client,
  onSnooze,
}: {
  index: number;
  client: Client;
  onSnooze: () => void;
}) {
  return (
    <article className="rounded-2xl border border-border/70 bg-surface px-6 py-5 transition-colors hover:border-border-strong">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="mt-0.5 font-display text-lg text-muted-foreground tabular-nums">
            {String(index).padStart(2, "0")}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="font-display text-xl text-foreground">{client.name}</h3>
              <HealthBadge health={client.health} />
              <span className="text-xs text-muted-foreground">{fmtMoney(client.retainer)}/mo</span>
            </div>
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {client.reason}
            </p>
          </div>
        </div>
        <div className="shrink-0">
          <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">7-day</div>
          <Sparkline data={client.spark} width={104} height={30} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          onClick={() => toast.success(`Draft opened for ${client.name}`)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <FileText className="h-3.5 w-3.5" />
          View draft
        </button>
        <button
          onClick={() => toast.success(`Assign ${client.name} to a teammate`)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground transition-colors hover:bg-surface-muted"
        >
          <UserPlus className="h-3.5 w-3.5" />
          Assign
        </button>
        <button
          onClick={() => toast.success(`Opening thread with ${client.name}`)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground transition-colors hover:bg-surface-muted"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Open thread
        </button>
        <button
          onClick={onSnooze}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <Clock className="h-3.5 w-3.5" />
          Snooze 3d
        </button>
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="mt-10 rounded-2xl border border-border/70 bg-surface px-7 py-14 text-center">
      <p className="font-display text-2xl text-foreground">All clear</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Your Monday 8:00 briefing is ready.
      </p>
    </div>
  );
}
