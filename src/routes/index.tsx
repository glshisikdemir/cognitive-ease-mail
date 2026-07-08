import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowRight,
  ShieldCheck,
  Plug,
  Users,
  Activity,
  Trash2,
  CheckCircle2,
  Mail,
} from "lucide-react";
import { submitWaitlist } from "@/lib/waitlist.functions";
import { fmtMoney } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ISURA — Which of your retainers is cooling right now?" },
      {
        name: "description",
        content:
          "ISURA turns your agency's client email traffic into a per-client relationship graph: see which account is cooling, which revenue is at risk, and get replies drafted in your own voice.",
      },
      { property: "og:title", content: "ISURA — Which of your retainers is cooling right now?" },
      {
        property: "og:description",
        content:
          "A relationship-intelligence layer above your Gmail inbox for retainer agencies.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <Hero />
      <Problem />
      <HowItWorks />
      <Trust />
      <Pricing />
      <FinalCta />
      <Footer />
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-foreground text-background">
            <span className="font-display text-[13px] font-semibold leading-none">I</span>
          </span>
          <span className="text-sm font-semibold tracking-[0.04em]">ISURA</span>
        </Link>
        <nav className="hidden items-center gap-6 text-[13px] text-muted-foreground md:flex">
          <a href="#problem" className="hover:text-foreground">The problem</a>
          <a href="#how" className="hover:text-foreground">How it works</a>
          <a href="#trust" className="hover:text-foreground">Trust</a>
          <a href="#pricing" className="hover:text-foreground">Pricing</a>
        </nav>
        <a
          href="#access"
          className="rounded-lg bg-primary px-3.5 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Request pilot access
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-10 pt-16 sm:pt-24">
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-surface px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-load-high-foreground" />
            Relationship intelligence for retainer agencies
          </span>
          <h1 className="mt-5 font-display text-5xl leading-[1.05] text-foreground sm:text-6xl">
            Which of your retainers is cooling right now?
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            ISURA turns your agency's client email traffic into a per-client relationship graph:
            see which account is cooling, which revenue is at risk, and get replies drafted in your
            own voice.
          </p>
          <div className="mt-7">
            <AccessForm compact />
            <p className="mt-2 text-xs text-muted-foreground">
              For founders & client-services leads of 5–50 person Gmail agencies.
            </p>
          </div>
        </div>

        <PulseMock />
      </div>
    </section>
  );
}

/* Screenshot-style mockup of the Pulse surface */
function PulseMock() {
  const rows = [
    { name: "Meridian Retail", val: "$14,000/mo", reason: "Revision unanswered 4 days · sentiment declining", h: 42, spark: [70, 64, 58, 55, 49, 45, 42] },
    { name: "Bluestone Health", val: "$22,000/mo", reason: "Reply time doubled · 72h email unanswered", h: 51, spark: [78, 72, 68, 62, 58, 54, 51] },
    { name: "Arcadia Travel", val: "$9,500/mo", reason: "14 days silence · reporting deck overdue", h: 57, spark: [72, 68, 66, 63, 61, 59, 57] },
  ];
  return (
    <div className="rounded-2xl border border-border/70 bg-surface p-3 shadow-lg">
      <div className="mb-3 flex items-center gap-1.5 px-1">
        <span className="h-2.5 w-2.5 rounded-full bg-load-high/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-load-medium/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-load-low/60" />
        <span className="ml-2 text-[11px] text-muted-foreground">ISURA · Pulse</span>
      </div>
      <div className="rounded-xl bg-background p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-display text-lg leading-tight text-foreground">
              Good morning — 3 accounts need attention, 11 healthy.
            </div>
          </div>
          <div className="shrink-0 rounded-lg bg-load-high px-3 py-1.5 text-load-high-foreground">
            <div className="text-[9px] uppercase tracking-wide opacity-80">At risk</div>
            <div className="text-sm font-semibold tabular-nums">{fmtMoney(45500)}</div>
          </div>
        </div>
        <div className="mt-3 space-y-2">
          {rows.map((r) => (
            <div key={r.name} className="rounded-lg border border-border/60 bg-surface px-3 py-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-foreground">{r.name}</span>
                <div className="flex items-center gap-2">
                  <MiniSpark data={r.spark} />
                  <span className="rounded-full bg-load-high px-2 py-0.5 text-[11px] font-medium tabular-nums text-load-high-foreground">
                    {r.h}
                  </span>
                </div>
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">{r.reason}</div>
              <div className="mt-2 flex gap-1.5">
                <span className="rounded-md bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">View draft</span>
                <span className="rounded-md border border-border px-2 py-0.5 text-[10px] text-muted-foreground">Assign</span>
                <span className="rounded-md border border-border px-2 py-0.5 text-[10px] text-muted-foreground">Snooze 3d</span>
              </div>
            </div>
          ))}
          <div className="rounded-lg border border-border/60 bg-surface-muted px-3 py-2 text-xs text-muted-foreground">
            11 accounts healthy ✓
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniSpark({ data }: { data: number[] }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = Math.max(1, max - min);
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * 52},${20 - ((v - min) / range) * 16 - 2}`)
    .join(" ");
  return (
    <svg width="52" height="20" viewBox="0 0 52 20" fill="none">
      <polyline points={pts} stroke="var(--color-load-high-foreground)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Problem() {
  return (
    <section id="problem" className="border-t border-border/60 bg-surface-muted/40">
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h2 className="font-display text-4xl leading-tight text-foreground">
          Client churn starts in email, not in a bad meeting.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          By the time an account "suddenly" leaves, the signals were sitting in your inbox for
          weeks — a revision left unanswered, replies getting slower, a promise that quietly slipped.
          Your inbox shows you messages. It never shows you relationships.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { n: "4 days", t: "the average silence before a client feels ignored" },
            { n: "2×", t: "slower client replies is the earliest cooling signal" },
            { n: "1 miss", t: "an unkept commitment erodes trust faster than a bad result" },
          ].map((x) => (
            <div key={x.n} className="rounded-xl border border-border/60 bg-surface px-5 py-6 text-left">
              <div className="font-display text-3xl text-foreground">{x.n}</div>
              <p className="mt-2 text-sm text-muted-foreground">{x.t}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: Plug,
      title: "Connect Gmail",
      body: "One secure OAuth connection to your Google Workspace. Your inbox stays exactly where it is.",
    },
    {
      icon: Users,
      title: "We map your clients",
      body: "ISURA groups traffic by account, learns each client's tone, and builds a living relationship graph.",
    },
    {
      icon: Activity,
      title: "Daily Pulse + Radar + drafts in your voice",
      body: "Every morning: who's cooling, what's at risk, and replies drafted in your voice — ready for one-tap approval.",
    },
  ];
  return (
    <section id="how" className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-center font-display text-4xl text-foreground">How it works</h2>
      <p className="mx-auto mt-3 max-w-xl text-center text-sm text-muted-foreground">
        An intelligence layer above your inbox — not another inbox to check.
      </p>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {steps.map((s, i) => (
          <div key={s.title} className="rounded-2xl border border-border/70 bg-surface px-6 py-7">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-surface-muted text-foreground">
                <s.icon className="h-4.5 w-4.5" />
              </span>
              <span className="font-display text-lg text-muted-foreground">0{i + 1}</span>
            </div>
            <h3 className="mt-4 font-display text-xl text-foreground">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Trust() {
  const items = [
    { icon: ShieldCheck, t: "Approval-first", b: "Nothing is ever sent without your explicit tap. ISURA drafts; you decide." },
    { icon: Trash2, t: "30-day body deletion", b: "Email bodies are automatically deleted after 30 days. We keep signals, not your mail." },
    { icon: CheckCircle2, t: "Revoke anytime", b: "One button disconnects Gmail and deletes your data. No lock-in, no dark patterns." },
  ];
  return (
    <section id="trust" className="border-y border-border/60 bg-surface-muted/40">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center font-display text-4xl text-foreground">Built to be trusted</h2>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {items.map((x) => (
            <div key={x.t} className="rounded-2xl border border-border/70 bg-surface px-6 py-7">
              <x.icon className="h-5 w-5 text-foreground" />
              <h3 className="mt-4 font-display text-xl text-foreground">{x.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{x.b}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-3xl px-6 py-20 text-center">
      <h2 className="font-display text-4xl text-foreground">Pricing</h2>
      <div className="mt-8 rounded-2xl border border-border/70 bg-surface px-8 py-10">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-surface-muted px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          By invitation
        </div>
        <div className="mt-5 font-display text-5xl text-foreground">Pilot</div>
        <p className="mt-3 text-sm text-muted-foreground">
          Currently invitation-only while we onboard a small set of agencies.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">$79/seat</span> after the pilot.
        </p>
        <div className="mt-7">
          <a
            href="#access"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Request pilot access
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section id="access" className="border-t border-border/60 bg-surface-muted/40">
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h2 className="font-display text-4xl leading-tight text-foreground">
          See which retainer is cooling — before it cancels.
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Request pilot access and we'll be in touch.
        </p>
        <div className="mx-auto mt-7 max-w-md">
          <AccessForm />
        </div>
      </div>
    </section>
  );
}

function AccessForm({ compact }: { compact?: boolean }) {
  const submit = useServerFn(submitWaitlist);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setState("loading");
    try {
      const res = await submit({ data: { email, language: "en", source: "landing" } });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-load-low/60 bg-load-low px-4 py-3 text-sm text-load-low-foreground">
        <CheckCircle2 className="h-4 w-4" />
        You're on the list — we'll reach out about pilot access.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={`flex flex-col gap-2 ${compact ? "sm:flex-row" : ""}`}>
      <div className="relative flex-1">
        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@youragency.com"
          className="w-full rounded-lg border border-border bg-surface py-2.5 pl-9 pr-3 text-sm text-foreground outline-none ring-primary/20 transition focus:border-border-strong focus:ring-2"
        />
      </div>
      <button
        type="submit"
        disabled={state === "loading"}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
      >
        {state === "loading" ? "Requesting…" : "Request pilot access"}
      </button>
      {state === "error" && (
        <p className="text-xs text-load-high-foreground">Something went wrong — try again.</p>
      )}
    </form>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded bg-foreground text-background">
            <span className="font-display text-[11px] leading-none">I</span>
          </span>
          <span>ISURA · Relationship intelligence for agencies</span>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
          <Link to="/terms" className="hover:text-foreground">Terms</Link>
          <Link to="/security" className="hover:text-foreground">Security</Link>
          <Link to="/pulse" className="hover:text-foreground">Open app</Link>
        </div>
      </div>
    </footer>
  );
}
