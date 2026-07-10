import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, Pencil, ShieldCheck, X } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { HealthBadge } from "@/components/app/Sparkline";
import { GuardianBadge, guardianExplainer } from "@/components/app/GuardianBadge";
import { DRAFTS, clientById, fmtMoney } from "@/lib/mock-data";
import { gateForText } from "@/lib/guardian";

function draftGate(d: { subject: string; originalEmail: string; draftBody: string }) {
  return gateForText(`${d.subject} ${d.originalEmail} ${d.draftBody}`);
}

export const Route = createFileRoute("/drafts")({
  head: () => ({
    meta: [
      { title: "Drafts — ISURA" },
      {
        name: "description",
        content: "Reply drafts prepared in each client's voice. Nothing sends without your approval.",
      },
    ],
  }),
  component: DraftsPage,
});

type Status = "pending" | "approved" | "dismissed";

function DraftsPage() {
  const [status, setStatus] = useState<Record<string, Status>>({});
  const [active, setActive] = useState<string>(DRAFTS[0]?.id ?? "");

  const pendingCount = useMemo(
    () => DRAFTS.filter((d) => (status[d.id] ?? "pending") === "pending").length,
    [status],
  );

  const activeDraft = DRAFTS.find((d) => d.id === active) ?? DRAFTS[0];
  const activeClient = activeDraft ? clientById(activeDraft.clientId) : undefined;
  const activeStatus = activeDraft ? status[activeDraft.id] ?? "pending" : "pending";
  const activeGate = activeDraft ? draftGate(activeDraft) : undefined;

  return (
    <AppShell>
      <header>
        <h1 className="font-display text-3xl leading-tight text-foreground sm:text-4xl">Drafts</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {pendingCount} {pendingCount === 1 ? "reply is" : "replies are"} ready for your review.
        </p>
      </header>

      <div className="mt-6 grid gap-5 lg:grid-cols-[320px_1fr]">
        {/* List */}
        <div className="space-y-2">
          {DRAFTS.map((d) => {
            const client = clientById(d.clientId);
            const s = status[d.id] ?? "pending";
            return (
              <button
                key={d.id}
                onClick={() => setActive(d.id)}
                className={`w-full rounded-xl border px-4 py-3 text-left transition-colors ${
                  active === d.id
                    ? "border-border-strong bg-surface-muted"
                    : "border-border/60 bg-surface hover:border-border-strong"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium text-foreground">
                    {client?.name}
                  </span>
                  {s === "pending" ? (
                    client && <HealthBadge health={client.health} />
                  ) : (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        s === "approved"
                          ? "bg-load-low text-load-low-foreground"
                          : "bg-surface-muted text-muted-foreground"
                      }`}
                    >
                      {s === "approved" ? "Approved" : "Dismissed"}
                    </span>
                  )}
                </div>
                <div className="mt-0.5 truncate text-xs text-muted-foreground">{d.subject}</div>
                {s === "pending" && (
                  <div className="mt-1.5">
                    <GuardianBadge gate={draftGate(d)} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Detail */}
        {activeDraft && activeClient && (
          <div className="rounded-2xl border border-border/70 bg-surface p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Link
                to="/clients/$id"
                params={{ id: activeClient.id }}
                className="font-display text-xl text-foreground hover:underline"
              >
                {activeClient.name}
              </Link>
              <span className="text-xs text-muted-foreground">
                {activeDraft.person} · {fmtMoney(activeClient.retainer)}/mo
              </span>
            </div>

            <div className="mt-4 rounded-lg border border-border/60 bg-surface-muted px-4 py-3">
              <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Their email
              </div>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {activeDraft.originalEmail}
              </p>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Draft reply
                </span>
                <span className="text-xs text-muted-foreground">from {activeDraft.toneSource}</span>
              </div>
              <pre className="mt-1 whitespace-pre-wrap rounded-lg bg-surface-muted px-4 py-3 font-sans text-sm leading-relaxed text-foreground">
                {activeDraft.draftBody}
              </pre>
            </div>

            {activeStatus === "pending" ? (
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setStatus((s) => ({ ...s, [activeDraft.id]: "approved" }));
                    toast.success(`Approved & sent to ${activeClient.name}`);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <Check className="h-3.5 w-3.5" />
                  Approve &amp; send
                </button>
                <button
                  onClick={() => toast.success("Draft opened for editing")}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3.5 py-2 text-xs text-foreground transition-colors hover:bg-surface-muted"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    setStatus((s) => ({ ...s, [activeDraft.id]: "dismissed" }));
                    toast(`Dismissed draft for ${activeClient.name}`);
                  }}
                  className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                  Dismiss
                </button>
              </div>
            ) : (
              <div className="mt-4 rounded-lg bg-surface-muted px-4 py-3 text-sm text-muted-foreground">
                This draft was {activeStatus}.{" "}
                <button
                  onClick={() => setStatus((s) => ({ ...s, [activeDraft.id]: "pending" }))}
                  className="text-primary hover:underline"
                >
                  Undo
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <p className="mt-6 flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5" />
        Nothing is ever sent without your tap.
      </p>
    </AppShell>
  );
}
