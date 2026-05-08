import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { DailyBriefing } from "@/components/DailyBriefing";
import { EmailList } from "@/components/EmailList";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ISURA — Email Cognitive Assistant" },
      { name: "description", content: "ISURA reads your inbox so you don't have to. Cognitive load scoring, decisions, and ready-to-send replies." },
      { property: "og:title", content: "ISURA — Email Cognitive Assistant" },
      { property: "og:description", content: "Stop being overwhelmed by email. ISURA prioritizes, decides, and drafts." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        <DailyBriefing />
        <EmailList />
      </main>
    </div>
  );
}
