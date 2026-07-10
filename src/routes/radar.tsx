import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { FileText, ExternalLink, Filter } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { HealthBadge } from "@/components/app/Sparkline";
import { GuardianBadge } from "@/components/app/GuardianBadge";
import { gateForText } from "@/lib/guardian";
import {
  ALERTS,
  ALERT_LABELS,
  ageLabel,
  clientById,
  fmtMoney,
  type AlertType,
} from "@/lib/mock-data";

export const Route = createFileRoute("/radar")({
  head: () => ({
    meta: [
      { title: "Radar — ISURA" },
      {
        name: "description",
        content: "Every open loop across your clients: unanswered emails, cooling accounts, unkept commitments.",
      },
    ],
  }),
  component: RadarPage,
});

const FILTERS: { key: AlertType | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "unanswered_email", label: "Unanswered" },
  { key: "cooling", label: "Cooling" },
  { key: "unkept_commitment", label: "Commitments" },
  { key: "unanswered_question", label: "Questions" },
];

const TYPE_STYLES: Record<AlertType, string> = {
  unanswered_email: "bg-load-high text-load-high-foreground",
  cooling: "bg-load-medium text-load-medium-foreground",
  unkept_commitment: "bg-load-high text-load-high-foreground",
  unanswered_question: "bg-load-medium text-load-medium-foreground",
};

function RadarPage() {
  const [filter, setFilter] = useState<AlertType | "all">("all");

  const alerts = useMemo(() => {
    const list = filter === "all" ? ALERTS : ALERTS.filter((a) => a.type === filter);
    return [...list].sort((a, b) => b.ageHours - a.ageHours);
  }, [filter]);

  return (
    <AppShell>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl leading-tight text-foreground sm:text-4xl">Radar</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Every open loop across your book, oldest first. {ALERTS.length} signals right now.
          </p>
        </div>
      </header>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
              filter === f.key
                ? "bg-foreground text-background"
                : "border border-border bg-surface text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {alerts.map((a) => {
          const client = clientById(a.clientId);
          if (!client) return null;
          const gate = gateForText(`${a.type} ${a.summary}`);
          return (
            <article
              key={a.id}
              className="rounded-2xl border border-border/70 bg-surface px-5 py-4 transition-colors hover:border-border-strong"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${TYPE_STYLES[a.type]}`}
                    >
                      {ALERT_LABELS[a.type]}
                    </span>
                    <Link
                      to="/clients/$id"
                      params={{ id: client.id }}
                      className="font-display text-lg text-foreground hover:underline"
                    >
                      {client.name}
                    </Link>
                    <HealthBadge health={client.health} />
                    <GuardianBadge gate={gate} />
                  </div>
                  <p className="mt-1.5 text-sm text-muted-foreground">{a.summary}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {a.person} · {fmtMoney(client.retainer)}/mo
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    Waiting
                  </div>
                  <div className="font-display text-xl tabular-nums text-foreground">
                    {ageLabel(a.ageHours)}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  onClick={() =>
                    toast.success(
                      gate.requiresApproval
                        ? `Draft prepared for ${client.name} — awaiting your approval`
                        : `Draft ready for ${client.name} — ISURA can send on approval`,
                    )
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <FileText className="h-3.5 w-3.5" />
                  {gate.requiresApproval ? "Review & approve" : "View draft"}
                </button>
                <Link
                  to="/clients/$id"
                  params={{ id: client.id }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-foreground transition-colors hover:bg-surface-muted"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open account
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </AppShell>
  );
}
