import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, X, FileText, Radar as RadarIcon, ShieldCheck, ExternalLink } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { HealthBadge } from "@/components/app/Sparkline";
import { GuardianBadge } from "@/components/app/GuardianBadge";
import { buildApprovalQueue } from "@/lib/approvals";
import { clientById, fmtMoney } from "@/lib/mock-data";

export const Route = createFileRoute("/approvals")({
  head: () => ({
    meta: [
      { title: "Approval Queue — ISURA" },
      {
        name: "description",
        content:
          "Replies and client actions waiting for your review, oldest first.",
      },
    ],
  }),
  component: ApprovalsPage,
});

type Resolution = "approved" | "declined";

function ApprovalsPage() {
  const queue = useMemo(() => buildApprovalQueue(), []);
  const [resolved, setResolved] = useState<Record<string, Resolution>>({});

  const openItems = queue.filter((i) => !resolved[i.id]);

  return (
    <AppShell>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl leading-tight text-foreground sm:text-4xl">
            Approval Queue
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {openItems.length === 0
              ? "Nothing needs your approval right now."
              : `${openItems.length} ${openItems.length === 1 ? "decision is" : "decisions are"} waiting for your call, oldest first.`}
          </p>
        </div>
      </header>

      {openItems.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-surface px-6 py-16 text-center">
          <ShieldCheck className="h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium text-foreground">You're all caught up.</p>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            ISURA only pauses items that genuinely need your judgement.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {queue.map((item) => {
            const client = clientById(item.clientId);
            const res = resolved[item.id];
            const SourceIcon = item.source === "draft" ? FileText : RadarIcon;
            return (
              <article
                key={item.id}
                className={`rounded-2xl border px-5 py-4 transition-colors ${
                  res
                    ? "border-border/50 bg-surface-muted/50 opacity-70"
                    : "border-border/70 bg-surface hover:border-border-strong"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                        <SourceIcon className="h-3 w-3" />
                        {item.source === "draft" ? "Draft" : "Radar"}
                      </span>
                      <Link
                        to="/clients/$id"
                        params={{ id: item.clientId }}
                        className="font-display text-lg text-foreground hover:underline"
                      >
                        {item.clientName}
                      </Link>
                      {client && <HealthBadge health={client.health} />}
                       <GuardianBadge gate={item.gate} />
                    </div>
                    <p className="mt-1.5 text-sm font-medium text-foreground">{item.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
                      {item.summary}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {item.person} · {fmtMoney(item.retainer)}/mo
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                      Waiting
                    </div>
                    <div className="font-display text-xl tabular-nums text-foreground">
                      {item.waiting}
                    </div>
                  </div>
                </div>

                {res ? (
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                     {res === "approved" ? "Approved and sent." : "Declined."}{" "}
                    <button
                      onClick={() =>
                        setResolved((r) => {
                          const next = { ...r };
                          delete next[item.id];
                          return next;
                        })
                      }
                      className="text-primary hover:underline"
                    >
                      Undo
                    </button>
                  </div>
                ) : (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                      disabled={!item.gate.canExecute}
                      onClick={() => {
                        setResolved((r) => ({ ...r, [item.id]: "approved" }));
                        toast.success(`Approved & sent to ${item.clientName}`);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Check className="h-3.5 w-3.5" />
                      {item.gate.canExecute ? "Approve & send" : "You must send this"}
                    </button>
                    <Link
                      to={item.source === "draft" ? "/drafts" : "/radar"}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-foreground transition-colors hover:bg-surface-muted"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Review
                    </Link>
                    <button
                      onClick={() => {
                        setResolved((r) => ({ ...r, [item.id]: "declined" }));
                        toast(`Declined for ${item.clientName}`);
                      }}
                      className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                      Decline
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      <p className="mt-6 flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5" />
         Routine work stays quiet. Only meaningful decisions appear here.
      </p>
    </AppShell>
  );
}
