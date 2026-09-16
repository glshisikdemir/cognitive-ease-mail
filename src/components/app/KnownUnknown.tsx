import { Check, HelpCircle } from "lucide-react";
import { knownSignals, uncertainSignals, type Signal } from "@/lib/intelligence";

export function KnownUnknown({ signals }: { signals: Signal[] }) {
  const known = knownSignals(signals);
  const unsure = uncertainSignals(signals);

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <section className="rounded-xl border border-border/60 bg-surface-muted/60 p-4">
        <h3 className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Check className="h-4 w-4 text-load-low-foreground" />
          Clear from recent messages
        </h3>
        {known.length === 0 ? (
          <p className="mt-2 text-xs text-muted-foreground">Nothing is clear enough yet.</p>
        ) : (
          <ul className="mt-2 space-y-1.5">
            {known.map((signal) => (
              <li key={signal.id} className="text-xs leading-relaxed text-muted-foreground">
                {signal.value}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-border/60 bg-surface-muted/60 p-4">
        <h3 className="flex items-center gap-2 text-sm font-medium text-foreground">
          <HelpCircle className="h-4 w-4 text-load-medium-foreground" />
          Still unclear
        </h3>
        {unsure.length === 0 ? (
          <p className="mt-2 text-xs text-muted-foreground">No open questions right now.</p>
        ) : (
          <ul className="mt-2 space-y-1.5">
            {unsure.map((signal) => (
              <li key={signal.id} className="text-xs leading-relaxed text-muted-foreground">
                {signal.notKnown ?? signal.value}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}