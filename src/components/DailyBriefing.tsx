import { useEffect, useState } from "react";
import { Sun, Moon, Sunrise, AlertTriangle, FileSignature, EyeOff, MessageSquare, Clock } from "lucide-react";
import { useLang, t } from "@/lib/i18n";
import type { Assessment } from "@/lib/heuristics";
import type { EmailStatus } from "@/lib/email-store";

type Item = { assessment: Assessment; status: EmailStatus };

function partOfDay(lang: "en" | "tr") {
  const h = new Date().getHours();
  if (h < 5 || h >= 22) return { key: "greet_night", Icon: Moon };
  if (h < 12) return { key: "greet_morning", Icon: Sunrise };
  if (h < 18) return { key: "greet_afternoon", Icon: Sun };
  return { key: "greet_evening", Icon: Moon };
}

export function DailyBriefing({ items }: { items: Item[] }) {
  const { lang } = useLang();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setMounted(true), 30);
    return () => window.clearTimeout(id);
  }, []);

  const active = items.filter((i) => i.status === "active");
  const urgentDecisions = active.filter(
    (i) => i.assessment.category === "decision" && i.assessment.priority === "urgent",
  ).length;
  const risks = active.filter((i) => i.assessment.category === "risk").length;
  const waiting = active.filter((i) => i.assessment.category === "waiting").length;
  const filtered = items.filter(
    (i) =>
      i.assessment.category === "low_value" ||
      i.assessment.category === "safe_ignore" ||
      i.status === "ignored" ||
      i.status === "archived",
  ).length;
  const drafts = items.filter((i) => i.status === "replied").length +
    active.filter((i) => i.assessment.category === "decision").length;

  // Estimated mental load reduced (hours): risks ~12min, urgent ~8min, filtered ~3min, waiting ~4min.
  const minutes = risks * 12 + urgentDecisions * 8 + filtered * 3 + waiting * 4;
  const hours = (minutes / 60).toFixed(1);

  const greet = partOfDay(lang);

  const lines: { key: string; vars?: Record<string, string | number>; Icon: typeof AlertTriangle; tone: string }[] = [];
  if (urgentDecisions > 0)
    lines.push({
      key: "brief_urgent",
      vars: { n: urgentDecisions },
      Icon: AlertTriangle,
      tone: "text-load-high-foreground",
    });
  if (risks > 0)
    lines.push({
      key: "brief_risks",
      vars: { n: risks },
      Icon: FileSignature,
      tone: "text-load-high-foreground",
    });
  if (waiting > 0)
    lines.push({
      key: "brief_waiting",
      vars: { n: waiting },
      Icon: Clock,
      tone: "text-load-medium-foreground",
    });
  if (filtered > 0)
    lines.push({
      key: "brief_filtered",
      vars: { n: filtered },
      Icon: EyeOff,
      tone: "text-muted-foreground",
    });
  if (drafts > 0)
    lines.push({
      key: "brief_drafts",
      vars: { n: drafts },
      Icon: MessageSquare,
      tone: "text-foreground",
    });

  const calmState = urgentDecisions === 0 && risks === 0;

  return (
    <section
      className={`relative overflow-hidden rounded-3xl border border-border/70 bg-surface px-7 py-8 transition-all duration-700 ease-out sm:px-10 sm:py-10 ${
        mounted ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
      }`}
    >
      {/* Soft ambient veil */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0"
        style={{
          background:
            "radial-gradient(900px 320px at 0% -10%, oklch(0.96 0.04 250 / 0.55), transparent 65%), radial-gradient(700px 280px at 100% 0%, oklch(0.96 0.04 130 / 0.4), transparent 65%)",
        }}
      />

      <div className="relative">
        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          <greet.Icon className="h-3.5 w-3.5" />
          {t(lang, "dailyBriefing")}
        </div>

        <h2 className="mt-4 font-display text-3xl leading-[1.15] text-foreground sm:text-[2.4rem]">
          {t(lang, greet.key)}
        </h2>
        <p className="mt-2 max-w-xl text-base leading-relaxed text-muted-foreground">
          {t(lang, "briefing_intro")}
        </p>

        {lines.length > 0 ? (
          <ul className="mt-7 space-y-3">
            {lines.map(({ key, vars, Icon, tone }, i) => (
              <li
                key={key}
                className={`flex items-start gap-3 transition-all duration-500 ease-out ${
                  mounted ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                }`}
                style={{ transitionDelay: `${120 + i * 70}ms` }}
              >
                <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full border border-border/70 bg-background">
                  <Icon className={`h-3.5 w-3.5 ${tone}`} />
                </span>
                <p className="text-[15px] leading-relaxed text-foreground">
                  {t(lang, key, vars)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-7 text-[15px] leading-relaxed text-foreground">
            {t(lang, "brief_clear")}
          </p>
        )}

        {/* Closing line — focus time recovered */}
        <div
          className={`mt-8 flex flex-wrap items-end justify-between gap-4 border-t border-border/60 pt-6 transition-all duration-700 ease-out ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
          }`}
          style={{ transitionDelay: `${120 + lines.length * 70 + 40}ms` }}
        >
          <div>
            <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {t(lang, "brief_load_label")}
            </div>
            <div className="mt-1 font-display text-2xl text-foreground sm:text-3xl">
              {t(lang, "brief_load_value", { h: hours })}
            </div>
          </div>
          <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
            {calmState ? t(lang, "brief_closing_calm") : t(lang, "brief_closing")}
          </p>
        </div>
      </div>
    </section>
  );
}
