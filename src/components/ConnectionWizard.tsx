import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  CheckCircle2,
  Circle,
  RefreshCw,
  MessageCircle,
  Slack as SlackIcon,
  Send,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { useLang, t } from "@/lib/i18n";
import {
  getConnectionStatus,
  type ConnectionStatus,
} from "@/lib/connection-status.functions";
import { sendTestMessage } from "@/lib/send-test.functions";
import { useChannelSettings } from "@/lib/channel-settings";

type ChannelId = "slack" | "telegram" | "whatsapp";

const TEST_PLACEHOLDER: Record<ChannelId, string> = {
  slack: "wizTestSlackPh",
  telegram: "wizTestTgPh",
  whatsapp: "wizTestWaPh",
};


type StepDef = {
  id: "slack" | "telegram" | "whatsapp";
  icon: typeof SlackIcon;
  steps: string[];
  isConnected: (s: ConnectionStatus) => boolean;
};

const WIZARD: StepDef[] = [
  {
    id: "slack",
    icon: SlackIcon,
    steps: ["wizSlackS1", "wizSlackS2", "wizSlackS3"],
    isConnected: (s) => s.slack,
  },
  {
    id: "telegram",
    icon: Send,
    steps: ["wizTgS1", "wizTgS2", "wizTgS3"],
    isConnected: (s) => s.telegram,
  },
  {
    id: "whatsapp",
    icon: MessageCircle,
    steps: ["wizWaS1", "wizWaS2", "wizWaS3", "wizWaS4"],
    isConnected: (s) => s.whatsapp && s.whatsappFrom,
  },
];

export function ConnectionWizard({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { lang } = useLang();
  const settings = useChannelSettings();
  const statusFn = useServerFn(getConnectionStatus);
  const testFn = useServerFn(sendTestMessage);
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState<ConnectionStatus | null>(null);
  const [checking, setChecking] = useState(false);
  const [testTargets, setTestTargets] = useState<Record<ChannelId, string>>({
    slack: "",
    telegram: "",
    whatsapp: "",
  });
  const [sending, setSending] = useState(false);
  const [testResult, setTestResult] = useState<
    Record<ChannelId, { ok: boolean; reason?: string } | null>
  >({ slack: null, telegram: null, whatsapp: null });

  const check = async () => {
    setChecking(true);
    try {
      setStatus(await statusFn());
    } catch {
      setStatus(null);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    if (open) {
      setIndex(0);
      check();
      setTestResult({ slack: null, telegram: null, whatsapp: null });
      setTestTargets({
        slack: settings.slack.target,
        telegram: settings.telegram.target,
        whatsapp: settings.whatsapp.target,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);


  const current = WIZARD[index];
  const Icon = current.icon;
  const connected = status ? current.isConnected(status) : false;
  const isLast = index === WIZARD.length - 1;

  const channelId = current.id as ChannelId;
  const testTarget = testTargets[channelId];
  const result = testResult[channelId];

  const runTest = async () => {
    if (!testTarget.trim()) {
      setTestResult((r) => ({ ...r, [channelId]: { ok: false, reason: "no_target" } }));
      return;
    }
    setSending(true);
    setTestResult((r) => ({ ...r, [channelId]: null }));
    try {
      const res = await testFn({
        data: { channel: channelId, target: testTarget.trim(), lang },
      });
      setTestResult((r) => ({ ...r, [channelId]: res }));
    } catch {
      setTestResult((r) => ({ ...r, [channelId]: { ok: false, reason: "error" } }));
    } finally {
      setSending(false);
    }
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">{t(lang, "wizTitle")}</DialogTitle>
          <DialogDescription>{t(lang, "wizSubtitle")}</DialogDescription>
        </DialogHeader>

        {/* progress */}
        <div className="flex items-center gap-2">
          {WIZARD.map((w, i) => {
            const done = status ? w.isConnected(status) : false;
            return (
              <div key={w.id} className="flex flex-1 items-center gap-2">
                <button
                  onClick={() => setIndex(i)}
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs transition-colors ${
                    i === index
                      ? "bg-primary text-primary-foreground"
                      : done
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground"
                  }`}
                  aria-label={t(lang, `ch_${w.id}`)}
                >
                  {done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                </button>
                {i < WIZARD.length - 1 && <div className="h-px flex-1 bg-border" />}
              </div>
            );
          })}
        </div>

        <div className="rounded-xl border border-border/70 bg-surface p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-background text-foreground">
                <Icon className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="font-display text-base text-foreground">
                  {t(lang, `ch_${current.id}`)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t(lang, "wizStep")} {index + 1} {t(lang, "wizOf")} {WIZARD.length}
                </p>
              </div>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                connected
                  ? "bg-primary/15 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {connected ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : (
                <Circle className="h-3.5 w-3.5" />
              )}
              {connected ? t(lang, "wizConnected") : t(lang, "wizNotConnected")}
            </span>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            {t(lang, "wizConnectorsHint")}
          </p>

          <ol className="mt-3 space-y-2.5">
            {current.steps.map((key, i) => (
              <li key={key} className="flex gap-2.5 text-sm text-foreground">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-background text-[11px] font-medium text-muted-foreground">
                  {i + 1}
                </span>
                <span>{t(lang, key)}</span>
              </li>
            ))}
          </ol>

          <button
            onClick={check}
            disabled={checking}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-60"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${checking ? "animate-spin" : ""}`} />
            {checking ? t(lang, "wizChecking") : t(lang, "wizRecheck")}
          </button>

          {/* Test message step */}
          <div className="mt-4 border-t border-border/70 pt-4">
            <div className="flex items-center gap-2">
              <Send className="h-3.5 w-3.5 text-primary" />
              <p className="text-sm font-medium text-foreground">
                {t(lang, "wizTestTitle")}
              </p>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {t(lang, "wizTestHint")}
            </p>

            {connected ? (
              <>
                <label className="mt-3 block text-xs font-medium text-muted-foreground">
                  {t(lang, "wizTestTargetLabel")}
                </label>
                <div className="mt-1.5 flex gap-2">
                  <input
                    value={testTarget}
                    onChange={(e) =>
                      setTestTargets((tt) => ({ ...tt, [channelId]: e.target.value }))
                    }
                    placeholder={t(lang, TEST_PLACEHOLDER[channelId])}
                    className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary"
                  />
                  <button
                    onClick={runTest}
                    disabled={sending}
                    className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
                  >
                    <Send className="h-3.5 w-3.5" />
                    {sending ? t(lang, "wizTestSending") : t(lang, "wizTestSend")}
                  </button>
                </div>
                {result && (
                  <div
                    className={`mt-2.5 flex items-start gap-2 rounded-lg px-3 py-2 text-xs ${
                      result.ok
                        ? "bg-primary/10 text-primary"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {result.ok ? (
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    ) : (
                      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    )}
                    <span>
                      {result.ok
                        ? t(lang, "wizTestSuccess")
                        : result.reason === "no_target"
                          ? t(lang, "wizTestNeedTarget")
                          : `${t(lang, "wizTestFailed")} ${result.reason ?? "error"}`}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <p className="mt-3 flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {t(lang, "wizTestNotConnected")}
              </p>
            )}
          </div>

        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
          >
            {t(lang, "wizBack")}
          </button>
          {isLast ? (
            <button
              onClick={() => onOpenChange(false)}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {t(lang, "wizDone")}
            </button>
          ) : (
            <button
              onClick={() => setIndex((i) => Math.min(WIZARD.length - 1, i + 1))}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {t(lang, "wizNext")}
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
