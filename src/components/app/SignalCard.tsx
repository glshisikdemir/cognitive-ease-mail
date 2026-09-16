import { useState } from "react";
import { ChevronDown, Quote } from "lucide-react";
import { fmtDate, type Signal } from "@/lib/intelligence";

function plainStatus(signal: Signal) {
  if (signal.validationStatus === "unsupported") {
    return {
      label: "ISURA couldn't confirm this",
      detail: "There isn't enough in the recent messages to treat this as fact.",
      chip: "bg-surface-muted text-muted-foreground",
    };
  }
  if (signal.validationStatus === "conflicting") {
    return {
      label: "Something changed",
      detail: "This is different from what the client said before.",
      chip: "bg-load-medium text-load-medium-foreground",
    };
  }
  if (signal.validationStatus === "uncertain") {
    return {
      label: "ISURA isn't sure yet",
      detail: signal.notKnown ?? "The client hasn't said enough to be certain.",
      chip: "bg-load-medium text-load-medium-foreground",
    };
  }
  return {
    label: "Supported by recent messages",
    detail: "The client's own words support this.",
    chip: "bg-load-low text-load-low-foreground",
  };
}

export function SignalCard({ signal }: { signal: Signal }) {
  const [open, setOpen] = useState(false);
  const [showContext, setShowContext] = useState(false);
  const status = plainStatus(signal);

  return (
    <article className="rounded-xl border border-border/60 bg-surface-muted/60">
      <div className="flex items-start gap-3 px-4 py-3.5">
        <span aria-hidden className="mt-1 h-2 w-2 flex-none rounded-full bg-muted-foreground" />
        <div className="min-w-0 flex-1">
          <p className="text-sm leading-relaxed text-foreground">{signal.value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{status.label}</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="inline-flex min-h-8 flex-none items-center gap-1 rounded-lg px-2 text-xs font-medium text-foreground transition-colors hover:bg-surface"
        >
          {open ? "Hide" : "Why?"}
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 px-4 py-3.5">
          <p className="text-sm leading-relaxed text-foreground">{status.detail}</p>
          <div className="mt-3 space-y-2">
            {signal.evidence.map((evidence) => (
              <blockquote key={evidence.messageId} className="rounded-lg bg-surface px-3 py-2.5">
                <p className="flex gap-2 text-sm italic leading-relaxed text-foreground">
                  <Quote className="mt-0.5 h-3.5 w-3.5 flex-none text-muted-foreground" />
                  {evidence.excerpt}
                </p>
                <footer className="mt-1.5 text-xs text-muted-foreground">
                  {evidence.source} · {fmtDate(evidence.date)}
                </footer>
              </blockquote>
            ))}
          </div>

          {(signal.previousContext || signal.notKnown || signal.humanReviewRequired) && (
            <button
              type="button"
              onClick={() => setShowContext((value) => !value)}
              aria-expanded={showContext}
              className="mt-3 text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              {showContext ? "Hide context" : "More context"}
            </button>
          )}

          {showContext && (
            <div className="mt-3 space-y-2 rounded-lg border border-border/60 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
              {signal.previousContext && (
                <p>
                  <span className="font-medium text-foreground">Previously: </span>
                  {signal.previousContext}
                </p>
              )}
              {signal.notKnown && (
                <p>
                  <span className="font-medium text-foreground">Still unclear: </span>
                  {signal.notKnown}
                </p>
              )}
              {signal.humanReviewRequired && (
                <p className="font-medium text-foreground">Take a quick look before acting on this.</p>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  );
}