import { createFileRoute } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { Header } from "@/components/Header";
import { EmailList } from "@/components/EmailList";
import {
  HeroStatus,
  PrimaryActions,
  CognitiveOverview,
  AIInsight,
  MagicMoment,
  PositioningFooter,
} from "@/components/DashboardSections";

const searchSchema = z.object({
  view: fallback(z.enum(["all", "priority", "replies", "low"]), "all").default("all"),
});

export const Route = createFileRoute("/")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "ISURA — Your inbox cognition system" },
      {
        name: "description",
        content:
          "ISURA is an AI cognitive assistant that prioritizes, decides, and drafts replies — so you can manage your attention, not your inbox.",
      },
      { property: "og:title", content: "ISURA — Your inbox cognition system" },
      {
        property: "og:description",
        content: "Reduce email overload. ISURA scores cognitive load, surfaces what matters, and drafts replies.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { view } = Route.useSearch();
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
        <HeroStatus />
        <PrimaryActions activeView={view} />
        <div className="grid gap-6 lg:grid-cols-2">
          <CognitiveOverview />
          <AIInsight />
        </div>
        <EmailList view={view} />
        <MagicMoment />
        <PositioningFooter />
      </main>
    </div>
  );
}
