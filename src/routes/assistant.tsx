import { createFileRoute } from "@tanstack/react-router";
import { Mic, PenLine, Send } from "lucide-react";
import { Header } from "@/components/Header";
import { ProductFooter } from "@/components/ProductFooter";
import { TrustStrip } from "@/components/TrustStrip";
import { PilotNotice } from "@/components/PilotNotice";
import { VoiceAssistant } from "@/components/VoiceAssistant";
import { ComposeEmail } from "@/components/ComposeEmail";
import { useSentEmails } from "@/lib/sent-emails";
import { useLang, t } from "@/lib/i18n";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "ISURA — Voice assistant" },
      {
        name: "description",
        content:
          "Manage your whole inbox hands-free. Speak to ISURA to read, summarize, reply, and compose new emails — by voice or in writing. You confirm before anything is sent.",
      },
    ],
  }),
  component: AssistantPage,
});

function SentList() {
  const { lang } = useLang();
  const sent = useSentEmails();
  if (sent.length === 0) return null;
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        <Send className="h-3.5 w-3.5" />
        {t(lang, "sentTitle")}
      </div>
      <div className="space-y-2">
        {sent.slice(0, 8).map((e) => (
          <div key={e.id} className="rounded-xl border border-border/70 bg-surface px-4 py-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-foreground">{e.subject || t(lang, "sentNoSubject")}</p>
              <span className="shrink-0 text-xs text-muted-foreground">
                {new Date(e.sentAt).toLocaleString(lang === "tr" ? "tr-TR" : "en-US")}
              </span>
            </div>
            {e.to && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {t(lang, "composeTo")}: {e.to}
              </p>
            )}
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{e.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

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

        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <PenLine className="h-3.5 w-3.5" />
            {t(lang, "composeEyebrow")}
          </div>
          <ComposeEmail />
        </section>

        <SentList />

        <TrustStrip />
      </main>
      <ProductFooter />
    </div>
  );
}
