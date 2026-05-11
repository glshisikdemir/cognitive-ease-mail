import { Link } from "@tanstack/react-router";
import { ShieldCheck, Hand, Lock, Power } from "lucide-react";
import { useLang, t } from "@/lib/i18n";

// Persistent calm trust strip, used at the bottom of major screens.
export function TrustStrip() {
  const { lang } = useLang();
  const items = [
    { Icon: Hand, label: t(lang, "trustPersistentNoSend") },
    { Icon: ShieldCheck, label: t(lang, "trustPersistentControl") },
    { Icon: Lock, label: t(lang, "trustPersistentReadOnly") },
    { Icon: Power, label: t(lang, "trustPersistentDisconnect") },
  ];
  return (
    <section className="rounded-2xl border border-border/70 bg-surface/60 px-6 py-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ Icon, label }) => (
          <div key={label} className="flex items-start gap-2.5 text-[12px] leading-relaxed text-muted-foreground">
            <Icon className="mt-0.5 h-3.5 w-3.5 flex-none text-foreground/60" />
            <span>{label}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 border-t border-border/60 pt-3 text-center">
        <Link
          to="/trust"
          className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ShieldCheck className="h-3 w-3" />
          {t(lang, "trustViewSecurity")}
        </Link>
      </div>
    </section>
  );
}

// Compact inline trust chip for mounting near sensitive actions (send, approve).
export function TrustChip({ variant = "approval" }: { variant?: "approval" | "readonly" }) {
  const { lang } = useLang();
  const Icon = variant === "approval" ? Hand : Lock;
  const label = variant === "approval" ? t(lang, "trustModeApproval") : t(lang, "trustModeReadOnly");
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}
