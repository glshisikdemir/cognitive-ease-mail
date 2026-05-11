import { Link } from "@tanstack/react-router";
import { FlaskConical } from "lucide-react";
import { useLang, t } from "@/lib/i18n";

type Variant = "inline" | "banner" | "compact";

export function PilotNotice({
  variant = "inline",
  withLink = true,
}: {
  variant?: Variant;
  withLink?: boolean;
}) {
  const { lang } = useLang();
  const message = t(lang, "pilotNoticeBody");

  if (variant === "compact") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-surface px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        <FlaskConical className="h-3 w-3" />
        {t(lang, "pilotBadge")}
      </span>
    );
  }

  if (variant === "banner") {
    return (
      <div className="rounded-2xl border border-border/70 bg-surface/60 px-5 py-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 grid h-7 w-7 flex-none place-items-center rounded-full border border-border bg-background">
            <FlaskConical className="h-3.5 w-3.5 text-foreground/70" />
          </span>
          <div className="min-w-0">
            <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {t(lang, "pilotBadge")}
            </div>
            <p className="mt-1 text-[13px] leading-relaxed text-foreground/85">{message}</p>
            {withLink && (
              <Link
                to="/pilot-status"
                className="mt-2 inline-flex text-[12px] font-medium text-foreground/70 underline-offset-4 hover:text-foreground hover:underline"
              >
                {t(lang, "pilotLearnMore")}
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface px-3 py-1 text-[11px] text-muted-foreground">
      <FlaskConical className="h-3 w-3" />
      <span>{message}</span>
    </div>
  );
}
