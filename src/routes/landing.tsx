import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  ArrowRight,
  Inbox,
  Sparkles,
  PenLine,
  Plug,
  Brain,
  Eye,
  Send,
  Check,
} from "lucide-react";

export const Route = createFileRoute("/landing")({
  head: () => ({
    meta: [
      { title: "ISURA — Your inbox should not require thinking" },
      {
        name: "description",
        content:
          "ISURA is an AI cognitive inbox assistant that turns emails into clear decisions and ready-to-send replies.",
      },
      { property: "og:title", content: "ISURA — Your inbox should not require thinking" },
      {
        property: "og:description",
        content:
          "Turn email overload into clear decisions. ISURA prioritizes, summarizes, and drafts replies — so you can manage attention, not your inbox.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <Problem />
      <Solution />
      <HowItWorks />
      <MagicMoment />
      <ProductPreview />
      <Differentiation />
      <WhyNow />
      <SignUp />
      <Footer />
    </div>
  );
}

/* ----------------------------- Nav ----------------------------- */

function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground">
            <span className="font-display text-sm font-semibold">I</span>
          </span>
          <span className="font-display text-lg tracking-tight">ISURA</span>
        </div>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground sm:flex">
          <a href="#problem" className="hover:text-foreground">Problem</a>
          <a href="#solution" className="hover:text-foreground">Solution</a>
          <a href="#how" className="hover:text-foreground">How it works</a>
          <a href="#preview" className="hover:text-foreground">Preview</a>
        </nav>
        <a
          href="#signup"
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground transition hover:bg-primary/90"
        >
          Get early access
          <ArrowRight className="h-3 w-3" />
        </a>
      </div>
    </header>
  );
}

/* ----------------------------- Hero ----------------------------- */

function Hero() {
  return (
    <section className="border-b border-border/60">
      <div className="mx-auto max-w-4xl px-6 pb-20 pt-24 text-center sm:pt-32">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          AI cognitive inbox assistant
        </div>
        <h1 className="mt-6 font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl">
          Your inbox should not require thinking.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          ISURA is an AI cognitive inbox assistant that turns emails into clear decisions and
          ready-to-send replies.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#signup"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
          >
            Get Early Access
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
          <Link
            to="/"
            className="rounded-md border border-border bg-surface px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-surface-muted"
          >
            View Demo
          </Link>
        </div>
        <p className="mt-5 text-xs text-muted-foreground">
          We are currently onboarding a limited number of users.
        </p>
      </div>
    </section>
  );
}

/* ----------------------------- Problem ----------------------------- */

function Problem() {
  const points = [
    "Too many decisions every day",
    "Constant context switching",
    "No clarity on what matters",
  ];
  return (
    <section id="problem" className="border-b border-border/60">
      <div className="mx-auto max-w-4xl px-6 py-24">
        <h2 className="max-w-3xl font-display text-3xl leading-tight tracking-tight sm:text-4xl">
          Email is not a communication problem.
          <span className="text-muted-foreground"> It is a cognitive overload problem.</span>
        </h2>
        <ul className="mt-10 grid gap-3 sm:grid-cols-3">
          {points.map((p) => (
            <li
              key={p}
              className="rounded-xl border border-border/70 bg-surface px-5 py-5 text-sm text-foreground"
            >
              <span className="block h-1 w-6 rounded-full bg-priority-urgent/70" />
              <span className="mt-3 block font-medium">{p}</span>
            </li>
          ))}
        </ul>
        <p className="mt-12 font-display text-2xl leading-snug text-foreground sm:text-3xl">
          You don't have an email problem.
          <br />
          <span className="text-muted-foreground">You have a thinking problem.</span>
        </p>
      </div>
    </section>
  );
}

/* ----------------------------- Solution ----------------------------- */

function Solution() {
  const features = [
    {
      icon: Inbox,
      title: "Prioritizes what needs attention",
      body: "Every message is scored by cognitive load and urgency, so the inbox surfaces only what truly matters.",
    },
    {
      icon: Sparkles,
      title: "Summarizes every email in one line",
      body: "No more re-reading threads. ISURA compresses each email into a single, scannable sentence.",
    },
    {
      icon: PenLine,
      title: "Generates ready-to-send replies",
      body: "Every email arrives with a complete draft in your tone. Approve, tweak, or send in one click.",
    },
  ];
  return (
    <section id="solution" className="border-b border-border/60 bg-surface/40">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Solution</div>
          <h2 className="mt-3 font-display text-3xl leading-tight tracking-tight sm:text-4xl">
            ISURA gives you instant clarity.
          </h2>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-border/70 bg-surface p-7 transition-colors hover:border-border-strong"
            >
              <span className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-background">
                <f.icon className="h-4 w-4 text-foreground" />
              </span>
              <h3 className="mt-5 font-display text-lg text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- How it works ----------------------------- */

function HowItWorks() {
  const steps = [
    { icon: Plug, title: "Connect your inbox", body: "Secure read access. Setup takes under a minute." },
    { icon: Brain, title: "AI analyzes emails", body: "Intent, urgency, and cognitive load — assessed in seconds." },
    { icon: Eye, title: "You see only what matters", body: "Noise is hidden. The right decisions surface first." },
    { icon: Send, title: "Replies are already prepared", body: "Approve a draft and move on. No blank pages." },
  ];
  return (
    <section id="how" className="border-b border-border/60">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">How it works</div>
          <h2 className="mt-3 font-display text-3xl leading-tight tracking-tight sm:text-4xl">
            From connection to clarity in four steps.
          </h2>
        </div>
        <ol className="mt-12 grid gap-3 md:grid-cols-4">
          {steps.map((s, i) => (
            <li
              key={s.title}
              className="relative rounded-2xl border border-border/70 bg-surface p-6"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-sm tabular-nums text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <s.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <h3 className="mt-6 font-display text-base text-foreground">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ----------------------------- Magic moment ----------------------------- */

function MagicMoment() {
  const before = ["Overwhelmed inbox", "Constant thinking", "No prioritization"];
  const after = ["Clear priorities", "No decision fatigue", "Ready-to-send replies"];
  return (
    <section className="border-b border-border/60 bg-surface/40">
      <div className="mx-auto max-w-5xl px-6 py-24">
        <h2 className="max-w-3xl font-display text-3xl leading-tight tracking-tight sm:text-4xl">
          From inbox chaos to clear decisions.
        </h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border/60 bg-surface-muted/40 p-7">
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Before ISURA
            </div>
            <ul className="mt-5 space-y-3 text-base text-muted-foreground">
              {before.map((b) => (
                <li key={b} className="flex items-center gap-3">
                  <span className="h-1 w-3 rounded-full bg-border-strong" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border/60 bg-background p-7">
            <div className="text-[11px] uppercase tracking-[0.18em] text-foreground">
              After ISURA
            </div>
            <ul className="mt-5 space-y-3 text-base text-foreground">
              {after.map((a) => (
                <li key={a} className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-emerald-500" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Product preview ----------------------------- */

function ProductPreview() {
  return (
    <section id="preview" className="border-b border-border/60">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Preview</div>
          <h2 className="mt-3 font-display text-3xl leading-tight tracking-tight sm:text-4xl">
            ISURA turns emails into decisions, not tasks.
          </h2>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          <MockPriority />
          <MockDecision />
          <MockReply />
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          ISURA turns emails into decisions, not tasks.
        </p>
      </div>
    </section>
  );
}

function MockFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-surface shadow-sm">
      <div className="flex items-center gap-2 border-b border-border/60 px-4 py-2.5">
        <span className="h-2 w-2 rounded-full bg-rose-400/70" />
        <span className="h-2 w-2 rounded-full bg-amber-400/70" />
        <span className="h-2 w-2 rounded-full bg-emerald-400/70" />
        <span className="ml-3 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          {title}
        </span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function MockPriority() {
  const items = [
    { tag: "Urgent", sender: "Sarah Chen", subject: "Contract renewal — needs signature", load: "high" as const },
    { tag: "Normal", sender: "Mehmet Aydın", subject: "Demo talebi — yeni ekibimiz için", load: "medium" as const },
    { tag: "Normal", sender: "Dr. Elena Rossi", subject: "Disagreement on the methodology", load: "high" as const },
  ];
  const loadCls = {
    high: "bg-load-high text-load-high-foreground",
    medium: "bg-load-medium text-load-medium-foreground",
    low: "bg-load-low text-load-low-foreground",
  };
  return (
    <MockFrame title="Priority Review">
      <ol className="space-y-2.5">
        {items.map((it, i) => (
          <li key={i} className="rounded-lg border border-border/60 bg-background px-3 py-2.5">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
              <span
                className={`${
                  it.tag === "Urgent" ? "text-priority-urgent" : "text-priority-normal"
                } font-medium`}
              >
                {it.tag}
              </span>
              <span className={`rounded-full px-2 py-0.5 text-[9px] ${loadCls[it.load]}`}>
                {it.load}
              </span>
              <span className="ml-auto truncate text-muted-foreground">{it.sender}</span>
            </div>
            <div className="mt-1 truncate text-sm font-medium text-foreground">{it.subject}</div>
          </li>
        ))}
      </ol>
    </MockFrame>
  );
}

function MockDecision() {
  return (
    <MockFrame title="Decision panel">
      <div className="space-y-4">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Summary</div>
          <p className="mt-1.5 text-sm leading-relaxed text-foreground">
            Sarah needs your countersignature on the renewed Northwind contract before 6pm tonight.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-border bg-background px-2.5 py-0.5 text-[11px] text-muted-foreground">
            Intent: support
          </span>
          <span className="rounded-full bg-load-high px-2.5 py-0.5 text-[11px] font-medium text-load-high-foreground">
            High load
          </span>
        </div>
        <div className="rounded-lg border border-border/60 bg-background px-3 py-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Recommendation
          </div>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="rounded-full bg-load-high px-2.5 py-0.5 text-[11px] font-semibold text-load-high-foreground">
              Respond
            </span>
            <span className="text-[11px] text-muted-foreground">· Urgency: high</span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Time-sensitive contractual decision that only you can authorize.
          </p>
        </div>
      </div>
    </MockFrame>
  );
}

function MockReply() {
  return (
    <MockFrame title="Reply draft">
      <div className="rounded-lg border border-border/60 bg-background px-3.5 py-3">
        <pre className="whitespace-pre-wrap font-sans text-[13px] leading-relaxed text-foreground">
{`Hi Sarah,

Reviewed and signed — sending the
countersigned PDF back now. Thanks
for flagging the liability change.

Best,`}
        </pre>
        <div className="mt-3 border-t border-border/60 pt-2 text-[10px] text-muted-foreground">
          Drafted by ISURA
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <button className="rounded-md border border-border bg-surface px-2.5 py-1 text-[11px] text-foreground">
          Edit
        </button>
        <button className="ml-auto rounded-md bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground">
          Approve & send
        </button>
      </div>
    </MockFrame>
  );
}

/* ----------------------------- Differentiation ----------------------------- */

function Differentiation() {
  const items = [
    { label: "Not an email client", body: "We don't replace Gmail or Outlook." },
    { label: "Not an automation tool", body: "No rules to build. No workflows to maintain." },
    { label: "Not a chatbot", body: "You don't ask. ISURA already decided." },
  ];
  return (
    <section className="border-b border-border/60 bg-surface/40">
      <div className="mx-auto max-w-5xl px-6 py-24">
        <h2 className="font-display text-3xl leading-tight tracking-tight sm:text-4xl">
          Not another email app.
        </h2>
        <ul className="mt-10 grid gap-4 sm:grid-cols-3">
          {items.map((it) => (
            <li
              key={it.label}
              className="rounded-2xl border border-border/70 bg-surface p-6"
            >
              <div className="font-display text-base text-foreground">{it.label}</div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{it.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-12 max-w-2xl font-display text-2xl leading-snug text-foreground sm:text-3xl">
          ISURA is a cognitive layer for email decision-making.
        </p>
      </div>
    </section>
  );
}

/* ----------------------------- Why now ----------------------------- */

function WhyNow() {
  const points = [
    {
      title: "AI can finally understand context deeply",
      body: "Modern models reason about tone, intent, and stakes — not just keywords.",
    },
    {
      title: "Work overload is increasing globally",
      body: "Knowledge workers face more inbound than any single human can triage.",
    },
    {
      title: "Email is still core work infrastructure",
      body: "Decisions, contracts, and trust still flow through the inbox.",
    },
  ];
  return (
    <section className="border-b border-border/60">
      <div className="mx-auto max-w-5xl px-6 py-24">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Why now</div>
          <h2 className="mt-3 font-display text-3xl leading-tight tracking-tight sm:text-4xl">
            The moment makes ISURA inevitable.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {points.map((p) => (
            <div key={p.title} className="rounded-2xl border border-border/70 bg-surface p-6">
              <h3 className="font-display text-base text-foreground">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Sign up ----------------------------- */

function SignUp() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email.");
      return;
    }
    setSubmitted(true);
    toast.success("You're on the list. We'll be in touch.");
  };

  return (
    <section id="signup" className="border-b border-border/60 bg-surface/40">
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h2 className="font-display text-4xl leading-tight tracking-tight sm:text-5xl">
          Get early access to ISURA
        </h2>
        <p className="mt-4 text-base text-muted-foreground">
          Join the first wave of users who treat their inbox as attention, not work.
        </p>
        {submitted ? (
          <div className="mx-auto mt-8 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-foreground">
            <Check className="h-4 w-4 text-emerald-500" />
            You're on the list.
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="mx-auto mt-8 flex w-full max-w-md flex-col gap-2 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 rounded-md border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-border-strong focus:ring-2 focus:ring-ring/20"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
            >
              Request Access
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>
        )}
        <p className="mt-4 text-xs text-muted-foreground">
          We are currently onboarding a limited number of users.
        </p>
      </div>
    </section>
  );
}

/* ----------------------------- Footer ----------------------------- */

function Footer() {
  return (
    <footer className="px-6 py-16 text-center">
      <p className="mx-auto max-w-2xl font-display text-2xl leading-snug text-foreground sm:text-3xl">
        ISURA doesn't manage your inbox. It manages your attention.
      </p>
      <div className="mt-8 text-xs text-muted-foreground">
        © {new Date().getFullYear()} ISURA
      </div>
    </footer>
  );
}
