import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — ISURA" },
      {
        name: "description",
        content: "Choose when ISURA briefs you and keep control of every outgoing reply.",
      },
      { property: "og:title", content: "Settings — ISURA" },
      {
        property: "og:description",
        content: "Choose when ISURA briefs you and keep control of every outgoing reply.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SettingsPage,
});

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="min-w-0">
        <div className="text-sm font-medium text-foreground">{label}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-primary" : "bg-border-strong"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-background transition-transform ${
            checked ? "translate-x-[22px]" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

function SettingsPage() {
  const [briefing, setBriefing] = useState(true);
  const [approvalFirst, setApprovalFirst] = useState(true);
  const [weekendPause, setWeekendPause] = useState(false);
  const [briefTime, setBriefTime] = useState("08:00");

  const save = () => toast.success("Settings saved");

  return (
    <AppShell>
      <header>
        <h1 className="font-display text-3xl leading-tight text-foreground sm:text-4xl">Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose when ISURA reaches you. Everything else works out of the box.
        </p>
      </header>

      <div className="mt-6 max-w-2xl space-y-5">
        {/* Morning briefing */}
        <section className="rounded-2xl border border-border/70 bg-surface p-5">
          <h2 className="font-display text-lg text-foreground">Morning briefing</h2>
          <div className="mt-1 divide-y divide-border/50">
            <Toggle
              label="Daily briefing"
              description="A 90-second summary of who needs attention, every morning."
              checked={briefing}
              onChange={setBriefing}
            />
            <div className="flex items-center justify-between gap-4 py-3">
              <div>
                <div className="text-sm font-medium text-foreground">Delivery time</div>
                <div className="text-xs text-muted-foreground">When your briefing lands.</div>
              </div>
              <input
                type="time"
                value={briefTime}
                onChange={(e) => setBriefTime(e.target.value)}
                className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-foreground outline-none focus:border-border-strong"
              />
            </div>
            <Toggle
              label="Pause on weekends"
              description="Skip Saturday and Sunday briefings."
              checked={weekendPause}
              onChange={setWeekendPause}
            />
          </div>
        </section>

        {/* Approval */}
        <section className="rounded-2xl border border-border/70 bg-surface p-5">
          <h2 className="font-display text-lg text-foreground">Approvals</h2>
          <div className="mt-1 divide-y divide-border/50">
            <Toggle
               label="Always review before sending"
               description="Every reply waits for you before it leaves ISURA."
              checked={approvalFirst}
              onChange={(v) => {
                if (!v) {
                   toast("Review before sending stays on to keep you in control.");
                  return;
                }
                setApprovalFirst(v);
              }}
            />
          </div>
          <p className="mt-3 flex items-center gap-1.5 rounded-lg bg-surface-muted px-3 py-2 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" />
            ISURA prepares drafts but never sends without your approval.
          </p>
        </section>

        <div className="flex justify-end">
          <button
            onClick={save}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Save changes
          </button>
        </div>
      </div>
    </AppShell>
  );
}
