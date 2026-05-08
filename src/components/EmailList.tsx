import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { emails as allEmails } from "@/lib/emails";
import { quickAssess } from "@/lib/heuristics";
import { LoadBadge, PriorityTag } from "./LoadBadge";
import { useLang, t } from "@/lib/i18n";
import { archiveEmails, unarchive, useArchived } from "@/lib/archive";
import type { DashboardView } from "./DashboardSections";

function timeAgo(iso: string, lang: "en" | "tr") {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return lang === "tr" ? "az önce" : "just now";
  if (h < 24) return lang === "tr" ? `${h} sa önce` : `${h}h ago`;
  const d = Math.floor(h / 24);
  return lang === "tr" ? `${d} gün önce` : `${d}d ago`;
}

const viewTitleKey: Record<DashboardView, "viewAll" | "viewPriority" | "viewReplies" | "viewLow"> = {
  all: "viewAll",
  priority: "viewPriority",
  replies: "viewReplies",
  low: "viewLow",
};

export function EmailList({ view = "all" }: { view?: DashboardView }) {
  const { lang } = useLang();
  const navigate = useNavigate();
  const archived = useArchived();

  const assessed = allEmails.map((e) => ({ email: e, ...quickAssess(e) }));

  const filtered = assessed.filter(({ email, load, priority }) => {
    const isArchived = archived.has(email.id);
    const isLow = priority === "ignore" || load === "low";
    if (view === "low") return isLow; // include archived so user can restore
    if (isArchived) return false;
    if (view === "priority") return priority === "urgent" || load === "high";
    if (view === "replies") return priority !== "ignore";
    return true;
  });

  const lowVisibleIds = filtered
    .filter(({ email, load, priority }) => (priority === "ignore" || load === "low") && !archived.has(email.id))
    .map(({ email }) => email.id);

  return (
    <section id="emails" className="overflow-hidden rounded-2xl border border-border/70 bg-surface scroll-mt-20">
      <div className="flex flex-wrap items-center gap-3 border-b border-border/70 px-6 py-4">
        <h2 className="font-display text-xl text-foreground">{t(lang, viewTitleKey[view])}</h2>
        <span className="text-xs text-muted-foreground">{filtered.length}</span>
        <div className="ml-auto flex items-center gap-1 rounded-full border border-border bg-surface p-0.5 text-xs">
          {(["all", "priority", "replies", "low"] as DashboardView[]).map((v) => (
            <Link
              key={v}
              to="/"
              search={{ view: v }}
              hash="emails"
              className={`rounded-full px-2.5 py-1 transition-colors ${
                view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t(lang, `tab_${v}` as "tab_all")}
            </Link>
          ))}
        </div>
        {view === "low" && lowVisibleIds.length > 0 && (
          <button
            onClick={() => archiveEmails(lowVisibleIds)}
            className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t(lang, "archiveAll")}
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="px-6 py-16 text-center text-sm text-muted-foreground">
          {t(lang, "emptyView")}
        </div>
      ) : (
        <ul>
          {filtered.map(({ email, load, priority }) => {
            const isArchived = archived.has(email.id);
            return (
              <li key={email.id} className="border-b border-border/60 last:border-b-0">
                <div
                  className={`group block px-6 py-4 transition-colors hover:bg-surface-muted/60 ${
                    isArchived ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-accent text-sm font-medium text-accent-foreground">
                      {email.sender[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="truncate text-sm font-medium text-foreground">{email.sender}</span>
                        <PriorityTag priority={priority} />
                        {isArchived && (
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            {t(lang, "archived")}
                          </span>
                        )}
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
                      <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{email.preview}</p>
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
                          {isArchived ? (
                            <button
                              onClick={() => unarchive(email.id)}
                              className="rounded-md px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                            >
                              {t(lang, "restore")}
                            </button>
                          ) : (
                            <button
                              onClick={() => archiveEmails([email.id])}
                              className="rounded-md px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                            >
                              {t(lang, "ignore")}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
