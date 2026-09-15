import { useState } from "react";
import { ShieldCheck, ListTree } from "lucide-react";
import {
  AUDIT_STAGE_LABEL,
  SUMMARY_META,
  assessRisk,
  auditTrail,
  fmtDate,
  summarize,
  type Signal,
} from "@/lib/intelligence";
import { SignalCard } from "./SignalCard";
import { KnownUnknown } from "./KnownUnknown";

const RISK_STYLE = {
  low: "bg-load-low text-load-low-foreground",
  medium: "bg-load-medium text-load-medium-foreground",
  high: "bg-load-high text-load-high-foreground",
} as const;

// Compact chip for lists: one glance at whether the signals are trustworthy.
export function GuardChip({ signals }: { signals: Signal[] }) {
  const meta = SUMMARY_META[summarize(signals)];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${meta.chip}`}
      title={meta.blurb}
    >
      <span aria-hidden>{meta.glyph}</span>
      {meta.label}
    </span>
  );
}

// Full evidence-first panel: risk, why, known/unknown, and the audit trail.
export function GuardPanel({ signals }: { signals: Signal[] }) {
  const [showAudit, setShowAudit] = useState(false);
  const risk = assessRisk(signals);
  const meta = SUMMARY_META[summarize(signals)];
  const riskLabel = risk.level === "high" ? "High" : risk.level === "medium" ? "Medium" : "Low";
  const trail = auditTrail(signals, riskLabel);

  return (
    <section className="rounded-2xl border border-border/70 bg-surface p-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 font-display text-lg text-foreground">
            <ShieldCheck className="h-4 w-4 text-foreground/60" />
            Why ISURA thinks this
          </h2>
          <p className="mt-1 max-w-md text-[12px] leading-relaxed text-muted-foreground">
            {meta.blurb}
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Client risk
          </div>
          <div className="mt-1 flex items-center justify-end gap-2">
            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${RISK_STYLE[risk.level]}`}>
              {riskLabel}
            </span>
            <span className="font-display text-xl tabular-nums text-foreground">{risk.score}</span>
          </div>
        </div>
      </header>

      {signals.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          No signals on this account yet — nothing has been concluded.
        </p>
      ) : (
        <>
          <div className="mt-4 space-y-2">
            {risk.contributing.map(({ signal }) => (
              <SignalCard key={signal.id} signal={signal} />
            ))}
          </div>

          {risk.excluded.length > 0 && (
            <div className="mt-4">
              <h3 className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                Not counted towards risk
              </h3>
              <div className="mt-2 space-y-2">
                {risk.excluded.map((s) => (
                  <SignalCard key={s.id} signal={s} />
                ))}
              </div>
            </div>
          )}

          <div className="mt-5">
            <KnownUnknown signals={signals} />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
            <span>{risk.verifiedCount} verified</span>
            <span>·</span>
            <span>{risk.uncertainCount} uncertain</span>
            <span>·</span>
            <span>{risk.needsReviewCount} awaiting your review</span>
            <button
              onClick={() => setShowAudit((v) => !v)}
              aria-expanded={showAudit}
              className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1 text-[11px] text-foreground transition-colors hover:bg-surface-muted"
            >
              <ListTree className="h-3.5 w-3.5" />
              {showAudit ? "Hide trail" : "How we got here"}
            </button>
          </div>

          {showAudit && (
            <ol className="mt-3 space-y-2 border-t border-border/60 pt-3">
              {trail.map((e) => (
                <li key={e.id} className="flex gap-3 text-[12px]">
                  <span className="w-16 flex-none text-muted-foreground">{fmtDate(e.at)}</span>
                  <span className="w-36 flex-none text-foreground">{AUDIT_STAGE_LABEL[e.stage]}</span>
                  <span className="text-muted-foreground">{e.detail}</span>
                </li>
              ))}
            </ol>
          )}
        </>
      )}
    </section>
  );
}
