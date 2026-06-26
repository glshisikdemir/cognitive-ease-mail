import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { PenLine, Send, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { composeEmail } from "@/lib/compose-email.functions";
import { addSentEmail } from "@/lib/sent-emails";
import { useLang, t } from "@/lib/i18n";

export function ComposeEmail() {
  const { lang } = useLang();
  const generate = useServerFn(composeEmail);

  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [instruction, setInstruction] = useState("");
  const [generating, setGenerating] = useState(false);

  const canSend = body.trim().length > 0 && (subject.trim().length > 0 || to.trim().length > 0);

  const handleGenerate = async () => {
    const clean = instruction.trim();
    if (!clean) return;
    setGenerating(true);
    try {
      const result = await generate({
        data: { lang, instruction: clean, to: to.trim() || undefined },
      });
      setSubject(result.subject);
      setBody(result.body);
      toast.success(t(lang, "composeAIDone"));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t(lang, "vaError"));
    } finally {
      setGenerating(false);
    }
  };

  const handleSend = () => {
    if (!canSend) {
      toast.error(t(lang, "composeRequired"));
      return;
    }
    addSentEmail({ to: to.trim(), subject: subject.trim(), body: body.trim(), via: "written" });
    toast.success(t(lang, "composeSent"));
    setTo("");
    setSubject("");
    setBody("");
    setInstruction("");
  };

  return (
    <div className="space-y-4 rounded-2xl border border-border/70 bg-surface px-5 py-5">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
        <PenLine className="h-3.5 w-3.5" />
        {t(lang, "composeTitle")}
      </div>
      <p className="text-sm text-muted-foreground">{t(lang, "composeDesc")}</p>

      {/* AI assist */}
      <div className="rounded-xl border border-border/60 bg-surface-muted px-4 py-3">
        <label className="flex items-center gap-1.5 text-xs font-medium text-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          {t(lang, "composeAI")}
        </label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder={t(lang, "composeAIPh")}
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !generating) void handleGenerate();
            }}
          />
          <button
            onClick={() => void handleGenerate()}
            disabled={generating || !instruction.trim()}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition disabled:opacity-50"
          >
            {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {generating ? t(lang, "composeAIThinking") : t(lang, "composeAIGenerate")}
          </button>
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground">{t(lang, "composeTo")}</label>
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder={t(lang, "composeToPh")}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">{t(lang, "addEmailSubject")}</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">{t(lang, "addEmailBody")}</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            className="mt-1 w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
      </div>

      <button
        onClick={handleSend}
        disabled={!canSend}
        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
      >
        <Send className="h-4 w-4" />
        {t(lang, "composeSend")}
      </button>
    </div>
  );
}
