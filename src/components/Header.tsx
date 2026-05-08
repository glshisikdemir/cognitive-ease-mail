import { Link } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { useLang, t } from "@/lib/i18n";

type SyncStatus = "online" | "syncing" | "offline";

function useSyncStatus(): SyncStatus {
  const [status, setStatus] = useState<SyncStatus>("online");
  useEffect(() => {
    const update = () => setStatus(navigator.onLine ? "online" : "offline");
    update();
    const onOnline = () => {
      setStatus("syncing");
      window.setTimeout(() => setStatus(navigator.onLine ? "online" : "offline"), 900);
    };
    const onOffline = () => setStatus("offline");
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);
  return status;
}

export function Header() {
  const { lang, setLang } = useLang();
  const status = useSyncStatus();
  const dot =
    status === "online"
      ? "bg-emerald-500"
      : status === "syncing"
      ? "bg-amber-500 animate-pulse"
      : "bg-rose-500";
  const label =
    status === "online"
      ? t(lang, "connected")
      : status === "syncing"
      ? t(lang, "syncing")
      : t(lang, "offline");
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <span className="font-display text-lg leading-none">I</span>
          </div>
          <span className="text-sm font-semibold tracking-tight">{t(lang, "appName")}</span>
        </Link>

        <div className="hidden text-xs text-muted-foreground md:block">
          {t(lang, "appTagline")}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] text-muted-foreground sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {t(lang, "connected")}
          </div>
          <div className="flex items-center gap-1 rounded-full border border-border bg-surface p-0.5 text-xs">
            <button
              onClick={() => setLang("en")}
              className={`rounded-full px-2.5 py-1 transition-colors ${
                lang === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("tr")}
              className={`rounded-full px-2.5 py-1 transition-colors ${
                lang === "tr" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              TR
            </button>
          </div>
          <button
            aria-label={t(lang, "settings")}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition-colors hover:text-foreground"
          >
            <Settings className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
