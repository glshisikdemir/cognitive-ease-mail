import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "tr";

type Dict = Record<string, { en: string; tr: string }>;

const dict: Dict = {
  appName: { en: "ISURA", tr: "ISURA" },
  appTagline: { en: "Operational cognition, quietly applied.", tr: "Operasyonel biliş, sessizce uygulanır." },
  inbox: { en: "Operations", tr: "Operasyon" },
  settings: { en: "Settings", tr: "Ayarlar" },
  connected: { en: "Connected: Gmail", tr: "Bağlı: Gmail" },
  offline: { en: "Offline", tr: "Çevrimdışı" },
  syncing: { en: "Syncing…", tr: "Eşitleniyor…" },

  // Hero
  heroTitle: { en: "Your operations are under control.", tr: "Operasyonlarınız kontrol altında." },
  heroSubtitle: {
    en: "ISURA reads every message, surfaces real consequences, and quiets the rest.",
    tr: "ISURA her mesajı okur, gerçek sonuçları öne çıkarır, geri kalanı sessizleştirir.",
  },
  viewAllEmails: { en: "View all messages", tr: "Tüm mesajları gör" },
  hiddenMinimized: { en: "Quieted", tr: "Sessizleştirildi" },
  emailPreviewTitle: { en: "Latest in your operations queue", tr: "Operasyon kuyruğundaki en yeniler" },
  emailsToday: { en: "Messages received today", tr: "Bugün gelen mesajlar" },
  highPriority: { en: "Requires decision", tr: "Karar gerektiriyor" },
  mediumPriority: { en: "Operational risk", tr: "Operasyonel risk" },
  lowPriority: { en: "Low cognitive value", tr: "Düşük bilişsel değer" },
  draftsReady: { en: "Drafts awaiting your approval", tr: "Onayınızı bekleyen taslaklar" },

  // Primary actions
  reviewPriority: { en: "Open priority queue", tr: "Öncelik kuyruğunu aç" },
  seeReplies: { en: "Review approved drafts", tr: "Hazır taslakları incele" },
  archiveLow: { en: "Quiet low-value messages", tr: "Düşük değerli mesajları sessizleştir" },
  archivedToast: { en: "Quieted {n} low-value messages.", tr: "{n} düşük değerli mesaj sessizleştirildi." },
  archivedOneToast: { en: "Filed. One less thing to think about.", tr: "Arşivlendi. Düşünecek bir şey daha eksildi." },
  restoredToast: { en: "Restored to operations queue.", tr: "Operasyon kuyruğuna geri alındı." },
  archiveEmpty: { en: "Nothing to quiet right now.", tr: "Sessizleştirilecek bir şey yok." },
  undo: { en: "Undo", tr: "Geri al" },

  // Priority review
  priorityReviewLabel: { en: "Priority queue", tr: "Öncelik kuyruğu" },
  priorityHeading: {
    en: "{n} items need a decision from you.",
    tr: "{n} öğe sizden karar bekliyor.",
  },
  priorityHeadingSub: {
    en: "Estimated focus time: about {min} minutes. Take them one at a time.",
    tr: "Tahmini odak süresi: yaklaşık {min} dakika. Birer birer ele alın.",
  },
  priorityCleared: { en: "Operationally clear.", tr: "Operasyonel olarak temiz." },
  priorityClearedSub: {
    en: "Nothing demands a decision. Use this time well.",
    tr: "Karar gerektiren bir şey yok. Bu zamanı iyi kullanın.",
  },
  openAndDecide: { en: "Open & decide", tr: "Aç ve karar ver" },
  nothingUrgent: { en: "Queue at zero.", tr: "Kuyrukta hiçbir şey yok." },
  nothingUrgentSub: {
    en: "ISURA found no operational risks or pending decisions right now.",
    tr: "ISURA şu anda operasyonel risk veya bekleyen karar bulamadı.",
  },
  backToDashboard: { en: "Back to operations", tr: "Operasyona dön" },
  generateReply: { en: "Draft a response", tr: "Yanıt hazırla" },
  archive: { en: "File", tr: "Arşivle" },
  needsAttention: { en: "Needs your decision", tr: "Kararınızı bekliyor" },
  hiddenLow: { en: "Quieted — low value", tr: "Sessizleştirildi — düşük değer" },
  decisionHint: {
    en: "ISURA already analyzed the consequences. You confirm.",
    tr: "ISURA sonuçları analiz etti. Siz onaylayın.",
  },

  // Operational categories
  cat_decision: { en: "Requires decision", tr: "Karar gerektiriyor" },
  cat_risk: { en: "Operational risk", tr: "Operasyonel risk" },
  cat_waiting: { en: "Waiting on others", tr: "Başkalarını bekliyor" },
  cat_low_value: { en: "Low cognitive value", tr: "Düşük bilişsel değer" },
  cat_safe_ignore: { en: "Safe to ignore", tr: "Yok sayılabilir" },

  // Confidence
  conf_high: { en: "High confidence", tr: "Yüksek güven" },
  conf_medium: { en: "Medium confidence", tr: "Orta güven" },
  conf_review: { en: "Needs review", tr: "İnceleme gerekli" },

  // Why this matters
  whyThisMatters: { en: "Why this matters", tr: "Neden önemli" },
  operationalReasoning: { en: "Operational reasoning", tr: "Operasyonel gerekçe" },
  consequenceIfIgnored: { en: "If you do nothing", tr: "Hiçbir şey yapmazsanız" },
  recommendedAction: { en: "Recommended action", tr: "Önerilen eylem" },

  // Reason chips (from heuristics)
  rsn_automated_sender: { en: "Automated sender", tr: "Otomatik gönderici" },
  rsn_no_action_required: { en: "No action required from you", tr: "Sizden eylem gerekmiyor" },
  rsn_service_interruption: { en: "Service interruption risk detected", tr: "Hizmet kesintisi riski tespit edildi" },
  rsn_signature_required: { en: "Signature required", tr: "İmza gerekli" },
  rsn_time_critical: { en: "Time-critical window", tr: "Zaman kritik pencere" },
  rsn_decision_required_today: { en: "Decision required today", tr: "Bugün karar gerekiyor" },
  rsn_blocks_others: { en: "Blocks someone else's work", tr: "Başka birinin işini engelliyor" },
  rsn_substantive_input_needed: { en: "Substantive input needed", tr: "Esaslı katkı gerekli" },
  rsn_affects_outcome: { en: "Affects downstream outcome", tr: "Sonraki sonuçları etkiler" },
  rsn_awaiting_external_response: { en: "Awaiting an external response", tr: "Dış yanıt bekleniyor" },
  rsn_routine_correspondence: { en: "Routine correspondence", tr: "Rutin yazışma" },

  // Cognitive relief metrics
  reliefTitle: { en: "Cognitive relief today", tr: "Bugün bilişsel rahatlama" },
  reliefSubtitle: {
    en: "What ISURA carried so you didn't have to.",
    tr: "Sizin yerinize ISURA'nın taşıdıkları.",
  },
  metric_decisions_simplified: { en: "Decisions simplified", tr: "Basitleştirilen kararlar" },
  metric_risks_detected: { en: "Operational risks detected", tr: "Tespit edilen operasyonel riskler" },
  metric_focus_recovered: { en: "Focus time recovered", tr: "Geri kazanılan odak süresi" },
  metric_pressure_reduced: { en: "Communication pressure reduced", tr: "Azalan iletişim baskısı" },
  metric_load_score: { en: "Cognitive load score", tr: "Bilişsel yük skoru" },
  minutesShort: { en: "min", tr: "dk" },

  // Trust
  trustNoAutoSend: {
    en: "ISURA never sends messages without your approval.",
    tr: "ISURA, onayınız olmadan asla mesaj göndermez.",
  },
  trustReadOnly: {
    en: "Read-only access. Your data stays yours.",
    tr: "Yalnızca okuma erişimi. Verileriniz sizde kalır.",
  },

  // Insight
  insightTitle: { en: "Today's operational insight", tr: "Bugünün operasyonel içgörüsü" },
  insightFocus: {
    en: "Focus only on the decisions with real consequences.",
    tr: "Yalnızca gerçek sonuçları olan kararlara odaklanın.",
  },
  insightLow: {
    en: "Most of your inbox is low cognitive value. ISURA has quieted it.",
    tr: "Gelen kutunuzun çoğu düşük bilişsel değere sahip. ISURA bunları sessizleştirdi.",
  },
  insightHigh: {
    en: "{n} items genuinely require your decision today.",
    tr: "{n} öğe bugün gerçekten kararınızı gerektiriyor.",
  },

  // List & tabs
  emailListTitle: { en: "Today's queue", tr: "Bugünün kuyruğu" },
  viewAll: { en: "All", tr: "Tümü" },
  viewPriority: { en: "Priority", tr: "Öncelik" },
  viewReplies: { en: "Drafts", tr: "Taslaklar" },
  viewLow: { en: "Quieted", tr: "Sessizleştirildi" },
  tab_all: { en: "All", tr: "Tümü" },
  tab_priority: { en: "Priority", tr: "Öncelik" },
  tab_replies: { en: "Drafts", tr: "Taslaklar" },
  tab_low: { en: "Quieted", tr: "Sessizleştirildi" },
  archiveAll: { en: "File all", tr: "Tümünü arşivle" },
  archived: { en: "Filed", tr: "Arşivlendi" },
  restore: { en: "Restore", tr: "Geri al" },
  emptyView: { en: "Nothing here. One less thing to think about.", tr: "Burada bir şey yok. Düşünecek bir şey eksildi." },
  view: { en: "Open", tr: "Aç" },
  reply: { en: "Reply", tr: "Yanıtla" },
  ignore: { en: "Quiet", tr: "Sessizleştir" },
  ignored: { en: "Quieted", tr: "Sessizleştirildi" },
  replied: { en: "Replied", tr: "Yanıtlandı" },
  tab_active: { en: "Active", tr: "Aktif" },
  tab_archived: { en: "Filed", tr: "Arşiv" },
  tab_ignored: { en: "Quieted", tr: "Sessizleştirildi" },
  tab_replied: { en: "Replied", tr: "Yanıtlanan" },
  noEmailsHere: { en: "Nothing here.", tr: "Burada bir şey yok." },
  allCaughtUp: { en: "Operationally clear.", tr: "Operasyonel olarak temiz." },
  ignoredToast: { en: "Quieted.", tr: "Sessizleştirildi." },
  repliedToast: { en: "Sent. ISURA marked it replied.", tr: "Gönderildi. ISURA yanıtlandı olarak işaretledi." },
  restoredOk: { en: "Restored.", tr: "Geri alındı." },

  // Magic moment
  whatChanged: { en: "What changed?", tr: "Ne değişti?" },
  beforeIsura: { en: "Before ISURA", tr: "ISURA'dan önce" },
  afterIsura: { en: "After ISURA", tr: "ISURA'dan sonra" },
  before1: { en: "Inbox overload", tr: "Gelen kutusu yığını" },
  before2: { en: "Constant context switching", tr: "Sürekli bağlam değiştirme" },
  before3: { en: "Decision fatigue", tr: "Karar yorgunluğu" },
  before4: { en: "No prioritization clarity", tr: "Öncelik netliği yok" },
  after1: { en: "Operational consequences surfaced", tr: "Operasyonel sonuçlar öne çıkarıldı" },
  after2: { en: "Drafts awaiting approval", tr: "Onay bekleyen taslaklar" },
  after3: { en: "Reduced cognitive load", tr: "Azaltılmış bilişsel yük" },
  after4: { en: "Structured attention", tr: "Yapılandırılmış dikkat" },

  positioning: {
    en: "ISURA is not an inbox tool. It is the cognition layer for your operations.",
    tr: "ISURA bir gelen kutusu aracı değildir. Operasyonlarınızın biliş katmanıdır.",
  },

  // Detail page
  load: { en: "Category", tr: "Kategori" },
  loadLow: { en: "Low cognitive value", tr: "Düşük bilişsel değer" },
  loadMedium: { en: "Operational risk", tr: "Operasyonel risk" },
  loadHigh: { en: "Requires decision", tr: "Karar gerektiriyor" },
  prUrgent: { en: "Decide today", tr: "Bugün karar ver" },
  prNormal: { en: "Standard", tr: "Standart" },
  prIgnore: { en: "Safe to ignore", tr: "Yok sayılabilir" },
  back: { en: "Back to operations", tr: "Operasyona dön" },
  understanding: { en: "Understanding", tr: "Anlama" },
  summary: { en: "Summary", tr: "Özet" },
  intent: { en: "Intent", tr: "Niyet" },
  decision: { en: "Decision layer", tr: "Karar katmanı" },
  shouldRespond: { en: "Should you respond?", tr: "Yanıt vermeli misiniz?" },
  why: { en: "Reasoning", tr: "Gerekçe" },
  urgency: { en: "Urgency", tr: "Aciliyet" },
  tone: { en: "Tone", tr: "Ton" },
  regenerate: { en: "Regenerate", tr: "Yeniden oluştur" },
  edit: { en: "Edit", tr: "Düzenle" },
  approveSend: { en: "Approve & send", tr: "Onayla ve gönder" },
  thinking: { en: "Reading the situation…", tr: "Durumu okuyor…" },
  yes: { en: "Yes", tr: "Evet" },
  no: { en: "No", tr: "Hayır" },
  delegate: { en: "Delegate", tr: "Devret" },
  language: { en: "Language", tr: "Dil" },
  sentToast: { en: "Sent. One less decision to carry.", tr: "Gönderildi. Taşınacak bir karar daha eksildi." },
  byIsura: { en: "Drafted by ISURA · awaiting your approval", tr: "ISURA tarafından hazırlandı · onayınızı bekliyor" },
};

export function t(lang: Lang, key: keyof typeof dict | string, vars?: Record<string, string | number>): string {
  const entry = dict[key as keyof typeof dict];
  let str = entry?.[lang] ?? (key as string);
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
