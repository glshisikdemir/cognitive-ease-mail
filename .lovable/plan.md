# ISURA — Voice-First AI Operating Layer

You've described a complete AI Decision Infrastructure. It cannot be built in one turn as production-ready code — but it can be built correctly as a sequence of real, working slices on the foundation that already exists (Decision Guardian, Permission Center, voice assistant, briefing, channels, email). This plan turns the vision into a concrete build order.

## What already exists (reuse, don't rebuild)
- **Decision Guardian** + Autonomy Levels (`/guardian`, `/permissions`) — the mandatory approval gate. This IS your Permissions Manager + Human Approval layer.
- **Voice assistant** (`/assistant`) — STT/TTS, natural commands, inbox read/reply/compose with voice approval.
- **Voice briefing** (`/briefing`) — podcast-style playback + voice commands.
- **Channels** (`/channels`) — Slack/Telegram/WhatsApp/Email connection wizards + test sends.
- **AI Gateway** wired (`ai-gateway.ts`), ElevenLabs TTS, structured output working.

## The core architectural decision
Everything below hangs off **one new concept: the Objective**. A user speaks an objective → the **Planner** decomposes it into a task graph → **specialized agents** execute tasks → each impactful task routes through the **Guardian** for approval → results write to **memory** and the **decision graph**. This is the "AI Operating Layer" spine.

## Build order (each slice is shippable on its own)

### Slice 2 — Objective & Planner engine (the spine)
- DB: `objectives`, `tasks` (task graph: type, status, depends_on, agent, payload, result), `agent_runs` (audit).
- Server fn `planObjective`: AI decomposes a spoken objective into an ordered task list (research → find → enrich → score → segment → message → approve → send → track → learn), stored as `tasks`.
- `/objectives` route: speak or type an objective, watch the plan generate, see the task graph with live status. Voice-first, minimal UI.
- Guardian integration: any task flagged high-impact creates a `decision` (pending) automatically.

### Slice 3 — Agent engine + Tool Router
- Modular `Agent` interface (Research / Sales / Email / Calendar / Analytics / Knowledge / Decision), each a server-side handler with a narrow tool schema.
- **Tool Router**: a unified layer mapping task types → agent → tools. Replaceable modules per your requirement.
- Workflow Manager: executes ready tasks (deps satisfied), pauses at Guardian gates, resumes on approval.

### Slice 4 — Prospect discovery (Research Agent, real data)
- Firecrawl connector → search orgs (e.g. Florida charter schools), read sites, extract decision makers/emails, build org profiles.
- `organizations`, `contacts` tables + lead scoring. "Find 500 charter schools in Florida" produces a real ranked list — no manual list building.

### Slice 5 — Campaign engine + real email (Email Agent)
- `campaigns`, `campaign_recipients`, personalized draft generation, follow-ups.
- Real sending via `isura.tech` sender domain (email infra setup), throttled individual sends **after Guardian approval**.
- Campaign dashboard: prospects, progress, reply rate, meeting rate, AI recommendations, next best action.

### Slice 6 — Memory + Decision Graph + Learning
- `memory` (conversation/decision/sales/org/campaign/preference/relationship) — every approved action becomes structured memory.
- Decision Graph: reply/open/meeting rates, subject/length/send-time patterns → recommendations that improve over time.
- Morning voice briefing upgraded to pull from live objective/campaign/decision data.

## Cross-cutting (built into every slice)
- **Security**: RLS scoped to `auth.uid()` on all tables, GRANTs, server-side tools/secrets only, Guardian approval for impactful actions, audit via `agent_runs`.
- **Voice-first**: every slice is drivable from `/assistant` (extend the intent router as slices land).
- **Bilingual** EN/TR throughout.
- **Explainability**: every task and decision shows what/why/next.

## Technical notes
- All model calls, tools, secrets stay server-side (`createServerFn` / server routes) per the stack.
- Guardian remains the mandatory gate; L4 never auto-executes.
- Firecrawl (Slice 4) and email domain (Slice 5) are external prerequisites I'll set up when we reach those slices.

## What I need from you
1. **Confirm the build order** above, or reprioritize (e.g. campaigns before discovery).
2. **Start point**: I recommend building **Slice 2 (Objective & Planner engine)** now — it's the spine everything else plugs into, needs no external setup, and immediately delivers "speak an objective → watch ISURA plan it."

Shall I proceed with Slice 2?