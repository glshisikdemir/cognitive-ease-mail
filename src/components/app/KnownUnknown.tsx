import { Check, HelpCircle } from "lucide-react";
import { knownSignals, uncertainSignals, type Signal } from "@/lib/intelligence";

// "What we know / What we're unsure about" — uncertainty is a first-class state.
export function KnownUnknown({ signals }: { signals: Signal[] }) {
  const known = knownSignals(signals);
  const unsure = uncertainSignals(signals);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-border/60 bg-surface-muted/60 p-4">
        <h3 className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Check className="h-4 w-4 text-load-low-foreground" />
          What we know
        </h3>
        {known.length === 0 ? (
          <p className="mt-2 text-[12px] text-muted-foreground">
            Nothing is confirmed on this account yet.
          </p>
        ) : (
          <ul className="mt-2 space-y-1.5">
            {known.map((s) => (
              <li key={s.id} className="text-[12px] leading-relaxed text-muted-foreground">
                {s.value}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-xl border border-border/60 bg-surface-muted/60 p-4">
        <h3 className="flex items-center gap-2 text-sm font-medium text-foreground">
          <HelpCircle className="h-4 w-4 text-load-medium-foreground" />
          What we're unsure about
        </h3>
        {unsure.length === 0 ? (
          <p className="mt-2 text-[12px] text-muted-foreground">No open questions right now.</p>
        ) : (
          <ul className="mt-2 space-y-1.5">
            {unsure.map((s) => (
              <li key={s.id} className="text-[12px] leading-relaxed text-muted-foreground">
                {s.notKnown ?? s.value}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
