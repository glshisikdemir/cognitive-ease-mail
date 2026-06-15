import { createFileRoute } from "@tanstack/react-router";
import { Headphones } from "lucide-react";
import { Header } from "@/components/Header";
import { ProductFooter } from "@/components/ProductFooter";
import { TrustStrip } from "@/components/TrustStrip";
import { PilotNotice } from "@/components/PilotNotice";
import { VoiceBriefing } from "@/components/VoiceBriefing";
import { useLang, t } from "@/lib/i18n";

export const Route = createFileRoute("/briefing")({
  head: () => ({
    meta: [
      { title: "ISURA — Audio briefing" },
      {
        name: "description",
        content:
          "Listen to your inbox like a podcast. ISURA narrates an operational briefing with calm AI commentary — and responds to your voice commands.",
      },
    ],
  }),
  component: BriefingPage,
});

function BriefingPage() {
  const { lang } = useLang();
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl space-y-8 px-6 py-10">
        <section>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <Headphones className="h-3.5 w-3.5" />
            {t(lang, "briefingEyebrow")}
          </div>
          <h1 className="mt-2 font-display text-2xl text-foreground sm:text-3xl">
            {t(lang, "briefingTitle")}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            {t(lang, "briefingSubtitle")}
          </p>
        </section>

        <PilotNotice variant="inline" />

        <VoiceBriefing />

        <TrustStrip />
      </main>
      <ProductFooter />
    </div>
  );
}
