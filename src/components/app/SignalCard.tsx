import { useState } from "react";
import { ChevronDown, Quote } from "lucide-react";
import {
  CONTRADICTION_LABEL,
  SIGNAL_TYPE_LABEL,
  STRENGTH_META,
  TRUST_META,
  fmtConfidence,
  fmtDate,
  type Signal,
} from "@/lib/intelligence";

// One AI-derived signal, expandable down to the client's own words.
export function SignalCard({ signal }: { signal: Signal }) {
  const [open, setOpen] = useState(false);
  const trust = TRUST_META[signal.validationStatus];

  return (
    <div className="rounded-xl border border-border/60 bg-surface-muted/60">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-start gap-3 px-3.5 py-3 text-left"
      >
        <span aria-hidden className="mt-0.5 text-sm text-foreground/70">
          {trust.glyph}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm text-foreground">{signal.value}</span>
          <span className="mt-1 flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${trust.chip}`}>
              {trust.label}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {SIGNAL_TYPE_LABEL[signal.signalType]} · evidence{" "}
              {STRENGTH_META[signal.evidenceStrength].label.toLowerCase()} · {fmtDate(signal.timestamp)}
            </span>
          </span>
        </span>
        <ChevronDown
          className={`mt-1 h-4 w-4 flex-none text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="border-t border-border/60 px-3.5 py-3">
          {signal.evidence.map((e) => (
            <blockquote key={e.messageId} className="mb-3 rounded-lg bg-surface px-3 py-2.5">
              <p className="flex gap-2 text-sm italic leading-relaxed text-foreground">
                <Quote className="mt-0.5 h-3.5 w-3.5 flex-none text-muted-foreground" />
                {e.excerpt}
              </p>
              <footer className="mt-1.5 text-[11px] text-muted-foreground">
                {e.source} · {fmtDate(e.date)}
              </footer>
            </blockquote>
          ))}

          <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[12px] sm:grid-cols-3">
            <div>
              <dt className="text-muted-foreground">How sure ISURA is</dt>
              <dd className="text-foreground">{fmtConfidence(signal.modelConfidence)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Evidence strength</dt>
              <dd className="text-foreground">{STRENGTH_META[signal.evidenceStrength].label}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Checked</dt>
              <dd className="text-foreground">{trust.label}</dd>
            </div>
            {signal.contradictionStatus !== "none" && (
              <div>
                <dt className="text-muted-foreground">Conflict</dt>
                <dd className="text-foreground">{CONTRADICTION_LABEL[signal.contradictionStatus]}</dd>
              </div>
            )}
          </dl>

          {signal.previousContext && (
            <div className="mt-3 rounded-lg border border-border/60 px-3 py-2.5 text-[12px] leading-relaxed">
              <div className="font-medium text-foreground">Possible change detected</div>
              <p className="mt-1 text-muted-foreground">Previously: {signal.previousContext}</p>
              <p className="text-muted-foreground">Now: {signal.value}</p>
            </div>
          )}

          <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">{signal.guardNote}</p>

          {signal.notKnown && (
            <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">What we don't know: </span>
              {signal.notKnown}
            </p>
          )}

          {signal.humanReviewRequired && (
            <p className="mt-2 text-[12px] font-medium text-foreground">
              ISURA is holding this for your review — it is not treated as fact.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
