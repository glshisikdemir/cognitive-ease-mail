import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Archive as ArchiveIcon,
  EyeOff,
  RotateCcw,
  ChevronDown,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { useLang, t } from "@/lib/i18n";
import { CategoryBadge, ConfidenceTag, ReasonList } from "@/components/LoadBadge";
import type { Email } from "@/lib/emails";
import type { Assessment } from "@/lib/heuristics";
import type { EmailStatus } from "@/lib/email-store";

export type SectionKey =
  | "decision"
  | "risk"
  | "waiting"
  | "followup"
  | "review"
  | "low"
  | "resolved";

export type WorkspaceItem = {
  email: Email;
  assessment: Assessment;
  status: EmailStatus;
};

function aiSummary(body: string, preview: string) {
  const first = body.split("\n").map((l) => l.trim()).find((l) => l.length > 20) ?? preview;
  return first.length > 140 ? first.slice(0, 140).trimEnd() + "…" : first;
}

function suggestedActionKey(item: WorkspaceItem, section: SectionKey): string {
  if (section === "review") return "sugg_approve_draft";
  if (section === "followup") return "sugg_send_nudge";
  if (section === "risk") return "sugg_review_risk";
  if (section === "decision") return "sugg_decide_today";
  if (section === "waiting") return "sugg_send_nudge";
  if (section === "low") return "sugg_let_quiet";
  return "sugg_archive";
}

function urgencyKey(item: WorkspaceItem, section: SectionKey): string {
  if (section === "review") return "urg_drafted";
  if (section === "followup") return "urg_overdue";
  if (item.assessment.priority === "urgent") return "urg_today";
  if (section === "risk") return "urg_consequence";
  return "urg_routine";
}

const sectionMeta: Record<
  SectionKey,
  { Icon: typeof Sparkles; tone: string; defaultOpen: boolean }
> = {
  risk:     { Icon: AlertTriangle, tone: "text-load-high-foreground", defaultOpen: true },
  decision: { Icon: Sparkles,      tone: "text-load-high-foreground", defaultOpen: true },
  followup: { Icon: ArrowRight,    tone: "text-load-medium-foreground", defaultOpen: true },
  waiting:  { Icon: ArrowRight,    tone: "text-load-medium-foreground", defaultOpen: true },
  review:   { Icon: Sparkles,      tone: "text-foreground",            defaultOpen: true },
  low:      { Icon: EyeOff,        tone: "text-muted-foreground",      defaultOpen: false },
  resolved: { Icon: ArchiveIcon,   tone: "text-muted-foreground",      defaultOpen: false },
};

const sectionTitleKey: Record<SectionKey, string> = {
  decision: "sec_decision",
  risk: "sec_risk",
  waiting: "sec_waiting",
  followup: "sec_followup",
  review: "sec_review",
  low: "sec_low",
  resolved: "sec_resolved",
};
const sectionSubKey: Record<SectionKey, string> = {
  decision: "sec_decision_sub",
  risk: "sec_risk_sub",
  waiting: "sec_waiting_sub",
  followup: "sec_followup_sub",
  review: "sec_review_sub",
  low: "sec_low_sub",
  resolved: "sec_resolved_sub",
};
const sectionEmptyTitleKey: Record<SectionKey, string> = {
  decision: "emptyDecisionTitle",
  risk: "emptyRiskTitle",
  waiting: "emptyWaitingTitle",
  followup: "emptyFollowupTitle",
  review: "emptyReviewTitle",
  low: "emptyLowTitle",
  resolved: "emptyResolvedTitle",
};
const sectionEmptyBodyKey: Record<SectionKey, string> = {
  decision: "emptyDecisionBody",
  risk: "emptyRiskBody",
  waiting: "emptyWaitingBody",
  followup: "emptyFollowupBody",
  review: "emptyReviewBody",
  low: "emptyLowBody",
  resolved: "emptyResolvedBody",
};

export function OperationalSection({
  section,
  items,
  onArchive,
  onIgnore,
  onRestore,
}: {
  section: SectionKey;
  items: WorkspaceItem[];
  onArchive: (id: string) => void;
  onIgnore: (id: string) => void;
  onRestore: (id: string) => void;
}) {
  const { lang } = useLang();
  const meta = sectionMeta[section];
  const [open, setOpen] = useState(meta.defaultOpen);

  return (
    <section className="overflow-hidden rounded-2xl border border-border/70 bg-surface">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-6 py-4 text-left transition-colors hover:bg-surface-muted/40"
      >
        <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full border border-border/70 bg-background">
          <meta.Icon className={`h-3.5 w-3.5 ${meta.tone}`} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-lg text-foreground">{t(lang, sectionTitleKey[section])}</h2>
            <span className="rounded-full bg-muted/70 px-2 py-0.5 text-[10px] tabular-nums text-muted-foreground">
              {items.length}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">{t(lang, sectionSubKey[section])}</p>
        </div>
        <ChevronDown
          className={`h-4 w-4 flex-none text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="border-t border-border/60">
          {items.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-background">
                <meta.Icon className={`h-3.5 w-3.5 ${meta.tone}`} />
              </div>
              <p className="mt-4 font-display text-base text-foreground">
                {t(lang, sectionEmptyTitleKey[section])}
              </p>
              <p className="mx-auto mt-1.5 max-w-sm text-xs leading-relaxed text-muted-foreground">
                {t(lang, sectionEmptyBodyKey[section])}
              </p>
            </div>
          ) : (
            <ul>
              {items.map((item) => (
                <OperationalCard
                  key={item.email.id}
                  item={item}
                  section={section}
                  onArchive={onArchive}
                  onIgnore={onIgnore}
                  onRestore={onRestore}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}

function OperationalCard({
  item,
  section,
  onArchive,
  onIgnore,
  onRestore,
}: {
  item: WorkspaceItem;
  section: SectionKey;
  onArchive: (id: string) => void;
  onIgnore: (id: string) => void;
  onRestore: (id: string) => void;
}) {
  const { lang } = useLang();
  const { email, assessment, status } = item;
  const isResolved = status !== "active";

  return (
    <li className="border-b border-border/60 px-6 py-5 last:border-b-0">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-accent text-sm font-medium text-accent-foreground">
          {email.sender[0]}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="truncate font-medium text-foreground">{email.sender}</span>
            <CategoryBadge category={assessment.category} />
            <ConfidenceTag confidence={assessment.confidence} />
            {isResolved && (
              <span className="rounded-full border border-border bg-background px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                {t(
                  lang,
                  status === "replied" ? "replied" : status === "archived" ? "archived" : "ignored",
                )}
              </span>
            )}
          </div>

          <Link
            to="/email/$id"
            params={{ id: email.id }}
            className="mt-1 block truncate text-sm font-medium text-foreground hover:underline"
          >
            {email.subject}
          </Link>

          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {aiSummary(email.body, email.preview)}
          </p>

          {/* Operational reasoning panel — only for active, non-low sections */}
          {!isResolved && section !== "low" && assessment.reasons.length > 0 && (
            <div className="mt-3 grid gap-3 rounded-lg border border-border/70 bg-background/60 px-3 py-3 sm:grid-cols-2">
              <div>
                <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  {t(lang, "whyThisMatters")}
                </div>
                <ReasonList reasons={assessment.reasons.slice(0, 2)} />
              </div>
              <div className="space-y-2">
                <div>
                  <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    {t(lang, "urg_label")}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-foreground/85">
                    {t(lang, urgencyKey(item, section))}
                  </p>
                </div>
                <div>
                  <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    {t(lang, "sugg_label")}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-foreground/85">
                    {t(lang, suggestedActionKey(item, section))}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Link
              to="/email/$id"
              params={{ id: email.id }}
              className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            >
              {t(lang, "view")}
            </Link>
            {!isResolved ? (
              <>
                <button
                  onClick={() => onArchive(email.id)}
                  className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground hover:bg-surface-muted"
                >
                  <ArchiveIcon className="h-3 w-3" />
                  {t(lang, "archive")}
                </button>
                <button
                  onClick={() => onIgnore(email.id)}
                  className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  <EyeOff className="h-3 w-3" />
                  {t(lang, "ignore")}
                </button>
              </>
            ) : (
              <button
                onClick={() => onRestore(email.id)}
                className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground hover:bg-surface-muted"
              >
                <RotateCcw className="h-3 w-3" />
                {t(lang, "restore")}
              </button>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
