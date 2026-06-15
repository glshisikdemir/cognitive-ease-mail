import { useState } from "react";
import { Plus, X, Trash2, Mail } from "lucide-react";
import { toast } from "sonner";
import { useLang, t } from "@/lib/i18n";
import {
  addCustomEmail,
  removeCustomEmail,
  useCustomEmails,
} from "@/lib/custom-emails";

export function AddEmailPanel() {
  const { lang } = useLang();
  const custom = useCustomEmails();
  const [open, setOpen] = useState(false);
  const [sender, setSender] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const reset = () => {
    setSender("");
    setSenderEmail("");
    setSubject("");
    setBody("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) {
      toast.error(t(lang, "addEmailRequired"));
      return;
    }
    addCustomEmail({ sender, senderEmail, subject, body });
    toast.success(t(lang, "addEmailAdded"));
    reset();
    setOpen(false);
  };

  return (
    <section className="rounded-2xl border border-border/70 bg-surface px-6 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          <Mail className="h-3.5 w-3.5" />
          {t(lang, "addEmailManual")}
        </div>
        <button
          onClick={() => setOpen((o) => !o)}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted"
        >
          {open ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {open ? t(lang, "addEmailClose") : t(lang, "addEmailOpen")}
        </button>
      </div>

      {open && (
        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <p className="text-sm text-muted-foreground">{t(lang, "addEmailDesc")}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={t(lang, "addEmailSender")}>
              <input
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                className="form-input"
                maxLength={120}
              />
            </Field>
            <Field label={t(lang, "addEmailSenderEmail")}>
              <input
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                type="email"
                className="form-input"
                maxLength={200}
              />
            </Field>
          </div>
          <Field label={t(lang, "addEmailSubject")}>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="form-input"
              maxLength={250}
            />
          </Field>
          <Field label={t(lang, "addEmailBody")}>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
              className="form-input resize-y"
              maxLength={8000}
            />
          </Field>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            {t(lang, "addEmailSubmit")}
          </button>
        </form>
      )}

      {custom.length > 0 && (
        <ul className="mt-5 space-y-2 border-t border-border/60 pt-4">
          {custom.map((e) => (
            <li
              key={e.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-background px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{e.subject}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {e.sender || e.senderEmail}
                </p>
              </div>
              <button
                onClick={() => {
                  removeCustomEmail(e.id);
                  toast.success(t(lang, "addEmailRemoved"));
                }}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-load-high-foreground"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {t(lang, "addEmailRemove")}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
