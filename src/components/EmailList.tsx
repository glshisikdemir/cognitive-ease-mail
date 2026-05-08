import { Link } from "@tanstack/react-router";
import { emails } from "@/lib/emails";
import { quickAssess } from "@/lib/heuristics";
import { LoadBadge, PriorityTag } from "./LoadBadge";
import { useLang, t } from "@/lib/i18n";

function timeAgo(iso: string, lang: "en" | "tr") {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return lang === "tr" ? "az önce" : "just now";
  if (h < 24) return lang === "tr" ? `${h} sa önce` : `${h}h ago`;
  const d = Math.floor(h / 24);
  return lang === "tr" ? `${d} gün önce` : `${d}d ago`;
}

export function EmailList() {
  const { lang } = useLang();
  return (
    <section className="overflow-hidden rounded-2xl border border-border/70 bg-surface">
      <div className="flex items-center justify-between border-b border-border/70 px-6 py-3">
        <h2 className="text-sm font-semibold tracking-tight">{t(lang, "inbox")}</h2>
        <span className="text-xs text-muted-foreground">{emails.length}</span>
      </div>
      <ul>
        {emails.map((email) => {
          const { load, priority } = quickAssess(email);
          return (
            <li key={email.id} className="border-b border-border/60 last:border-b-0">
              <Link
                to="/email/$id"
                params={{ id: email.id }}
                className="group block px-6 py-4 transition-colors hover:bg-surface-muted"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-accent text-sm font-medium text-accent-foreground">
                    {email.sender[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="truncate text-sm font-medium text-foreground">{email.sender}</span>
                      <PriorityTag priority={priority} />
                      <span className="ml-auto flex-none text-xs text-muted-foreground">
                        {timeAgo(email.receivedAt, lang)}
                      </span>
                    </div>
                    <div className="mt-0.5 truncate text-sm text-foreground">{email.subject}</div>
                    <div className="mt-1 truncate text-xs text-muted-foreground">{email.preview}</div>
                  </div>
                  <div className="flex-none pt-1">
                    <LoadBadge load={load} />
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
