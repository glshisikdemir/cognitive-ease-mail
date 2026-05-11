import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Hand,
  Eye,
  Lock,
  Plug,
  Mail,
  Sparkles,
  AlertTriangle,
  Clock,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
} from "lucide-react";
import { useLang, type Lang } from "@/lib/i18n";
import { PilotNotice } from "@/components/PilotNotice";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Welcome to ISURA" },
      {
        name: "description",
        content: "A calm, transparent onboarding for your operational cognition workspace.",
      },
    ],
  }),
  component: OnboardingPage,
});

/* ----------------------------- i18n ----------------------------- */

type Copy = Record<string, { en: string; tr: string }>;
const L: Copy = {
  step: { en: "Step", tr: "Adım" },
  of: { en: "of", tr: "/" },
  back: { en: "Back", tr: "Geri" },
  continue: { en: "Continue", tr: "Devam et" },
  skip: { en: "Skip for now", tr: "Şimdilik geç" },
  finish: { en: "Open my workspace", tr: "Çalışma alanımı aç" },

  // 1 — Welcome
  welcomeEyebrow: { en: "Welcome", tr: "Hoş geldiniz" },
  welcomeTitle: { en: "Your inbox should not control your brain.", tr: "Gelen kutunuz beyninizi kontrol etmemeli." },
  welcomeBody: {
    en: "ISURA quietly reduces operational overload and decision fatigue, so the attention you spend on email returns to the work that matters.",
    tr: "ISURA, operasyonel aşırı yükü ve karar yorgunluğunu sessizce azaltır; e-postaya harcadığınız dikkat anlamlı işe geri döner.",
  },
  welcomeBegin: { en: "Begin", tr: "Başla" },
  welcomeTakes: { en: "Takes about a minute. You can leave at any step.", tr: "Yaklaşık bir dakika. İstediğiniz adımda çıkabilirsiniz." },

  // 2 — Trust
  trustEyebrow: { en: "Trust architecture", tr: "Güven mimarisi" },
  trustTitle: { en: "You stay in control. Always.", tr: "Kontrol her zaman sizde kalır." },
  trustBody: {
    en: "Before connecting your inbox, here is exactly what ISURA will and will not do.",
    tr: "Gelen kutunuzu bağlamadan önce ISURA'nın ne yapacağı ve ne yapmayacağı:",
  },
  t1t: { en: "Never sends without approval", tr: "Onay olmadan asla göndermez" },
  t1b: { en: "Drafts are queued and only dispatched when you click approve.", tr: "Taslaklar kuyruğa alınır; yalnızca onayladığınızda gönderilir." },
  t2t: { en: "Read-only analysis available", tr: "Salt okunur analiz mevcut" },
  t2b: { en: "Run ISURA without ever granting send permissions.", tr: "Gönderme izni vermeden ISURA'yı çalıştırabilirsiniz." },
  t3t: { en: "Disconnect anytime", tr: "İstediğiniz zaman bağlantıyı kesin" },
  t3b: { en: "Tokens revoked instantly. Stored data purged within 24 hours.", tr: "Token'lar anında iptal. Saklanan veriler 24 saat içinde silinir." },
  t4t: { en: "Encrypted end-to-end", tr: "Uçtan uca şifreli" },
  t4b: { en: "TLS 1.3 in transit. AES-256 at rest. No training on private data.", tr: "İletimde TLS 1.3. Beklemede AES-256. Özel verilerle eğitim yapılmaz." },

  // 3 — OAuth permissions
  oauthEyebrow: { en: "Permissions, in plain language", tr: "Sade dille izinler" },
  oauthTitle: { en: "What ISURA will see — and what it won't.", tr: "ISURA'nın göreceği — ve görmeyeceği." },
  oauthBody: {
    en: "You authorize ISURA on Google's own page. We never see or store your password.",
    tr: "Yetkiyi Google'ın kendi sayfasında verirsiniz. Şifrenizi asla görmez veya saklamayız.",
  },
  permYes: { en: "What ISURA needs", tr: "ISURA neye ihtiyaç duyar" },
  permNo: { en: "What ISURA will never request", tr: "ISURA asla istemez" },
  perm_y1: { en: "Read message metadata and content", tr: "Mesaj üst verisi ve içeriğini okuma" },
  perm_y1b: { en: "To assess operational consequence and prepare drafts.", tr: "Operasyonel sonucu değerlendirmek ve taslak hazırlamak için." },
  perm_y2: { en: "Compose drafts in your account", tr: "Hesabınızda taslak oluşturma" },
  perm_y2b: { en: "Drafts are saved, never sent without your approval.", tr: "Taslaklar kaydedilir; onayınız olmadan gönderilmez." },
  perm_n1: { en: "Your password", tr: "Şifreniz" },
  perm_n1b: { en: "OAuth never reveals your credentials to ISURA.", tr: "OAuth kimlik bilgilerinizi ISURA'ya hiçbir zaman vermez." },
  perm_n2: { en: "Permission to send autonomously", tr: "Bağımsız gönderme izni" },
  perm_n2b: { en: "Sending always requires an explicit click from you.", tr: "Gönderim her zaman sizden açık bir tıklama gerektirir." },
  modeChoose: { en: "Choose how to connect", tr: "Nasıl bağlanacağınızı seçin" },
  modeFull: { en: "Standard mode", tr: "Standart mod" },
  modeFullDesc: { en: "Read + draft replies for approval. Recommended.", tr: "Okuma + onay için taslak. Önerilir." },
  modeRead: { en: "Read-only mode", tr: "Salt okunur mod" },
  modeReadDesc: { en: "Analysis only. No drafts created in your account.", tr: "Yalnızca analiz. Hesabınızda taslak oluşturulmaz." },
  connectGoogle: { en: "Continue with Google", tr: "Google ile devam et" },
  connectMicrosoft: { en: "Continue with Microsoft", tr: "Microsoft ile devam et" },

  // 4 — Analysis
  analyzeEyebrow: { en: "Analyzing", tr: "Analiz ediliyor" },
  analyzeTitle: { en: "ISURA is reading your operational signals.", tr: "ISURA operasyonel sinyallerinizi okuyor." },
  analyzeBody: {
    en: "Communication patterns, urgency cues, and downstream consequences are being assessed. This stays on calm, not loud.",
    tr: "İletişim örüntüleri, aciliyet ipuçları ve sonraki etkiler değerlendiriliyor. Bu süreç sakin, gürültüsüz.",
  },
  a_step1: { en: "Reading thread metadata", tr: "Konu üst verisi okunuyor" },
  a_step2: { en: "Identifying decisions and risks", tr: "Karar ve riskler tanımlanıyor" },
  a_step3: { en: "Filtering low-priority interruptions", tr: "Düşük öncelikli kesintiler süzülüyor" },
  a_step4: { en: "Preparing your operational briefing", tr: "Operasyonel brifinginiz hazırlanıyor" },

  // 5 — First briefing
  briefEyebrow: { en: "Your first briefing", tr: "İlk brifinginiz" },
  briefTitle: { en: "Here's what your day actually looks like.", tr: "İşte gününüz gerçekten böyle." },
  briefBody: {
    en: "A calm summary of what carries consequence today. Everything else has been quieted.",
    tr: "Bugün sonuç doğuranların sakin bir özeti. Geri kalan sessizleştirildi.",
  },
  brief_urgent: { en: "urgent threads require decisions", tr: "acil konu kararınızı bekliyor" },
  brief_risk: { en: "operational risk detected", tr: "operasyonel risk tespit edildi" },
  brief_filtered: { en: "low-priority interruptions filtered", tr: "düşük öncelikli kesinti süzüldü" },
  brief_drafts: { en: "responses prepared, awaiting approval", tr: "yanıt hazırlandı, onayınızı bekliyor" },
  reliefLabel: { en: "Estimated focus time recovered today", tr: "Bugün kazanılan tahmini odak süresi" },

  // 6 — Control
  ctrlEyebrow: { en: "You're in control", tr: "Kontrol sizde" },
  ctrlTitle: { en: "You remain fully in control of every action.", tr: "Her eylemin tam kontrolü sizdedir." },
  ctrlBody: {
    en: "ISURA suggests. You decide. Nothing leaves your account without your approval — even on routine threads.",
    tr: "ISURA önerir. Siz karar verirsiniz. Rutin konularda bile onayınız olmadan hesabınızdan hiçbir şey çıkmaz.",
  },
  c1: { en: "Switch to read-only any time", tr: "İstediğiniz zaman salt okunur moda geçin" },
  c2: { en: "Pause analysis with one click", tr: "Tek tıkla analizi duraklatın" },
  c3: { en: "Disconnect and purge data anytime", tr: "İstediğiniz zaman bağlantıyı kesip verileri silin" },
};
const tr = (lang: Lang, k: keyof typeof L) => L[k][lang];

/* ----------------------------- Page ----------------------------- */

const STEPS = 6;

function OnboardingPage() {
  const { lang, setLang } = useLang();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<"full" | "read">("full");

  const next = () => setStep((s) => Math.min(STEPS, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));
  const finish = () => navigate({ to: "/app" });

  return (
    <div className="surface-veil min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border/50 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-foreground text-background">
              <span className="font-display text-sm font-semibold leading-none">I</span>
            </span>
            <span className="text-sm font-semibold tracking-tight">ISURA</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-[11px] uppercase tracking-[0.18em] text-muted-foreground sm:inline">
              {tr(lang, "step")} {step} {tr(lang, "of")} {STEPS}
            </span>
            <div className="flex items-center gap-0.5 rounded-full border border-border/70 bg-surface p-0.5 text-[11px]">
              <button
                onClick={() => setLang("en")}
                className={`rounded-full px-2 py-0.5 transition-colors ${lang === "en" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
              >
                EN
              </button>
              <button
                onClick={() => setLang("tr")}
                className={`rounded-full px-2 py-0.5 transition-colors ${lang === "tr" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
              >
                TR
              </button>
            </div>
          </div>
        </div>
        <Progress step={step} />
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-24 pt-12 sm:pt-20">
        <div key={step} className="animate-fade-up">
          {step === 1 && <Welcome lang={lang} onNext={next} />}
          {step === 2 && <Trust lang={lang} />}
          {step === 3 && <OAuth lang={lang} mode={mode} setMode={setMode} onConnect={next} />}
          {step === 4 && <Analyzing lang={lang} onDone={next} />}
          {step === 5 && <Briefing lang={lang} />}
          {step === 6 && <Control lang={lang} />}
        </div>

        {step > 1 && step !== 4 && (
          <div className="mt-12 flex items-center justify-between">
            <button onClick={back} className="btn-ghost">
              <ArrowLeft className="h-3.5 w-3.5" />
              {tr(lang, "back")}
            </button>
            <button
              onClick={step === STEPS ? finish : next}
              className="btn-primary"
            >
              {step === STEPS ? tr(lang, "finish") : tr(lang, "continue")}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

/* ----------------------------- Progress ----------------------------- */

function Progress({ step }: { step: number }) {
  const pct = (step / STEPS) * 100;
  return (
    <div className="h-px w-full bg-border/60">
      <div
        className="h-px bg-foreground transition-[width] duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)]"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/* ----------------------------- 1 · Welcome ----------------------------- */

function Welcome({ lang, onNext }: { lang: Lang; onNext: () => void }) {
  return (
    <section className="text-center">
      <Eyebrow>{tr(lang, "welcomeEyebrow")}</Eyebrow>
      <h1 className="mt-4 font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl">
        {tr(lang, "welcomeTitle")}
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
        {tr(lang, "welcomeBody")}
      </p>
      <div className="mx-auto mt-8 max-w-md">
        <PilotNotice variant="banner" />
      </div>
      <div className="mt-8 flex items-center justify-center">
        <button onClick={onNext} className="btn-primary">
          {tr(lang, "welcomeBegin")}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
      <p className="mt-5 text-[12px] text-muted-foreground">{tr(lang, "welcomeTakes")}</p>
    </section>
  );
}

/* ----------------------------- 2 · Trust ----------------------------- */

function Trust({ lang }: { lang: Lang }) {
  const pillars = [
    { Icon: Hand, t: "t1t", b: "t1b" },
    { Icon: Eye, t: "t2t", b: "t2b" },
    { Icon: Plug, t: "t3t", b: "t3b" },
    { Icon: Lock, t: "t4t", b: "t4b" },
  ] as const;
  return (
    <section>
      <Eyebrow>{tr(lang, "trustEyebrow")}</Eyebrow>
      <h2 className="mt-4 font-display text-3xl leading-tight tracking-tight sm:text-4xl">
        {tr(lang, "trustTitle")}
      </h2>
      <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
        {tr(lang, "trustBody")}
      </p>
      <ul className="stagger mt-10 grid gap-3 sm:grid-cols-2">
        {pillars.map((p) => (
          <li key={p.t} className="card-soft p-6">
            <span className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-background">
              <p.Icon className="h-4 w-4 text-foreground" />
            </span>
            <h3 className="mt-5 font-display text-[16px] tracking-tight text-foreground">{tr(lang, p.t)}</h3>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">{tr(lang, p.b)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ----------------------------- 3 · OAuth ----------------------------- */

function OAuth({
  lang,
  mode,
  setMode,
  onConnect,
}: {
  lang: Lang;
  mode: "full" | "read";
  setMode: (m: "full" | "read") => void;
  onConnect: () => void;
}) {
  const yes = [
    { t: "perm_y1", b: "perm_y1b" },
    { t: "perm_y2", b: "perm_y2b" },
  ] as const;
  const no = [
    { t: "perm_n1", b: "perm_n1b" },
    { t: "perm_n2", b: "perm_n2b" },
  ] as const;
  return (
    <section>
      <Eyebrow>{tr(lang, "oauthEyebrow")}</Eyebrow>
      <h2 className="mt-4 font-display text-3xl leading-tight tracking-tight sm:text-4xl">
        {tr(lang, "oauthTitle")}
      </h2>
      <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
        {tr(lang, "oauthBody")}
      </p>

      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        <div className="card-soft p-6">
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-emerald-700/80">
            <Check className="h-3.5 w-3.5" />
            {tr(lang, "permYes")}
          </div>
          <ul className="mt-5 space-y-4">
            {yes.map((p) => (
              <li key={p.t}>
                <div className="text-[14px] font-medium text-foreground">{tr(lang, p.t)}</div>
                <div className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{tr(lang, p.b)}</div>
              </li>
            ))}
          </ul>
        </div>
        <div className="card-soft p-6">
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            <Lock className="h-3.5 w-3.5" />
            {tr(lang, "permNo")}
          </div>
          <ul className="mt-5 space-y-4">
            {no.map((p) => (
              <li key={p.t}>
                <div className="text-[14px] font-medium text-foreground">{tr(lang, p.t)}</div>
                <div className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{tr(lang, p.b)}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8">
        <div className="eyebrow">{tr(lang, "modeChoose")}</div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {(
            [
              { key: "full", t: "modeFull", b: "modeFullDesc" },
              { key: "read", t: "modeRead", b: "modeReadDesc" },
            ] as const
          ).map((m) => {
            const active = mode === m.key;
            return (
              <button
                key={m.key}
                onClick={() => setMode(m.key)}
                className={`rounded-xl border p-4 text-left transition-all ${
                  active
                    ? "border-foreground bg-surface shadow-[var(--shadow-sm)]"
                    : "border-border bg-surface/60 hover:border-border-strong"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[13.5px] font-medium text-foreground">{tr(lang, m.t)}</span>
                  <span
                    className={`grid h-4 w-4 place-items-center rounded-full border ${
                      active ? "border-foreground bg-foreground" : "border-border"
                    }`}
                  >
                    {active && <Check className="h-2.5 w-2.5 text-background" />}
                  </span>
                </div>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">{tr(lang, m.b)}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button onClick={onConnect} className="btn-primary">
          <Mail className="h-3.5 w-3.5" />
          {tr(lang, "connectGoogle")}
        </button>
        <button onClick={onConnect} className="btn-secondary">
          {tr(lang, "connectMicrosoft")}
        </button>
      </div>
      <p className="mt-4 inline-flex items-center gap-1.5 text-[12px] text-muted-foreground">
        <ShieldCheck className="h-3 w-3" />
        {lang === "en"
          ? "You'll authorize ISURA on your provider's own page."
          : "Yetkiyi sağlayıcınızın kendi sayfasında vereceksiniz."}
      </p>
    </section>
  );
}

/* ----------------------------- 4 · Analyzing ----------------------------- */

function Analyzing({ lang, onDone }: { lang: Lang; onDone: () => void }) {
  const steps = ["a_step1", "a_step2", "a_step3", "a_step4"] as const;
  const [i, setI] = useState(0);
  useEffect(() => {
    if (i >= steps.length) {
      const t = window.setTimeout(onDone, 600);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setI((v) => v + 1), 850);
    return () => window.clearTimeout(t);
  }, [i, onDone, steps.length]);

  return (
    <section className="text-center">
      <Eyebrow>{tr(lang, "analyzeEyebrow")}</Eyebrow>
      <h2 className="mt-4 font-display text-3xl leading-tight tracking-tight sm:text-4xl">
        {tr(lang, "analyzeTitle")}
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
        {tr(lang, "analyzeBody")}
      </p>

      <ul className="mx-auto mt-10 max-w-md space-y-2 text-left">
        {steps.map((s, idx) => {
          const done = idx < i;
          const active = idx === i;
          return (
            <li
              key={s}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-300 ${
                done
                  ? "border-border bg-surface text-foreground"
                  : active
                  ? "border-foreground/30 bg-surface text-foreground"
                  : "border-border/60 bg-surface/40 text-muted-foreground"
              }`}
            >
              <span className="grid h-6 w-6 place-items-center rounded-full border border-border bg-background">
                {done ? (
                  <Check className="h-3 w-3 text-foreground" />
                ) : active ? (
                  <Loader2 className="h-3 w-3 animate-spin text-foreground" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-border-strong" />
                )}
              </span>
              <span className={`text-[13.5px] ${active ? "animate-shimmer-soft" : ""}`}>
                {tr(lang, s)}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ----------------------------- 5 · Briefing ----------------------------- */

function Briefing({ lang }: { lang: Lang }) {
  const rows = [
    { Icon: AlertTriangle, n: 2, k: "brief_urgent" },
    { Icon: ShieldCheck, n: 1, k: "brief_risk" },
    { Icon: Eye, n: 4, k: "brief_filtered" },
    { Icon: Sparkles, n: 3, k: "brief_drafts" },
  ] as const;
  return (
    <section>
      <Eyebrow>{tr(lang, "briefEyebrow")}</Eyebrow>
      <h2 className="mt-4 font-display text-3xl leading-tight tracking-tight sm:text-4xl">
        {tr(lang, "briefTitle")}
      </h2>
      <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
        {tr(lang, "briefBody")}
      </p>

      <div className="card-soft mt-10 overflow-hidden">
        <ul className="stagger divide-y divide-border/60">
          {rows.map((r, idx) => (
            <li key={idx} className="flex items-center gap-4 px-6 py-4">
              <span className="grid h-8 w-8 place-items-center rounded-full border border-border bg-surface">
                <r.Icon className="h-3.5 w-3.5 text-foreground" />
              </span>
              <span className="font-display text-2xl tabular-nums text-foreground">{r.n}</span>
              <span className="text-[14px] text-muted-foreground">{tr(lang, r.k)}</span>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between gap-4 border-t border-border/60 bg-surface-muted/60 px-6 py-4">
          <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            {tr(lang, "reliefLabel")}
          </div>
          <span className="font-display text-2xl tracking-tight text-foreground">1.8h</span>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- 6 · Control ----------------------------- */

function Control({ lang }: { lang: Lang }) {
  const items = ["c1", "c2", "c3"] as const;
  return (
    <section>
      <Eyebrow>{tr(lang, "ctrlEyebrow")}</Eyebrow>
      <h2 className="mt-4 font-display text-3xl leading-tight tracking-tight sm:text-4xl">
        {tr(lang, "ctrlTitle")}
      </h2>
      <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
        {tr(lang, "ctrlBody")}
      </p>
      <ul className="stagger mt-10 space-y-2">
        {items.map((k) => (
          <li
            key={k}
            className="flex items-center gap-3 rounded-xl border border-border bg-surface px-5 py-3.5"
          >
            <span className="grid h-6 w-6 place-items-center rounded-full bg-foreground text-background">
              <Check className="h-3 w-3" />
            </span>
            <span className="text-[14px] text-foreground">{tr(lang, k)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ----------------------------- helpers ----------------------------- */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="eyebrow">{children}</div>;
}
