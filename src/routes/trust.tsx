import { ShieldCheck, Lock, KeyRound, Hand, FileLock2, BrainCircuit, Settings2, ArrowLeft } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { ProductFooter } from "@/components/ProductFooter";
import { useLang, t } from "@/lib/i18n";

export const Route = createFileRoute("/trust")({
  head: () => ({
    meta: [
      { title: "Trust & security — ISURA" },
      {
        name: "description",
        content:
          "How ISURA accesses your email, the encryption, the human approval architecture, and your permission controls.",
      },
      { property: "og:title", content: "Trust & security — ISURA" },
      {
        property: "og:description",
        content: "Calm, transparent, controlled. You stay in control. ISURA only assists.",
      },
    ],
  }),
  component: TrustPage,
});

function TrustPage() {
  const { lang } = useLang();

  const sections: { Icon: typeof Lock; title: string; body: string }[] = [
    { Icon: KeyRound, title: t(lang, "trustS1Title"), body: t(lang, "trustS1Body") },
    { Icon: ShieldCheck, title: t(lang, "trustS2Title"), body: t(lang, "trustS2Body") },
    { Icon: Lock, title: t(lang, "trustS3Title"), body: t(lang, "trustS3Body") },
    { Icon: Hand, title: t(lang, "trustS4Title"), body: t(lang, "trustS4Body") },
    { Icon: FileLock2, title: t(lang, "trustS5Title"), body: t(lang, "trustS5Body") },
    { Icon: BrainCircuit, title: t(lang, "trustS6Title"), body: t(lang, "trustS6Body") },
    { Icon: Settings2, title: t(lang, "trustS7Title"), body: t(lang, "trustS7Body") },
  ];

  const pillars = [
    { Icon: Hand, label: t(lang, "trustPillarApproval") },
    { Icon: ShieldCheck, label: t(lang, "trustPillarReadOnly") },
    { Icon: Settings2, label: t(lang, "trustPillarDisconnect") },
    { Icon: BrainCircuit, label: t(lang, "trustPillarNoTraining") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <Link
          to="/app"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t(lang, "back")}
        </Link>

        <header className="mt-6">
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" />
            {t(lang, "trustHeroLabel")}
          </div>
          <h1 className="mt-3 font-display text-4xl leading-[1.1] text-foreground sm:text-5xl">
            {t(lang, "trustHeroTitle")}
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
            {t(lang, "trustHeroSub")}
          </p>
        </header>

        {/* Pillars */}
        <section className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border/70 bg-border/70 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map(({ Icon, label }) => (
            <div key={label} className="bg-surface px-5 py-5">
              <Icon className="h-4 w-4 text-foreground/70" />
              <div className="mt-3 text-sm font-medium text-foreground">{label}</div>
            </div>
          ))}
        </section>

        {/* Sections */}
        <ol className="mt-10 space-y-3">
          {sections.map(({ Icon, title, body }, i) => (
            <li
              key={title}
              className="rounded-2xl border border-border/70 bg-surface px-7 py-6 transition-colors hover:border-border-strong"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-border/70 bg-background">
                  <Icon className="h-4 w-4 text-foreground/70" />
                </span>
                <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h2 className="font-display text-xl text-foreground">{title}</h2>
              </div>
              <p className="mt-3 pl-11 text-[15px] leading-relaxed text-muted-foreground">
                {body}
              </p>
            </li>
          ))}
        </ol>

        {/* Closing */}
        <section className="mt-10 rounded-2xl border border-border/70 bg-surface px-7 py-8 text-center">
          <h2 className="font-display text-2xl text-foreground">{t(lang, "trustClosingTitle")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t(lang, "trustClosingBody")}</p>
        </section>
      </main>
      <ProductFooter />
    </div>
  );
}
