import { Link, useLocation } from "@tanstack/react-router";
import { Settings, ShieldCheck } from "lucide-react";
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

function Wordmark() {
  return (
    <Link to="/app" className="flex items-center gap-2.5">
      <span
        aria-hidden
        className="grid h-7 w-7 place-items-center rounded-md bg-foreground text-background ring-1 ring-foreground/10"
      >
        <span className="font-display text-[13px] font-semibold leading-none tracking-tight">I</span>
      </span>
      <span className="flex items-baseline gap-1.5">
        <span className="text-sm font-semibold tracking-[0.04em] text-foreground">ISURA</span>
        <span className="hidden text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:inline">
          Operational cognition
        </span>
      </span>
    </Link>
  );
}

export function Header() {
  const { lang, setLang } = useLang();
  const status = useSyncStatus();
  const location = useLocation();

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

  const nav: { to: "/app" | "/priority" | "/briefing" | "/trust"; key: string }[] = [
    { to: "/app", key: "navWorkspace" },
    { to: "/priority", key: "navPriority" },
    { to: "/briefing", key: "navBriefing" },
    { to: "/trust", key: "navTrust" },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-7">
          <Wordmark />
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => {
              const active =
                item.to === "/app"
                  ? location.pathname === "/app" || location.pathname.startsWith("/email")
                  : location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative rounded-md px-2.5 py-1.5 text-[13px] transition-colors ${
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t(lang, item.key)}
                  {active && (
                    <span
                      aria-hidden
                      className="absolute inset-x-2.5 -bottom-[15px] h-px bg-foreground"
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="hidden items-center gap-1.5 rounded-full border border-border/70 bg-surface px-2.5 py-1 text-[11px] text-muted-foreground sm:inline-flex"
            title={label}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
            {label}
          </div>
          <div className="flex items-center gap-0.5 rounded-full border border-border/70 bg-surface p-0.5 text-[11px]">
            <button
              onClick={() => setLang("en")}
              className={`rounded-full px-2 py-0.5 transition-colors ${
                lang === "en"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("tr")}
              className={`rounded-full px-2 py-0.5 transition-colors ${
                lang === "tr"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              TR
            </button>
          </div>
          <Link
            to="/trust"
            title={t(lang, "trustPage")}
            aria-label={t(lang, "trustPage")}
            className="hidden h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-surface text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
          </Link>
          <button
            aria-label={t(lang, "settings")}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-surface text-muted-foreground transition-colors hover:text-foreground"
          >
            <Settings className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
