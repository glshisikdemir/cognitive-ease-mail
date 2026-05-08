import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "tr";

type Dict = Record<string, { en: string; tr: string }>;

const dict: Dict = {
  appName: { en: "ISURA", tr: "ISURA" },
  appTagline: { en: "Your inbox cognition system", tr: "Gelen kutusu biliş sisteminiz" },
  inbox: { en: "Inbox", tr: "Gelen Kutusu" },
  settings: { en: "Settings", tr: "Ayarlar" },
  connected: { en: "Connected: Gmail", tr: "Bağlı: Gmail" },
  offline: { en: "Offline", tr: "Çevrimdışı" },
  syncing: { en: "Syncing…", tr: "Eşitleniyor…" },

  // Hero
  heroTitle: { en: "Your inbox is under control.", tr: "Gelen kutunuz kontrol altında." },
  heroSubtitle: {
    en: "ISURA analyzed your emails and reduced your cognitive load.",
    tr: "ISURA e-postalarınızı analiz etti ve bilişsel yükünüzü azalttı.",
  },
  emailsToday: { en: "Emails received today", tr: "Bugün gelen e-postalar" },
  highPriority: { en: "High priority", tr: "Yüksek öncelik" },
  mediumPriority: { en: "Medium priority", tr: "Orta öncelik" },
  lowPriority: { en: "Low priority", tr: "Düşük öncelik" },
  draftsReady: { en: "Suggested replies ready", tr: "Hazır yanıt önerileri" },

  // Primary actions
  reviewPriority: { en: "Review priority emails", tr: "Öncelikli e-postaları incele" },
  seeReplies: { en: "See suggested replies", tr: "Hazır yanıtları gör" },
  archiveLow: { en: "Archive low-load emails", tr: "Düşük yüklü e-postaları arşivle" },
  archivedToast: { en: "Archived {n} low-load emails.", tr: "{n} düşük yüklü e-posta arşivlendi." },
  archivedOneToast: { en: "Archived. Inbox a little lighter.", tr: "Arşivlendi. Kutunuz biraz daha hafif." },
  restoredToast: { en: "Restored to inbox.", tr: "Gelen kutusuna geri alındı." },
  archiveEmpty: { en: "Nothing low-load to archive.", tr: "Arşivlenecek düşük yüklü e-posta yok." },
  undo: { en: "Undo", tr: "Geri al" },

  // Priority review page
  priorityReviewLabel: { en: "Priority review", tr: "Öncelik incelemesi" },
  priorityHeading: {
    en: "{n} emails need your attention.",
    tr: "{n} e-posta dikkatinizi bekliyor.",
  },
  priorityHeadingSub: {
    en: "Estimated focus time: about {min} minutes. Take them one at a time.",
    tr: "Tahmini odak süresi: yaklaşık {min} dakika. Birer birer ele alın.",
  },
  priorityCleared: { en: "You're clear.", tr: "Her şey hazır." },
  priorityClearedSub: {
    en: "Nothing high-priority is waiting on you. Breathe.",
    tr: "Sizden bekleyen yüksek öncelikli bir şey yok. Nefes alın.",
  },
  openAndDecide: { en: "Open & decide", tr: "Aç ve karar ver" },
  nothingUrgent: { en: "Inbox at zero attention.", tr: "Dikkat gerektiren bir şey yok." },
  nothingUrgentSub: {
    en: "ISURA found no high-load or urgent emails right now.",
    tr: "ISURA şu anda yüksek yüklü veya acil e-posta bulamadı.",
  },
  backToDashboard: { en: "Back to dashboard", tr: "Panele dön" },
  generateReply: { en: "Generate reply", tr: "Yanıt oluştur" },
  archive: { en: "Archive", tr: "Arşivle" },
  needsAttention: { en: "Needs your attention", tr: "Dikkatinizi bekliyor" },
  hiddenLow: { en: "Hidden — low load", tr: "Gizli — düşük yük" },
  decisionHint: {
    en: "ISURA already decided. You just confirm.",
    tr: "ISURA zaten karar verdi. Siz yalnızca onaylayın.",
  },

  // Cognitive overview
  cognitiveOverview: { en: "Cognitive load overview", tr: "Bilişsel yük genel bakışı" },
  cognitiveSubtitle: {
    en: "Mental effort required from you — not just message count.",
    tr: "Mesaj sayısı değil, sizden istenen zihinsel çaba.",
  },
  loadLowLabel: { en: "Low load emails", tr: "Düşük yük e-postalar" },
  loadMediumLabel: { en: "Medium load emails", tr: "Orta yük e-postalar" },
  loadHighLabel: { en: "High load emails", tr: "Yüksek yük e-postalar" },

  // Insight
  insightTitle: { en: "Today's insight", tr: "Bugünün içgörüsü" },
  insightFocus: {
    en: "Focus only on high-impact conversations today.",
    tr: "Bugün yalnızca yüksek etkili görüşmelere odaklanın.",
  },
  insightLow: {
    en: "You are spending most of your attention on low-priority communication.",
    tr: "Dikkatinizin çoğunu düşük öncelikli iletişime harcıyorsunuz.",
  },
  insightHigh: {
    en: "Only {n} emails require immediate cognitive effort today.",
    tr: "Bugün yalnızca {n} e-posta acil zihinsel çaba gerektiriyor.",
  },

  // Email list
  emailListTitle: { en: "Today's emails", tr: "Bugünün e-postaları" },
  viewAll: { en: "All emails", tr: "Tüm e-postalar" },
  viewPriority: { en: "Priority emails", tr: "Öncelikli e-postalar" },
  viewReplies: { en: "Suggested replies", tr: "Hazır yanıtlar" },
  viewLow: { en: "Low-load emails", tr: "Düşük yüklü e-postalar" },
  tab_all: { en: "All", tr: "Tümü" },
  tab_priority: { en: "Priority", tr: "Öncelik" },
  tab_replies: { en: "Replies", tr: "Yanıtlar" },
  tab_low: { en: "Low load", tr: "Düşük yük" },
  archiveAll: { en: "Archive all", tr: "Tümünü arşivle" },
  archived: { en: "Archived", tr: "Arşivlendi" },
  restore: { en: "Restore", tr: "Geri al" },
  emptyView: { en: "Nothing here. Inbox a little lighter.", tr: "Burada bir şey yok. Kutunuz biraz daha hafif." },
  view: { en: "View", tr: "Görüntüle" },
  reply: { en: "Reply", tr: "Yanıtla" },
  ignore: { en: "Ignore", tr: "Yok say" },

  // Magic moment
  whatChanged: { en: "What changed?", tr: "Ne değişti?" },
  beforeIsura: { en: "Before ISURA", tr: "ISURA'dan önce" },
  afterIsura: { en: "After ISURA", tr: "ISURA'dan sonra" },
  before1: { en: "Inbox overload", tr: "Gelen kutusu yığını" },
  before2: { en: "Constant context switching", tr: "Sürekli bağlam değiştirme" },
  before3: { en: "Decision fatigue", tr: "Karar yorgunluğu" },
  before4: { en: "No prioritization clarity", tr: "Öncelik netliği yok" },
  after1: { en: "Clear priorities", tr: "Net öncelikler" },
  after2: { en: "Pre-generated replies", tr: "Hazır yanıtlar" },
  after3: { en: "Reduced cognitive load", tr: "Azaltılmış bilişsel yük" },
  after4: { en: "Structured attention", tr: "Yapılandırılmış dikkat" },

  // Footer line
  positioning: {
    en: "ISURA does not manage your inbox. It manages your attention.",
    tr: "ISURA gelen kutunuzu yönetmez. Dikkatinizi yönetir.",
  },

  // Existing keys kept for detail page
  load: { en: "Load", tr: "Yük" },
  loadLow: { en: "Low load", tr: "Düşük yük" },
  loadMedium: { en: "Medium load", tr: "Orta yük" },
  loadHigh: { en: "High load", tr: "Yüksek yük" },
  prUrgent: { en: "Urgent", tr: "Acil" },
  prNormal: { en: "Normal", tr: "Normal" },
  prIgnore: { en: "Ignore", tr: "Yok say" },
  back: { en: "Back to dashboard", tr: "Panele dön" },
  understanding: { en: "Understanding", tr: "Anlama" },
  summary: { en: "Summary", tr: "Özet" },
  intent: { en: "Intent", tr: "Niyet" },
  decision: { en: "Decision Layer", tr: "Karar Katmanı" },
  shouldRespond: { en: "Should you respond?", tr: "Yanıt vermeli misiniz?" },
  why: { en: "Why", tr: "Neden" },
  urgency: { en: "Urgency", tr: "Aciliyet" },
  tone: { en: "Tone", tr: "Ton" },
  regenerate: { en: "Regenerate", tr: "Yeniden oluştur" },
  edit: { en: "Edit", tr: "Düzenle" },
  approveSend: { en: "Approve & Send", tr: "Onayla ve Gönder" },
  thinking: { en: "Thinking quietly…", tr: "Sessizce düşünüyor…" },
  yes: { en: "Yes", tr: "Evet" },
  no: { en: "No", tr: "Hayır" },
  delegate: { en: "Delegate", tr: "Devret" },
  language: { en: "Language", tr: "Dil" },
  sentToast: { en: "Reply sent. Inbox a little lighter.", tr: "Yanıt gönderildi. Kutunuz biraz daha hafifledi." },
  byIsura: { en: "Drafted by ISURA", tr: "ISURA tarafından hazırlandı" },
};

export function t(lang: Lang, key: keyof typeof dict, vars?: Record<string, string | number>): string {
  let str = dict[key]?.[lang] ?? key;
  if (vars) for (const [k, v] of Object.entries(vars)) str = str.replace(`{${k}}`, String(v));
  return str;
}

const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "en",
  setLang: () => {},
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  useEffect(() => {
    const saved = typeof window !== "undefined" ? (localStorage.getItem("isura.lang") as Lang | null) : null;
    if (saved === "en" || saved === "tr") setLangState(saved);
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("isura.lang", l);
  };
  return <LangCtx.Provider value={{ lang, setLang }}>{children}</LangCtx.Provider>;
}

export function useLang() {
  return useContext(LangCtx);
}
