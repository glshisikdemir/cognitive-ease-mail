import { createFileRoute } from "@tanstack/react-router";
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

export const Route = createFileRoute("/")({
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
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
        <HeroStatus />
        <PrimaryActions />
        <div className="grid gap-6 lg:grid-cols-2">
          <CognitiveOverview />
          <AIInsight />
        </div>
        <EmailList />
        <MagicMoment />
        <PositioningFooter />
      </main>
    </div>
  );
}
