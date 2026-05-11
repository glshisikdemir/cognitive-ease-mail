import { type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { ProductFooter } from "@/components/ProductFooter";
import { PilotNotice } from "@/components/PilotNotice";
import { useLang, t, type Lang } from "@/lib/i18n";

export type LegalSection = {
  id?: string;
  title: { en: string; tr: string };
  body: { en: ReactNode; tr: ReactNode };
};

export function LegalPage({
  eyebrowKey,
  titleKey,
  subtitleKey,
  effective,
  sections,
  showPilot = true,
}: {
  eyebrowKey: string;
  titleKey: string;
  subtitleKey: string;
  effective: { en: string; tr: string };
  sections: LegalSection[];
  showPilot?: boolean;
}) {
  const { lang } = useLang();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t(lang, "back")}
        </Link>

        <header className="mt-6">
          <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {t(lang, eyebrowKey)}
          </div>
          <h1 className="mt-3 font-display text-4xl leading-[1.1] text-foreground sm:text-5xl">
            {t(lang, titleKey)}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {t(lang, subtitleKey)}
          </p>
          <p className="mt-4 text-[12px] text-muted-foreground">
            {t(lang, "legalEffective")}: {effective[lang]}
          </p>
        </header>

        {showPilot && (
          <div className="mt-8">
            <PilotNotice variant="banner" />
          </div>
        )}

        <article className="mt-10 space-y-8">
          {sections.map((s, i) => (
            <section
              key={s.id ?? i}
              id={s.id}
              className="rounded-2xl border border-border/70 bg-surface px-7 py-6"
            >
              <div className="flex items-baseline gap-3">
                <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="font-display text-xl text-foreground">
                  {s.title[lang]}
                </h2>
              </div>
              <div className="prose prose-sm mt-3 max-w-none text-[15px] leading-relaxed text-muted-foreground">
                {s.body[lang]}
              </div>
            </section>
          ))}
        </article>

        <section className="mt-10 rounded-2xl border border-border/70 bg-surface px-7 py-6 text-center">
          <h2 className="font-display text-xl text-foreground">
            {t(lang, "legalContactTitle")}
          </h2>
          <p className="mt-2 text-[14px] text-muted-foreground">
            {t(lang, "legalContactBody")}
          </p>
          <a
            href="mailto:privacy@isura.tech"
            className="mt-3 inline-block text-[14px] font-medium text-foreground underline-offset-4 hover:underline"
          >
            privacy@isura.tech
          </a>
        </section>
      </main>
      <ProductFooter />
    </div>
  );
}

export function makeLegalRoute(path: string, head: { title: string; description: string }, render: () => ReactNode) {
  return createFileRoute(path as never)({
    head: () => ({
      meta: [
        { title: `${head.title} — ISURA` },
        { name: "description", content: head.description },
        { property: "og:title", content: `${head.title} — ISURA` },
        { property: "og:description", content: head.description },
      ],
    }),
    component: render,
  });
}

// Re-export to avoid duplicate Lang imports in route files
export type { Lang };
