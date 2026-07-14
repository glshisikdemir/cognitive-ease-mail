import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, Pencil, ShieldCheck, X, LogIn } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { HealthBadge } from "@/components/app/Sparkline";
import { GuardianBadge, guardianExplainer } from "@/components/app/GuardianBadge";
import { DRAFTS, clientById, fmtMoney } from "@/lib/mock-data";
import { gateForText } from "@/lib/guardian";
import { supabase } from "@/integrations/supabase/client";
import {
  getDraftStates,
  saveDraftState,
  type DraftStatus,
  type DraftStateDTO,
} from "@/lib/draft-states.functions";

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

// Local shape merged from mock drafts + persisted per-user state.
interface DraftState {
  status: DraftStatus;
  editedBody: string | null;
}

function DraftsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);

  // Resolve the current session on the client (route is SSR-on; the
  // protected server fns are only called once we know a user is signed in).
  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setUserId(data.user?.id ?? null);
      setAuthReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user?.id ?? null);
      setAuthReady(true);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (!authReady) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-20 text-sm text-muted-foreground">
          Loading your drafts…
        </div>
      </AppShell>
    );
  }

  if (!userId) return <SignInPrompt />;

  return <DraftsWorkspace />;
}

function SignInPrompt() {
  return (
    <AppShell>
      <header>
        <h1 className="font-display text-3xl leading-tight text-foreground sm:text-4xl">Drafts</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in so your approvals and edits are saved to your account.
        </p>
      </header>
      <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-surface px-6 py-16 text-center">
        <ShieldCheck className="h-8 w-8 text-muted-foreground" />
        <p className="mt-3 text-sm font-medium text-foreground">Your drafts are private.</p>
        <p className="mt-1 max-w-sm text-xs text-muted-foreground">
          Sign in and every decision — approved, edited, or dismissed — is remembered the next time
          you return.
        </p>
        <Link
          to="/login"
          className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <LogIn className="h-3.5 w-3.5" />
          Sign in
        </Link>
      </div>
    </AppShell>
  );
}

function DraftsWorkspace() {
  const queryClient = useQueryClient();
  const loadStates = useServerFn(getDraftStates);
  const persistState = useServerFn(saveDraftState);

  const { data: remoteStates, isLoading } = useQuery({
    queryKey: ["draft-states"],
    queryFn: () => loadStates(),
  });

  // Merge persisted rows into a lookup keyed by draft id.
  const states = useMemo(() => {
    const map: Record<string, DraftState> = {};
    (remoteStates ?? []).forEach((r: DraftStateDTO) => {
      map[r.draftId] = { status: r.status, editedBody: r.editedBody };
    });
    return map;
  }, [remoteStates]);

  const [active, setActive] = useState<string>(DRAFTS[0]?.id ?? "");
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState("");

  const mutation = useMutation({
    mutationFn: (input: { draftId: string; status: DraftStatus; editedBody: string | null }) =>
      persistState({ data: input }),
    onMutate: async (input) => {
      // Optimistic update so the UI reacts instantly.
      await queryClient.cancelQueries({ queryKey: ["draft-states"] });
      const prev = queryClient.getQueryData<DraftStateDTO[]>(["draft-states"]) ?? [];
      const next = prev.filter((r) => r.draftId !== input.draftId);
      next.push({ draftId: input.draftId, status: input.status, editedBody: input.editedBody });
      queryClient.setQueryData(["draft-states"], next);
      return { prev };
    },
    onError: (_e, _input, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["draft-states"], ctx.prev);
      toast.error("Could not save — please try again.");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["draft-states"] }),
  });

  const pendingCount = useMemo(
    () => DRAFTS.filter((d) => (states[d.id]?.status ?? "pending") === "pending").length,
    [states],
  );

  const activeDraft = DRAFTS.find((d) => d.id === active) ?? DRAFTS[0];
  const activeClient = activeDraft ? clientById(activeDraft.clientId) : undefined;
  const activeState = activeDraft ? states[activeDraft.id] : undefined;
  const activeStatus: DraftStatus = activeState?.status ?? "pending";
  const activeBody = activeState?.editedBody ?? activeDraft?.draftBody ?? "";
  const activeGate = activeDraft
    ? gateForText(`${activeDraft.subject} ${activeDraft.originalEmail} ${activeBody}`)
    : undefined;

  function setStatus(draftId: string, status: DraftStatus, editedBody: string | null) {
    mutation.mutate({ draftId, status, editedBody });
  }

  return (
    <AppShell>
      <header>
        <h1 className="font-display text-3xl leading-tight text-foreground sm:text-4xl">Drafts</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {isLoading
            ? "Loading your saved decisions…"
            : `${pendingCount} ${pendingCount === 1 ? "reply is" : "replies are"} ready for your review.`}
        </p>
      </header>

      <div className="mt-6 grid gap-5 lg:grid-cols-[320px_1fr]">
        {/* List */}
        <div className="space-y-2">
          {DRAFTS.map((d) => {
            const client = clientById(d.clientId);
            const s = states[d.id]?.status ?? "pending";
            const body = states[d.id]?.editedBody ?? d.draftBody;
            return (
              <button
                key={d.id}
                onClick={() => {
                  setActive(d.id);
                  setEditing(false);
                }}
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
                    <GuardianBadge
                      gate={gateForText(`${d.subject} ${d.originalEmail} ${body}`)}
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Detail */}
        {activeDraft && activeClient && activeGate && (
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

            <div className="mt-3 flex items-start gap-2 rounded-lg border border-border/60 bg-surface-muted px-4 py-3">
              <GuardianBadge gate={activeGate} />
              <p className="text-xs leading-relaxed text-muted-foreground">
                {guardianExplainer(activeGate)}
              </p>
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
                  Draft reply {activeState?.editedBody ? "(edited)" : ""}
                </span>
                <span className="text-xs text-muted-foreground">from {activeDraft.toneSource}</span>
              </div>
              {editing ? (
                <div className="mt-1">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={8}
                    className="w-full rounded-lg border border-border bg-surface-muted px-4 py-3 font-sans text-sm leading-relaxed text-foreground outline-none focus:border-border-strong"
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => {
                        setStatus(activeDraft.id, activeStatus, editText.trim() || null);
                        setEditing(false);
                        toast.success("Draft saved");
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Save changes
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3.5 py-2 text-xs text-foreground transition-colors hover:bg-surface-muted"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <pre className="mt-1 whitespace-pre-wrap rounded-lg bg-surface-muted px-4 py-3 font-sans text-sm leading-relaxed text-foreground">
                  {activeBody}
                </pre>
              )}
            </div>

            {!editing && activeStatus === "pending" ? (
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  disabled={!activeGate.canExecute}
                  onClick={() => {
                    setStatus(activeDraft.id, "approved", activeState?.editedBody ?? null);
                    toast.success(
                      activeGate.requiresApproval
                        ? `Approved & sent to ${activeClient.name}`
                        : `Sent to ${activeClient.name} — logged in decision memory`,
                    );
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Check className="h-3.5 w-3.5" />
                  {!activeGate.canExecute
                    ? "You must send this"
                    : activeGate.requiresApproval
                      ? "Approve & send"
                      : "Confirm & send"}
                </button>
                <button
                  onClick={() => {
                    setEditText(activeBody);
                    setEditing(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3.5 py-2 text-xs text-foreground transition-colors hover:bg-surface-muted"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    setStatus(activeDraft.id, "dismissed", activeState?.editedBody ?? null);
                    toast(`Dismissed draft for ${activeClient.name}`);
                  }}
                  className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                  Dismiss
                </button>
              </div>
            ) : !editing ? (
              <div className="mt-4 rounded-lg bg-surface-muted px-4 py-3 text-sm text-muted-foreground">
                This draft was {activeStatus}.{" "}
                <button
                  onClick={() =>
                    setStatus(activeDraft.id, "pending", activeState?.editedBody ?? null)
                  }
                  className="text-primary hover:underline"
                >
                  Undo
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>

      <p className="mt-6 flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5" />
        Your decisions are saved to your account — sign back in and they'll be right here.
      </p>
    </AppShell>
  );
}
