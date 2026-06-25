import { createFileRoute } from "@tanstack/react-router";
import { Mic } from "lucide-react";
import { Header } from "@/components/Header";
import { ProductFooter } from "@/components/ProductFooter";
import { TrustStrip } from "@/components/TrustStrip";
import { PilotNotice } from "@/components/PilotNotice";
import { VoiceAssistant } from "@/components/VoiceAssistant";
import { useLang, t } from "@/lib/i18n";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "ISURA — Voice assistant" },
      {
        name: "description",
        content:
          "Manage your whole inbox hands-free. Speak to ISURA to read, summarize, and reply to every email — you confirm before anything is sent.",
      },
    ],
  }),
  component: AssistantPage,
});

function AssistantPage() {
  const { lang } = useLang();
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl space-y-8 px-6 py-10">
        <section>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <Mic className="h-3.5 w-3.5" />
            {t(lang, "vaEyebrow")}
          </div>
          <h1 className="mt-2 font-display text-2xl text-foreground sm:text-3xl">
            {t(lang, "vaTitle")}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">{t(lang, "vaSubtitle")}</p>
        </section>

        <PilotNotice variant="inline" />

        <VoiceAssistant />

        <TrustStrip />
      </main>
      <ProductFooter />
    </div>
  );
}
