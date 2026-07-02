import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  ShieldCheck,
  Loader2,
  Check,
  X,
  Play,
  Undo2,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { ProductFooter } from "@/components/ProductFooter";
import { useLang } from "@/lib/i18n";
import {
  CATEGORY_META,
  LEVEL_META,
  RISK_META,
  STATUS_META,
  canEverExecute,
} from "@/lib/guardian";
import { listDecisions, updateDecisionStatus, type DecisionRow } from "@/lib/guardian.functions";

export const Route = createFileRoute("/guardian")({
  head: () => ({
    meta: [
      { title: "Decision Guardian · ISURA" },
      {
        name: "description",
        content:
          "Every action ISURA proposes or takes, with full explainability. Approve, reject, or undo. Nothing is a black box.",
      },
    ],
  }),
  component: GuardianPage,
});

const COLOR: Record<string, string> = {
  emerald: "ring-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  sky: "ring-sky-500/40 bg-sky-500/10 text-sky-600 dark:text-sky-400",
  amber: "ring-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  rose: "ring-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400",
  muted: "ring-border/70 bg-muted/40 text-muted-foreground",
};

function Chip({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ${COLOR[color]}`}
    >
      {children}
    </span>
  );
}

function GuardianPage() {
  const { lang } = useLang();
  const load = useServerFn(listDecisions);
  const update = useServerFn(updateDecisionStatus);
  const [rows, setRows] = useState<DecisionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const refresh = useCallback(() => {
    return load({ data: {} })
      .then(setRows)
      .catch((e) => toast.error(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [load]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const act = async (
    id: string,
    status: DecisionRow["status"],
    outcome?: string,
  ) => {
    setBusy(id);
    try {
      await update({ data: { id, status, outcome } });
      await refresh();
      toast.success(lang === "tr" ? "Güncellendi" : "Updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(null);
    }
  };

  const pending = rows.filter((r) => r.status === "pending");
  const history = rows.filter((r) => r.status !== "pending");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl space-y-8 px-6 py-10">
        <section>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" />
            {lang === "tr" ? "Karar Muhafızı" : "Decision Guardian"}
          </div>
          <h1 className="mt-2 font-display text-2xl text-foreground sm:text-3xl">
            {lang === "tr" ? "Ne bekliyor, ne yapıldı" : "What's waiting, what's done"}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            {lang === "tr"
              ? "ISURA'nın önerdiği veya yaptığı her şey — tam açıklanabilirlik ile. Hiçbir şey kara kutu değildir."
              : "Every action ISURA proposes or takes, with full explainability. Nothing is a black box."}
          </p>
        </section>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            {lang === "tr" ? "Yükleniyor…" : "Loading…"}
          </div>
        ) : rows.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/70 bg-surface px-4 py-8 text-center">
            <Sparkles className="mx-auto h-5 w-5 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              {lang === "tr"
                ? "Henüz karar yok. ISURA bir işlem önerdiğinde burada görünür."
                : "No decisions yet. When ISURA proposes an action it appears here."}
            </p>
          </div>
        ) : (
          <>
            {pending.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  {lang === "tr" ? "Onay bekleyenler" : "Awaiting approval"} ({pending.length})
                </div>
                {pending.map((d) => (
                  <DecisionCard
                    key={d.id}
                    d={d}
                    lang={lang}
                    busy={busy === d.id}
                    onApprove={() => act(d.id, "approved")}
                    onReject={() => act(d.id, "rejected")}
                    onExecute={
                      canEverExecute(d.level)
                        ? () => act(d.id, "executed", lang === "tr" ? "Uygulandı" : "Executed")
                        : undefined
                    }
                  />
                ))}
              </section>
            )}

            {history.length > 0 && (
              <section className="space-y-3">
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {lang === "tr" ? "Karar zaman çizelgesi" : "Decision timeline"}
                </div>
                {history.map((d) => (
                  <DecisionCard
                    key={d.id}
                    d={d}
                    lang={lang}
                    busy={busy === d.id}
                    onUndo={
                      d.status === "executed"
                        ? () => act(d.id, "undone", lang === "tr" ? "Geri alındı" : "Undone")
                        : undefined
                    }
                  />
                ))}
              </section>
            )}
          </>
        )}
      </main>
      <ProductFooter />
    </div>
  );
}

function DecisionCard({
  d,
  lang,
  busy,
  onApprove,
  onReject,
  onExecute,
  onUndo,
}: {
  d: DecisionRow;
  lang: "en" | "tr";
  busy: boolean;
  onApprove?: () => void;
  onReject?: () => void;
  onExecute?: () => void;
  onUndo?: () => void;
}) {
  const lvl = LEVEL_META[d.level];
  const risk = RISK_META[d.risk];
  const status = STATUS_META[d.status];
  const cat = CATEGORY_META[d.category];

  return (
    <div className="rounded-xl border border-border/70 bg-surface px-4 py-3">
      <div className="flex flex-wrap items-center gap-1.5">
        <Chip color={status.color}>{status.label[lang]}</Chip>
        <Chip color={lvl.color}>
          {lvl.n}. {lvl.short[lang]}
        </Chip>
        <Chip color={risk.color}>
          {lang === "tr" ? "Risk" : "Risk"}: {risk.label[lang]}
        </Chip>
        <span className="text-[11px] text-muted-foreground">{cat.label[lang]}</span>
        {typeof d.confidence === "number" && (
          <span className="ml-auto text-[11px] text-muted-foreground">
            {lang === "tr" ? "Güven" : "Confidence"} {Math.round(d.confidence)}%
          </span>
        )}
      </div>

      <p className="mt-2 text-sm font-medium text-foreground">{d.title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{d.recommendation}</p>

      {d.reasoning && (
        <p className="mt-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{lang === "tr" ? "Neden" : "Why"}: </span>
          {d.reasoning}
        </p>
      )}
      {d.evidence.length > 0 && (
        <div className="mt-2">
          <p className="text-xs font-medium text-foreground">
            {lang === "tr" ? "Kanıt" : "Evidence"}
          </p>
          <ul className="mt-1 list-disc pl-4 text-xs text-muted-foreground">
            {d.evidence.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}
      {d.alternatives.length > 0 && (
        <div className="mt-2">
          <p className="text-xs font-medium text-foreground">
            {lang === "tr" ? "Alternatifler" : "Alternatives"}
          </p>
          <ul className="mt-1 list-disc pl-4 text-xs text-muted-foreground">
            {d.alternatives.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}
      {d.do_nothing_outcome && (
        <p className="mt-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">
            {lang === "tr" ? "Hiçbir şey yapmazsak" : "If we do nothing"}:{" "}
          </span>
          {d.do_nothing_outcome}
        </p>
      )}
      {d.level === "level4_strategic" && d.status === "pending" && (
        <p className="mt-2 rounded-lg bg-rose-500/10 px-2.5 py-1.5 text-[11px] text-rose-600 dark:text-rose-400">
          {lang === "tr"
            ? "Stratejik karar — ISURA öneri hazırlar ama uygulayamaz. Yalnızca insan karar verir."
            : "Strategic decision — ISURA prepares recommendations but cannot execute. Only humans decide."}
        </p>
      )}
      {d.outcome && (
        <p className="mt-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{lang === "tr" ? "Sonuç" : "Outcome"}: </span>
          {d.outcome}
        </p>
      )}

      {(onApprove || onReject || onExecute || onUndo) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {onApprove && (
            <button
              onClick={onApprove}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-[12px] font-medium text-background disabled:opacity-50"
            >
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
              {lang === "tr" ? "Onayla" : "Approve"}
            </button>
          )}
          {onExecute && (
            <button
              onClick={onExecute}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-full ring-1 ring-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-[12px] font-medium text-emerald-600 dark:text-emerald-400 disabled:opacity-50"
            >
              <Play className="h-3.5 w-3.5" />
              {lang === "tr" ? "Uygula" : "Execute"}
            </button>
          )}
          {onReject && (
            <button
              onClick={onReject}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-full ring-1 ring-border/70 px-3 py-1.5 text-[12px] font-medium text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              <X className="h-3.5 w-3.5" />
              {lang === "tr" ? "Reddet" : "Reject"}
            </button>
          )}
          {onUndo && (
            <button
              onClick={onUndo}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-full ring-1 ring-border/70 px-3 py-1.5 text-[12px] font-medium text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              <Undo2 className="h-3.5 w-3.5" />
              {lang === "tr" ? "Geri al" : "Undo"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
