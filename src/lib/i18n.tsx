import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "tr";

type Dict = Record<string, { en: string; tr: string }>;

const dict: Dict = {
  appName: { en: "ISURA", tr: "ISURA" },
  appTagline: { en: "Email Cognitive Assistant", tr: "E-posta Bilişsel Asistanı" },
  inbox: { en: "Inbox", tr: "Gelen Kutusu" },
  briefingTitle: { en: "Today's Cognitive Summary", tr: "Bugünün Bilişsel Özeti" },
  totalEmails: { en: "Total emails", tr: "Toplam e-posta" },
  highPriority: { en: "Need attention", tr: "Dikkat gerektiren" },
  safeIgnore: { en: "Safe to ignore", tr: "Yok sayılabilir" },
  draftsReady: { en: "Drafts ready", tr: "Hazır taslaklar" },
  focusTime: { en: "Suggested focus time", tr: "Önerilen odak süresi" },
  minutes: { en: "min", tr: "dk" },
  briefingNarrative: {
    en: "I read your inbox so you don't have to. Here's what matters today.",
    tr: "Gelen kutunuzu sizin yerinize okudum. Bugün önemli olan bu.",
  },
  load: { en: "Load", tr: "Yük" },
  loadLow: { en: "Low load", tr: "Düşük yük" },
  loadMedium: { en: "Medium load", tr: "Orta yük" },
  loadHigh: { en: "High load", tr: "Yüksek yük" },
  prUrgent: { en: "Urgent", tr: "Acil" },
  prNormal: { en: "Normal", tr: "Normal" },
  prIgnore: { en: "Ignore", tr: "Yok say" },
  back: { en: "Back to inbox", tr: "Gelen kutusuna dön" },
  understanding: { en: "Understanding", tr: "Anlama" },
  summary: { en: "Summary", tr: "Özet" },
  intent: { en: "Intent", tr: "Niyet" },
  decision: { en: "Decision Layer", tr: "Karar Katmanı" },
  shouldRespond: { en: "Should you respond?", tr: "Yanıt vermeli misiniz?" },
  why: { en: "Why", tr: "Neden" },
  urgency: { en: "Urgency", tr: "Aciliyet" },
  reply: { en: "Reply Draft", tr: "Yanıt Taslağı" },
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
  emptyDetail: { en: "Select an email to begin.", tr: "Başlamak için bir e-posta seçin." },
  byIsura: { en: "Drafted by ISURA", tr: "ISURA tarafından hazırlandı" },
};

export function t(lang: Lang, key: keyof typeof dict): string {
  return dict[key]?.[lang] ?? key;
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
