import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";

export const Route = createFileRoute("/drafts")({
  head: () => ({ meta: [{ title: "Drafts — ISURA" }] }),
  component: () => (
    <AppShell>
      <h1 className="font-display text-3xl text-foreground">Drafts</h1>
      <p className="mt-2 text-sm text-muted-foreground">Coming in the next stage.</p>
    </AppShell>
  ),
});
