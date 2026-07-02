// Decision Guardian — client-safe types and metadata for ISURA's trust layer.
// "Autonomous execution. Human authority."

export type AutonomyCategory =
  | "marketing"
  | "sales"
  | "finance"
  | "legal"
  | "calendar"
  | "email_followup"
  | "pricing"
  | "contracts"
  | "data";

export type AutonomyLevel =
  | "level1_autonomous"
  | "level2_silent"
  | "level3_approval"
  | "level4_strategic";

export type DecisionStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "executed"
  | "undone"
  | "expired";

export type RiskLevel = "low" | "medium" | "high" | "critical";

type Bilingual = { en: string; tr: string };

export const CATEGORY_META: Record<
  AutonomyCategory,
  { label: Bilingual; desc: Bilingual; defaultLevel: AutonomyLevel }
> = {
  calendar: {
    label: { en: "Calendar", tr: "Takvim" },
    desc: { en: "Scheduling, reminders, meeting booking", tr: "Planlama, hatırlatmalar, toplantı ayarlama" },
    defaultLevel: "level1_autonomous",
  },
  email_followup: {
    label: { en: "Email follow-up", tr: "E-posta takibi" },
    desc: { en: "Approved follow-ups, archiving, summaries", tr: "Onaylı takipler, arşivleme, özetler" },
    defaultLevel: "level1_autonomous",
  },
  marketing: {
    label: { en: "Marketing", tr: "Pazarlama" },
    desc: { en: "Outreach personalization, tone, timing", tr: "Erişim kişiselleştirme, ton, zamanlama" },
    defaultLevel: "level2_silent",
  },
  sales: {
    label: { en: "Sales", tr: "Satış" },
    desc: { en: "Contacting new prospects, demos", tr: "Yeni müşteri adaylarıyla iletişim, demolar" },
    defaultLevel: "level3_approval",
  },
  pricing: {
    label: { en: "Pricing", tr: "Fiyatlandırma" },
    desc: { en: "Sharing pricing, quotes, discounts", tr: "Fiyat paylaşma, teklifler, indirimler" },
    defaultLevel: "level3_approval",
  },
  finance: {
    label: { en: "Finance", tr: "Finans" },
    desc: { en: "Spending, payments, financial commitments", tr: "Harcama, ödemeler, finansal taahhütler" },
    defaultLevel: "level4_strategic",
  },
  legal: {
    label: { en: "Legal", tr: "Hukuk" },
    desc: { en: "Contracts, legal commitments", tr: "Sözleşmeler, hukuki taahhütler" },
    defaultLevel: "level4_strategic",
  },
  contracts: {
    label: { en: "Contracts", tr: "Sözleşmeler" },
    desc: { en: "Signing, partnerships, agreements", tr: "İmzalama, ortaklıklar, anlaşmalar" },
    defaultLevel: "level4_strategic",
  },
  data: {
    label: { en: "Data", tr: "Veri" },
    desc: { en: "Deletions, exports, permanent changes", tr: "Silmeler, dışa aktarma, kalıcı değişiklikler" },
    defaultLevel: "level4_strategic",
  },
};

export const LEVEL_META: Record<
  AutonomyLevel,
  { n: number; label: Bilingual; short: Bilingual; desc: Bilingual; color: string }
> = {
  level1_autonomous: {
    n: 1,
    label: { en: "Fully Autonomous", tr: "Tam Otonom" },
    short: { en: "Auto", tr: "Oto" },
    desc: {
      en: "Low-risk repetitive actions. No approval needed — you're notified afterward.",
      tr: "Düşük riskli tekrar eden işlemler. Onay gerekmez — sonradan bilgilendirilirsiniz.",
    },
    color: "emerald",
  },
  level2_silent: {
    n: 2,
    label: { en: "Silent Confirmation", tr: "Sessiz Onay" },
    short: { en: "Silent", tr: "Sessiz" },
    desc: {
      en: "Medium-risk. Proceeds automatically unless you object within a time window.",
      tr: "Orta riskli. Bir süre içinde itiraz etmezseniz otomatik ilerler.",
    },
    color: "sky",
  },
  level3_approval: {
    n: 3,
    label: { en: "Approval Required", tr: "Onay Gerekli" },
    short: { en: "Approval", tr: "Onay" },
    desc: {
      en: "High-impact. ISURA pauses and explains; you approve, reject, or modify by voice.",
      tr: "Yüksek etkili. ISURA durur ve açıklar; sesle onaylar, reddeder veya değiştirirsiniz.",
    },
    color: "amber",
  },
  level4_strategic: {
    n: 4,
    label: { en: "Strategic (Human only)", tr: "Stratejik (Yalnız insan)" },
    short: { en: "Human", tr: "İnsan" },
    desc: {
      en: "Critical. ISURA prepares recommendations but can never execute. Only humans decide.",
      tr: "Kritik. ISURA öneri hazırlar ama asla uygulayamaz. Yalnızca insanlar karar verir.",
    },
    color: "rose",
  },
};

export const RISK_META: Record<RiskLevel, { label: Bilingual; color: string }> = {
  low: { label: { en: "Low", tr: "Düşük" }, color: "emerald" },
  medium: { label: { en: "Medium", tr: "Orta" }, color: "sky" },
  high: { label: { en: "High", tr: "Yüksek" }, color: "amber" },
  critical: { label: { en: "Critical", tr: "Kritik" }, color: "rose" },
};

export const STATUS_META: Record<DecisionStatus, { label: Bilingual; color: string }> = {
  pending: { label: { en: "Awaiting approval", tr: "Onay bekliyor" }, color: "amber" },
  approved: { label: { en: "Approved", tr: "Onaylandı" }, color: "sky" },
  rejected: { label: { en: "Rejected", tr: "Reddedildi" }, color: "rose" },
  executed: { label: { en: "Executed", tr: "Uygulandı" }, color: "emerald" },
  undone: { label: { en: "Undone", tr: "Geri alındı" }, color: "muted" },
  expired: { label: { en: "Expired", tr: "Süresi doldu" }, color: "muted" },
};

export const CATEGORY_ORDER: AutonomyCategory[] = [
  "calendar",
  "email_followup",
  "marketing",
  "sales",
  "pricing",
  "finance",
  "legal",
  "contracts",
  "data",
];

/**
 * The Guardian's core rule: does this action require human approval before it
 * can execute, given the configured autonomy level?
 * Level 1 → auto-execute. Level 2 → auto after silent window. Level 3/4 → hold.
 */
export function requiresApproval(level: AutonomyLevel): boolean {
  return level === "level3_approval" || level === "level4_strategic";
}

export function canEverExecute(level: AutonomyLevel): boolean {
  return level !== "level4_strategic";
}
