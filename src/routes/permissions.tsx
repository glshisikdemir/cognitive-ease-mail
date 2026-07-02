import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { ProductFooter } from "@/components/ProductFooter";
import { useLang } from "@/lib/i18n";
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  LEVEL_META,
  type AutonomyCategory,
  type AutonomyLevel,
} from "@/lib/guardian";
import { getPermissions, setPermission } from "@/lib/guardian.functions";

export const Route = createFileRoute("/permissions")({
  head: () => ({
    meta: [
      { title: "Permission Center · ISURA" },
      {
        name: "description",
        content:
          "Configure how much autonomy ISURA has in each area. Autonomous execution, human authority.",
      },
    ],
  }),
  component: PermissionsPage,
});

const LEVELS: AutonomyLevel[] = [
  "level1_autonomous",
  "level2_silent",
  "level3_approval",
  "level4_strategic",
];

const COLOR_RING: Record<string, string> = {
  emerald: "ring-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  sky: "ring-sky-500/40 bg-sky-500/10 text-sky-600 dark:text-sky-400",
  amber: "ring-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  rose: "ring-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

function PermissionsPage() {
  const { lang } = useLang();
  const load = useServerFn(getPermissions);
  const save = useServerFn(setPermission);
  const [levels, setLevels] = useState<Record<string, AutonomyLevel>>({});
  const [loading, setLoading] = useState(true);
  const [savingCat, setSavingCat] = useState<string | null>(null);

  useEffect(() => {
    load()
      .then((rows) => {
        const map: Record<string, AutonomyLevel> = {};
        for (const r of rows) map[r.category] = r.level;
        setLevels(map);
      })
      .catch((e) => toast.error(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [load]);

  const change = async (category: AutonomyCategory, level: AutonomyLevel) => {
    const prev = levels[category];
    setLevels((m) => ({ ...m, [category]: level }));
    setSavingCat(category);
    try {
      await save({ data: { category, level } });
    } catch (e) {
      setLevels((m) => ({ ...m, [category]: prev }));
      toast.error(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSavingCat(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl space-y-8 px-6 py-10">
        <section>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" />
            {lang === "tr" ? "İzin Merkezi" : "Permission Center"}
          </div>
          <h1 className="mt-2 font-display text-2xl text-foreground sm:text-3xl">
            {lang === "tr" ? "Otonomi seviyelerini yapılandır" : "Configure autonomy levels"}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            {lang === "tr"
              ? "Her alan için ISURA'nın ne kadar bağımsız hareket edeceğini bir kez ayarlayın. Otonom uygulama, insan otoritesi."
              : "Set once how independently ISURA acts in each area. Autonomous execution, human authority."}
          </p>
        </section>

        <section className="space-y-3">
          {LEVELS.map((lv) => {
            const m = LEVEL_META[lv];
            return (
              <div key={lv} className="flex items-start gap-3 text-xs text-muted-foreground">
                <span
                  className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] font-semibold ring-1 ${COLOR_RING[m.color]}`}
                >
                  {m.n}
                </span>
                <p>
                  <span className="font-medium text-foreground">{m.label[lang]}</span> — {m.desc[lang]}
                </p>
              </div>
            );
          })}
        </section>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            {lang === "tr" ? "Yükleniyor…" : "Loading…"}
          </div>
        ) : (
          <section className="space-y-3">
            {CATEGORY_ORDER.map((cat) => {
              const meta = CATEGORY_META[cat];
              const current = levels[cat] ?? meta.defaultLevel;
              return (
                <div
                  key={cat}
                  className="rounded-xl border border-border/70 bg-surface px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">{meta.label[lang]}</p>
                      <p className="text-xs text-muted-foreground">{meta.desc[lang]}</p>
                    </div>
                    {savingCat === cat && (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {LEVELS.map((lv) => {
                      const m = LEVEL_META[lv];
                      const active = current === lv;
                      return (
                        <button
                          key={lv}
                          onClick={() => change(cat, lv)}
                          className={`rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 transition-colors ${
                            active
                              ? COLOR_RING[m.color]
                              : "ring-border/70 text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {m.n}. {m.short[lang]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </section>
        )}
      </main>
      <ProductFooter />
    </div>
  );
}
