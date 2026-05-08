import { Link } from "@tanstack/react-router";
import { useLang, t } from "@/lib/i18n";

export function Header() {
  const { lang, setLang } = useLang();
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <span className="font-display text-lg leading-none">I</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold tracking-tight">{t(lang, "appName")}</span>
            <span className="hidden text-xs text-muted-foreground sm:inline">
              {t(lang, "appTagline")}
            </span>
          </div>
        </Link>
        <div className="flex items-center gap-1 rounded-full border border-border bg-surface p-0.5 text-xs">
          <button
            onClick={() => setLang("en")}
            className={`rounded-full px-3 py-1 transition-colors ${
              lang === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLang("tr")}
            className={`rounded-full px-3 py-1 transition-colors ${
              lang === "tr" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            TR
          </button>
        </div>
      </div>
    </header>
  );
}
