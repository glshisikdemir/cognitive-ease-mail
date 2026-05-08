import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { analyzeEmail, type EmailAnalysis } from "@/lib/analyze.functions";
import { LoadBadge } from "./LoadBadge";
import { useLang, t } from "@/lib/i18n";
import { useEmailState, setReplyDraft, setStatus } from "@/lib/email-store";
import type { Email } from "@/lib/emails";

export function AIPanel({ email }: { email: Email }) {
  const { lang } = useLang();
  const fn = useServerFn(analyzeEmail);
  const stored = useEmailState(email.id);
  const [analysis, setAnalysis] = useState<EmailAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState(stored.replyDraft ?? "");
  const [editing, setEditing] = useState(false);

  const run = async (regenerate = false) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn({
        data: { sender: email.sender, subject: email.subject, body: email.body, regenerate },
      });
      setAnalysis(result);
      if (!stored.replyDraft || regenerate) {
        setDraft(result.replyDraft);
        setReplyDraft(email.id, result.replyDraft);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    run(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email.id]);

  if (loading && !analysis) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center text-muted-foreground">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground/60"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
        <p className="font-display text-lg italic">{t(lang, "thinking")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 py-8 text-sm text-destructive">
        {error}
        <button onClick={() => run(false)} className="ml-3 underline">retry</button>
      </div>
    );
  }

  if (!analysis) return null;

  const decisionLabel = {
    yes: t(lang, "yes"),
    no: t(lang, "no"),
    delegate: t(lang, "delegate"),
  }[analysis.shouldRespond];

  const decisionColor = {
    yes: "text-load-high-foreground bg-load-high",
    no: "text-muted-foreground bg-muted",
    delegate: "text-load-medium-foreground bg-load-medium",
  }[analysis.shouldRespond];

  return (
    <div className="flex h-full flex-col">
      <div className="space-y-7 overflow-y-auto px-6 py-6">
        {/* Section 1 — Understanding */}
        <Section label={t(lang, "understanding")}>
          <Field label={t(lang, "summary")}>
            <p className="text-sm leading-relaxed text-foreground">{analysis.summary}</p>
          </Field>
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-[11px] font-medium capitalize text-muted-foreground">
              {t(lang, "intent")}: {analysis.intent}
            </span>
            <LoadBadge load={analysis.cognitiveLoad} />
          </div>
        </Section>

        {/* Section 2 — Decision */}
        <Section label={t(lang, "decision")}>
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              {t(lang, "shouldRespond")}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-sm font-semibold ${decisionColor}`}>
                {decisionLabel}
              </span>
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                · {t(lang, "urgency")}: <span className="text-foreground">{analysis.urgencyLevel}</span>
              </span>
            </div>
          </div>
          <Field label={t(lang, "why")}>
            <p className="text-sm leading-relaxed text-muted-foreground">{analysis.reasoning}</p>
          </Field>
        </Section>

        {/* Section 3 — Reply */}
        <Section label={`${t(lang, "reply")} · ${t(lang, "tone")}: ${analysis.tone}`}>
          {editing ? (
            <textarea
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                setReplyDraft(email.id, e.target.value);
              }}
              rows={Math.min(18, draft.split("\n").length + 2)}
              className="w-full resize-y rounded-lg border border-border bg-surface px-3 py-2.5 text-sm leading-relaxed text-foreground outline-none focus:border-border-strong focus:ring-2 focus:ring-ring/20"
            />
          ) : (
            <div className="rounded-lg border border-border bg-surface px-4 py-3.5">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
                {draft}
              </pre>
              <div className="mt-3 border-t border-border/70 pt-2 text-[11px] text-muted-foreground">
                {t(lang, "byIsura")}
              </div>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2 pt-3">
            <button
              onClick={() => run(true)}
              disabled={loading || stored.status === "replied"}
              className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-surface-muted disabled:opacity-50"
            >
              {loading ? "…" : t(lang, "regenerate")}
            </button>
            <button
              onClick={() => setEditing((v) => !v)}
              disabled={stored.status === "replied"}
              className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-surface-muted disabled:opacity-50"
            >
              {t(lang, "edit")}
            </button>
            <button
              onClick={() => {
                setReplyDraft(email.id, draft);
                setStatus(email.id, "replied");
                toast.success(t(lang, "repliedToast"));
                setEditing(false);
              }}
              disabled={stored.status === "replied" || !draft.trim()}
              className="ml-auto rounded-md bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
            >
              {stored.status === "replied" ? t(lang, "replied") : t(lang, "approveSend")}
            </button>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 text-xs text-muted-foreground">{label}</div>
      {children}
    </div>
  );
}
