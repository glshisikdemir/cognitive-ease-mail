import { Link } from "@tanstack/react-router";
import { FlaskConical } from "lucide-react";
import { useLang, t } from "@/lib/i18n";

export function ProductFooter() {
  const { lang } = useLang();

  const sections = [
    {
      heading: t(lang, "footerProduct"),
      links: [
        { to: "/app" as const, label: t(lang, "footerLinkWorkspace") },
        { to: "/priority" as const, label: t(lang, "footerLinkPriority") },
        { to: "/" as const, label: t(lang, "footerLinkLanding") },
      ],
    },
    {
      heading: t(lang, "footerCompany"),
      links: [
        { to: "/" as const, label: t(lang, "footerLinkPhilosophy"), hash: "why" },
        { to: "/" as const, label: t(lang, "footerLinkContact"), hash: "access" },
        { to: "/pilot-status" as const, label: t(lang, "footerLinkPilot") },
      ],
    },
    {
      heading: t(lang, "footerLegal"),
      links: [
        { to: "/privacy" as const, label: t(lang, "footerLinkPrivacy") },
        { to: "/terms" as const, label: t(lang, "footerLinkTerms") },
        { to: "/cookies" as const, label: t(lang, "footerLinkCookies") },
        { to: "/security" as const, label: t(lang, "footerLinkSecurity") },
        { to: "/ai-transparency" as const, label: t(lang, "footerLinkAI") },
        { to: "/trust" as const, label: t(lang, "footerLinkTrust") },
      ],
    },
  ];

  return (
    <footer className="mt-16 border-t border-border/60 bg-surface/40">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link to="/" className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="grid h-7 w-7 place-items-center rounded-md bg-foreground text-background ring-1 ring-foreground/10"
              >
                <span className="font-display text-[13px] font-semibold leading-none tracking-tight">
                  I
                </span>
              </span>
              <span className="text-sm font-semibold tracking-[0.04em] text-foreground">
                ISURA
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-muted-foreground">
              {t(lang, "footerTagline")}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background px-2.5 py-1 text-[11px] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {t(lang, "footerStatus")}
              </span>
              <Link
                to="/pilot-status"
                className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background px-2.5 py-1 text-[11px] text-muted-foreground transition hover:text-foreground"
              >
                <FlaskConical className="h-3 w-3" />
                {t(lang, "pilotBadge")}
              </Link>
            </div>

            <p className="mt-4 max-w-xs text-[12px] leading-relaxed text-muted-foreground">
              {t(lang, "footerPilotLine")}
            </p>
          </div>

          <div className="grid gap-8 md:col-span-7 md:grid-cols-3">
            {sections.map((section) => (
              <div key={section.heading}>
                <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  {section.heading}
                </div>
                <ul className="mt-4 space-y-2.5">
                  {section.links.map((link, i) => (
                    <li key={`${link.label}-${i}`}>
                      <Link
                        to={link.to}
                        hash={"hash" in link ? (link.hash as string) : undefined}
                        className="text-[13px] text-foreground/80 transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-6 text-[11px] text-muted-foreground">
          <p>{t(lang, "footerCopy")}</p>
          <p className="tracking-[0.16em] uppercase">EN · TR</p>
        </div>
      </div>
    </footer>
  );
}
