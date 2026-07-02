# ISURA — Voice-First AI Operating System

ISURA is not a CRM, not a mail app. It is a voice-first AI Decision Operating Layer.
Principle: **"Autonomous execution. Human authority."**

## Slice 1 — Decision Guardian + Autonomy Levels ✅ (built)

Trust layer every autonomous action must pass through.

- DB: `permission_settings` (per-user autonomy per category) + `decisions` (permanent
  timeline: recommendation, reasoning, evidence, alternatives, confidence, risk,
  impact, status, outcome). Auth-scoped via RLS.
- Enums: `autonomy_category`, `autonomy_level` (L1 autonomous → L4 strategic),
  `decision_status`, `risk_level`.
- `src/lib/guardian.ts` — category/level/risk/status metadata + rules
  (`requiresApproval`, `canEverExecute`).
- `src/lib/guardian.functions.ts` — auth server fns: get/set permissions,
  list/create/update decisions.
- `/permissions` — Permission Center (configure autonomy per area).
- `/guardian` — Guardian Dashboard (pending approvals w/ full explainability +
  decision timeline; approve / reject / execute / undo).

## Slice 2 — Voice-first campaign console (next)
Speak to create campaigns; campaign dashboard (status, reply rate, meetings);
voice approval before sending. Every proposed send routes through the Guardian
(sales/pricing = L3 approval by default).

## Slice 3 — Prospect discovery (Firecrawl)
Voice → search orgs (schools/companies), read websites, build org profiles,
collect decision makers/emails. Server-side via Firecrawl connector.

## Slice 4 — Real email sending
Configure isura.tech sender domain + email infra. Personalized, throttled,
individual sends after Guardian approval. Track delivery/opens/replies/meetings.

## Slice 5 — Smart follow-up, calendar, decision memory, learning, morning voice brief
Autonomous mode: works in background, requests approval only for high-impact
decisions per the Permission Center.

## Technical notes
- All model calls, tools, secrets stay server-side (createServerFn / server routes).
- Guardian is the mandatory gate: no action executes above its configured level
  without human approval; L4 never auto-executes.
