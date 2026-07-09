import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { Sparkline, HealthBadge } from "@/components/app/Sparkline";
import { CLIENTS, bandOf, bandLabel, fmtMoney, type Band } from "@/lib/mock-data";

export const Route = createFileRoute("/clients/")({
  head: () => ({
    meta: [
      { title: "Clients — ISURA" },
      {
        name: "description",
        content: "Your full client relationship graph, sorted by health.",
      },
    ],
  }),
  component: ClientsPage,
});

const BANDS: { key: Band | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "attention", label: "Attention" },
  { key: "watch", label: "Watch" },
  { key: "healthy", label: "Healthy" },
];

function ClientsPage() {
  const [q, setQ] = useState("");
  const [band, setBand] = useState<Band | "all">("all");

  const clients = useMemo(() => {
    return CLIENTS.filter((c) => {
      const matchesQ = c.name.toLowerCase().includes(q.toLowerCase());
      const matchesBand = band === "all" || bandOf(c.health) === band;
      return matchesQ && matchesBand;
    }).sort((a, b) => a.health - b.health);
  }, [q, band]);

  return (
    <AppShell>
      <header>
        <h1 className="font-display text-3xl leading-tight text-foreground sm:text-4xl">Clients</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {CLIENTS.length} accounts, sorted by who needs you most.
        </p>
      </header>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search clients"
            className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-border-strong"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {BANDS.map((b) => (
            <button
              key={b.key}
              onClick={() => setBand(b.key)}
              className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                band === b.key
                  ? "bg-foreground text-background"
                  : "border border-border bg-surface text-muted-foreground hover:text-foreground"
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-border/70">
        <div className="hidden grid-cols-[1fr_auto_auto_auto] gap-4 border-b border-border/60 bg-surface-muted px-5 py-3 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground sm:grid">
          <span>Client</span>
          <span className="text-right">Retainer</span>
          <span className="text-center">7-day</span>
          <span className="text-right">Health</span>
        </div>
        {clients.map((c) => (
          <Link
            key={c.id}
            to="/clients/$id"
            params={{ id: c.id }}
            className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-border/50 bg-surface px-5 py-4 transition-colors last:border-0 hover:bg-surface-muted sm:grid-cols-[1fr_auto_auto_auto]"
          >
            <div className="min-w-0">
              <div className="truncate font-medium text-foreground">{c.name}</div>
              <div className="text-xs text-muted-foreground">
                {c.owner} · {bandLabel(bandOf(c.health))}
              </div>
            </div>
            <div className="hidden text-right text-sm tabular-nums text-muted-foreground sm:block">
              {fmtMoney(c.retainer)}/mo
            </div>
            <div className="hidden justify-center sm:flex">
              <Sparkline data={c.spark} width={72} height={24} />
            </div>
            <div className="flex justify-end">
              <HealthBadge health={c.health} />
            </div>
          </Link>
        ))}
        {clients.length === 0 && (
          <div className="bg-surface px-5 py-10 text-center text-sm text-muted-foreground">
            No clients match your filter.
          </div>
        )}
      </div>
    </AppShell>
  );
}
