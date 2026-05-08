import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { emails as allEmails } from "@/lib/emails";
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
  const navigate = useNavigate();
  const [ignored, setIgnored] = useState<Set<string>>(new Set());
  const visible = allEmails.filter((e) => !ignored.has(e.id));

  return (
    <section className="overflow-hidden rounded-2xl border border-border/70 bg-surface">
      <div className="flex items-center justify-between border-b border-border/70 px-6 py-4">
        <h2 className="font-display text-xl text-foreground">{t(lang, "emailListTitle")}</h2>
        <span className="text-xs text-muted-foreground">{visible.length}</span>
      </div>
      <ul>
        {visible.map((email) => {
          const { load, priority } = quickAssess(email);
          const summary = email.preview;
          return (
            <li key={email.id} className="border-b border-border/60 last:border-b-0">
              <div className="group block px-6 py-4 transition-colors hover:bg-surface-muted/60">
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
                    <Link
                      to="/email/$id"
                      params={{ id: email.id }}
                      className="mt-0.5 block truncate text-sm font-medium text-foreground hover:underline"
                    >
                      {email.subject}
                    </Link>
                    <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{summary}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <LoadBadge load={load} />
                      <div className="ml-auto flex items-center gap-1">
                        <button
                          onClick={() => navigate({ to: "/email/$id", params: { id: email.id } })}
                          className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs text-foreground transition-colors hover:bg-surface-muted"
                        >
                          {t(lang, "view")}
                        </button>
                        <button
                          onClick={() => navigate({ to: "/email/$id", params: { id: email.id } })}
                          className="rounded-md bg-primary px-2.5 py-1 text-xs text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                          {t(lang, "reply")}
                        </button>
                        <button
                          onClick={() => setIgnored((s) => new Set(s).add(email.id))}
                          className="rounded-md px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {t(lang, "ignore")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
