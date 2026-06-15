import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Mail, MessageCircle, Slack as SlackIcon, Send, Radio, Wand2 } from "lucide-react";
import { ConnectionWizard } from "@/components/ConnectionWizard";
import { Header } from "@/components/Header";
import { ProductFooter } from "@/components/ProductFooter";
import { useLang, t } from "@/lib/i18n";
import { emails as staticEmails } from "@/lib/emails";
import { useCustomEmails } from "@/lib/custom-emails";
import { quickAssess } from "@/lib/heuristics";
import {
  CHANNELS,
  ASSISTANTS,
  useChannelSettings,
  updateChannel,
  type ChannelId,
  type AssistantId,
} from "@/lib/channel-settings";
import { sendBriefing } from "@/lib/send-briefing.functions";

export const Route = createFileRoute("/channels")({
  head: () => ({
    meta: [
      { title: "Channel assistants — ISURA" },
      {
        name: "description",
        content: "Choose an assistant for each channel and send your briefing to WhatsApp, Slack, Telegram, or email.",
      },
    ],
  }),
  component: ChannelsPage,
});

const ICONS: Record<ChannelId, typeof Mail> = {
  email: Mail,
  whatsapp: MessageCircle,
  slack: SlackIcon,
  telegram: Send,
};

function ChannelsPage() {
  const { lang } = useLang();
  const settings = useChannelSettings();
  const custom = useCustomEmails();
  const sendFn = useServerFn(sendBriefing);
  const [sending, setSending] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);

  const emails = useMemo(() => {
    return [...custom, ...staticEmails].map((e) => ({
      sender: e.sender,
      subject: e.subject,
      body: e.body.slice(0, 4000),
      category: quickAssess(e).category as string,
    }));
  }, [custom]);

  const handleSend = async () => {
    const enabled = CHANNELS.filter((c) => settings[c].enabled && settings[c].target.trim());
    if (enabled.length === 0) {
      toast.error(t(lang, "channelsNoneEnabled"));
      return;
    }
    setSending(true);
    try {
      const targets: Record<string, string> = {};
      const assistantByChannel: Record<string, AssistantId> = {};
      for (const c of enabled) {
        targets[c] = settings[c].target.trim();
        assistantByChannel[c] = settings[c].assistant;
      }
      const { results } = await sendFn({
        data: { lang, assistantByChannel, targets, emails },
      });
      const failed = results.filter((r) => !r.ok);
      if (failed.length === 0) {
        toast.success(t(lang, "channelsSentOk"));
      } else {
        toast.error(
          `${t(lang, "channelsSendFailed")}: ${failed.map((f) => f.channel).join(", ")}`,
        );
      }
    } catch {
      toast.error(t(lang, "channelsSendFailed"));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl space-y-8 px-6 py-10">
        <section>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <Radio className="h-3.5 w-3.5" />
            {t(lang, "channelsNav")}
          </div>
          <h1 className="mt-2 font-display text-2xl text-foreground sm:text-3xl">
            {t(lang, "channelsTitle")}
          </h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            {t(lang, "channelsSubtitle")}
          </p>
          <button
            onClick={() => setWizardOpen(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <Wand2 className="h-4 w-4" />
            {t(lang, "wizOpen")}
          </button>
        </section>


        <div className="space-y-4">
          {CHANNELS.map((c) => (
            <ChannelCard key={c} channel={c} lang={lang} config={settings[c]} />
          ))}
        </div>

        <button
          onClick={handleSend}
          disabled={sending}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          <Send className="h-4 w-4" />
          {sending ? t(lang, "channelsSending") : t(lang, "channelsSend")}
        </button>
      </main>
      <ConnectionWizard open={wizardOpen} onOpenChange={setWizardOpen} />
      <ProductFooter />
    </div>
  );
}


function ChannelCard({
  channel,
  lang,
  config,
}: {
  channel: ChannelId;
  lang: ReturnType<typeof useLang>["lang"];
  config: ReturnType<typeof useChannelSettings>[ChannelId];
}) {
  const Icon = ICONS[channel];
  const inputCls =
    "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20";

  return (
    <section className="rounded-2xl border border-border/70 bg-surface px-5 py-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-background text-foreground">
            <Icon className="h-4 w-4" />
          </span>
          <span className="font-display text-base text-foreground">
            {t(lang, `ch_${channel}`)}
          </span>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
          {t(lang, "channelsEnabled")}
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => updateChannel(channel, { enabled: e.target.checked })}
            className="h-4 w-4 accent-[var(--primary)]"
          />
        </label>
      </div>

      {config.enabled && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              {t(lang, "channelsAssistant")}
            </span>
            <select
              value={config.assistant}
              onChange={(e) =>
                updateChannel(channel, { assistant: e.target.value as AssistantId })
              }
              className={inputCls}
            >
              {ASSISTANTS.map((a) => (
                <option key={a} value={a}>
                  {t(lang, `asst_${a}`)}
                </option>
              ))}
            </select>
            <span className="mt-1 block text-xs text-muted-foreground">
              {t(lang, `asst_${config.assistant}_d`)}
            </span>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              {t(lang, "channelsTarget")}
            </span>
            <input
              value={config.target}
              onChange={(e) => updateChannel(channel, { target: e.target.value })}
              placeholder={t(lang, `ph_${channel}`)}
              className={inputCls}
              maxLength={200}
            />
            <span className="mt-1 block text-xs text-muted-foreground">
              {t(lang, "channelsConnectNeeded")}
            </span>
          </label>
        </div>
      )}
    </section>
  );
}
