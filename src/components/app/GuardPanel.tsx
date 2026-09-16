import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { assessRisk, summarize, type Signal } from "@/lib/intelligence";
import { SignalCard } from "./SignalCard";
import { KnownUnknown } from "./KnownUnknown";

const SUMMARY = {
  verified: {
    label: "Supported by recent messages",
    blurb: "Recent client messages give a clear picture.",
    chip: "bg-load-low text-load-low-foreground",
  },
  needs_review: {
    label: "Worth a quick look",
    blurb: "Most signs are clear, but one detail needs your judgement.",
    chip: "bg-load-medium text-load-medium-foreground",
  },
  conflicting: {
    label: "Something may have changed",
    blurb: "A recent message differs from what the client said before.",
    chip: "bg-load-medium text-load-medium-foreground",
  },
  insufficient: {
    label: "Still taking shape",
    blurb: "There isn't enough recent information to be certain yet.",
    chip: "bg-surface-muted text-muted-foreground",
  },
} as const;

export function GuardChip({ signals }: { signals: Signal[] }) {
  const summary = SUMMARY[summarize(signals)];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${summary.chip}`}>
      {summary.label}
    </span>
  );
}

export function GuardPanel({ signals }: { signals: Signal[] }) {
  const [showDetails, setShowDetails] = useState(false);
  const risk = assessRisk(signals);
  const summary = SUMMARY[summarize(signals)];
  const visibleSignals = risk.contributing.slice(0, 3);

  return (
    <section className="rounded-2xl border border-border/70 bg-surface p-5">
      <header>
        <p className="text-xs font-medium text-muted-foreground">What needs attention</p>
        <h2 className="mt-1 font-display text-xl text-foreground">{summary.label}</h2>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">{summary.blurb}</p>
      </header>

      {signals.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">Nothing needs your attention right now.</p>
      ) : (
        <>
          <div className="mt-4 space-y-2">
            {visibleSignals.map(({ signal }) => (
              <SignalCard key={signal.id} signal={signal} />
            ))}
          </div>

          {(risk.contributing.length > visibleSignals.length || risk.excluded.length > 0) && (
            <button
              type="button"
              onClick={() => setShowDetails((value) => !value)}
              aria-expanded={showDetails}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              {showDetails ? "Show less" : "See the full picture"}
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showDetails ? "rotate-180" : ""}`} />
            </button>
          )}

          {showDetails && (
            <div className="mt-3 space-y-4 border-t border-border/60 pt-4">
              {risk.contributing.slice(visibleSignals.length).map(({ signal }) => (
                <SignalCard key={signal.id} signal={signal} />
              ))}
              {risk.excluded.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-foreground">ISURA isn't sure yet</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    These details stay out of the account picture until there is enough support.
                  </p>
                  <div className="mt-2 space-y-2">
                    {risk.excluded.map((signal) => (
                      <SignalCard key={signal.id} signal={signal} />
                    ))}
                  </div>
                </div>
              )}
              <KnownUnknown signals={signals} />
            </div>
          )}
        </>
      )}
    </section>
  );
}