import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Mail,
  Globe,
  AtSign,
  Check,
  ArrowRight,
  AlertCircle,
  Send,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { useLang, t } from "@/lib/i18n";
import {
  EMAIL_DOMAINS,
  SENDER_PRESETS,
  buildSenderAddress,
  isValidLocalPart,
} from "@/lib/email-domains";
import { updateChannel, useChannelSettings } from "@/lib/channel-settings";
import { sendTestEmail, type EmailTestResult } from "@/lib/send-test-email.functions";

export function EmailWizard({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { lang } = useLang();
  const settings = useChannelSettings();
  const [step, setStep] = useState(0);
  const [domain, setDomain] = useState(EMAIL_DOMAINS[0]);
  const [localPart, setLocalPart] = useState("");
  const [sending, setSending] = useState(false);
  const [testResult, setTestResult] = useState<EmailTestResult | null>(null);
  const [testTo, setTestTo] = useState("");
  const sendTestFn = useServerFn(sendTestEmail);

  useEffect(() => {
    if (!open) return;
    setStep(0);
    setSending(false);
    setTestResult(null);
    const existing = settings.email.from;
    if (existing && existing.includes("@")) {
      const [lp, dm] = existing.split("@");
      setLocalPart(lp);
      if (EMAIL_DOMAINS.includes(dm)) setDomain(dm);
    } else {
      setLocalPart("");
      setDomain(EMAIL_DOMAINS[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const valid = isValidLocalPart(localPart);
  const sender = useMemo(
    () => (valid ? buildSenderAddress(localPart, domain) : ""),
    [valid, localPart, domain],
  );

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const testToValid = EMAIL_RE.test(testTo.trim());

  const labels = [
    t(lang, "emailWizStep1"),
    t(lang, "emailWizStep2"),
    t(lang, "emailWizStep3"),
    t(lang, "emailWizStep4"),
  ];

  const saveAndContinue = () => {
    updateChannel("email", { from: sender, enabled: true });
    toast.success(t(lang, "emailWizSaved"));
    setTestResult(null);
    setTestTo(sender);
    setStep(3);
  };

  const runTest = async () => {
    if (!testToValid) return;
    setSending(true);
    setTestResult(null);
    try {
      const res = await sendTestFn({ data: { to: testTo.trim(), lang } });
      setTestResult(res);
    } catch {
      setTestResult({ ok: false, reason: "error" });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            {t(lang, "emailWizTitle")}
          </DialogTitle>
          <DialogDescription>{t(lang, "emailWizSubtitle")}</DialogDescription>
        </DialogHeader>

        {/* progress */}
        <div className="flex items-center gap-2">
          {labels.map((label, i) => (
            <div key={label} className="flex flex-1 items-center gap-2">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs transition-colors ${
                  i === step
                    ? "bg-primary text-primary-foreground"
                    : i < step
                      ? "bg-primary/15 text-primary"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              {i < labels.length - 1 && <div className="h-px flex-1 bg-border" />}
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border/70 bg-surface p-4">
          {step === 0 && (
            <>
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Globe className="h-4 w-4 text-primary" />
                {t(lang, "emailWizDomainLabel")}
              </div>
              <div className="mt-3 space-y-2">
                {EMAIL_DOMAINS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDomain(d)}
                    className={`flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                      domain === d
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-border bg-background text-foreground hover:bg-muted"
                    }`}
                  >
                    <span className="font-medium">{d}</span>
                    {domain === d && <Check className="h-4 w-4 text-primary" />}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {t(lang, "emailWizDomainHint")}
              </p>
            </>
          )}

          {step === 1 && (
            <>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <AtSign className="h-4 w-4 text-primary" />
                {t(lang, "emailWizLocalLabel")}
              </label>
              <div className="mt-3 flex items-stretch overflow-hidden rounded-lg border border-border bg-background focus-within:border-primary">
                <input
                  value={localPart}
                  onChange={(e) => setLocalPart(e.target.value)}
                  placeholder={t(lang, "emailWizLocalPh")}
                  maxLength={64}
                  className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-foreground outline-none"
                />
                <span className="flex items-center bg-muted px-3 text-sm text-muted-foreground">
                  @{domain}
                </span>
              </div>
              {localPart.trim() !== "" && !valid && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-destructive">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {t(lang, "emailWizInvalidLocal")}
                </p>
              )}
              <p className="mt-4 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                {t(lang, "emailWizPresets")}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {SENDER_PRESETS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setLocalPart(p)}
                    className="rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground transition-colors hover:bg-muted"
                  >
                    {p}
                  </button>
                ))}
              </div>
              {valid && (
                <div className="mt-4 rounded-lg bg-primary/5 px-3 py-2.5">
                  <p className="text-xs text-muted-foreground">
                    {t(lang, "emailWizPreview")}
                  </p>
                  <p className="font-display text-sm text-foreground">{sender}</p>
                </div>
              )}
            </>
          )}

          {step === 2 && (
            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">{t(lang, "emailWizReviewSender")}</dt>
                <dd className="font-display text-foreground">{sender}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-border/70 pt-3">
                <dt className="text-muted-foreground">{t(lang, "emailWizReviewDomain")}</dt>
                <dd className="text-foreground">{domain}</dd>
              </div>
            </dl>
          )}

          {step === 3 && (
            <>
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Send className="h-4 w-4 text-primary" />
                {t(lang, "emailWizTestTitle")}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {t(lang, "emailWizTestHint")}
              </p>
              <div className="mt-3 rounded-lg bg-primary/5 px-3 py-2.5">
                <p className="text-xs text-muted-foreground">
                  {t(lang, "emailWizTestRecipient")}
                </p>
                <p className="font-display text-sm text-foreground">{sender}</p>
              </div>
              <button
                onClick={runTest}
                disabled={sending || !sender}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {sending ? t(lang, "emailWizTestSending") : t(lang, "emailWizTestSend")}
              </button>

              {testResult && (
                <div
                  className={`mt-4 flex items-start gap-2 rounded-lg px-3 py-2.5 text-sm ${
                    testResult.ok
                      ? "bg-primary/10 text-foreground"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {testResult.ok ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  ) : (
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  )}
                  <span>
                    {testResult.ok
                      ? t(lang, "emailWizTestSuccess")
                      : testResult.reason === "not_ready"
                        ? t(lang, "emailWizTestNotReady")
                        : t(lang, "emailWizTestFailed")}
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0 || sending}
            className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
          >
            {t(lang, "emailWizBack")}
          </button>
          {step < 2 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={step === 1 && !valid}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {t(lang, "emailWizNext")}
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : step === 2 ? (
            <button
              onClick={saveAndContinue}
              disabled={!valid}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              {t(lang, "emailWizSave")}
            </button>
          ) : (
            <button
              onClick={() => onOpenChange(false)}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Check className="h-4 w-4" />
              {t(lang, "emailWizFinish")}
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
