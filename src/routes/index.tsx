import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  ShieldCheck,
  Lock,
  Hand,
  Plug,
  Brain,
  Eye,
  Sparkles,
  AlertTriangle,
  Clock,
  Inbox,
} from "lucide-react";
import { useLang, type Lang } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ISURA — Operational clarity for overloaded teams" },
      {
        name: "description",
        content:
          "ISURA is an operational cognition platform. It analyzes communication, prioritizes operational attention, and reduces decision fatigue.",
      },
      { property: "og:title", content: "ISURA — Operational clarity for overloaded teams" },
      {
        property: "og:description",
        content:
          "An operational cognition layer that reduces communication overload and decision fatigue.",
      },
    ],
  }),
  component: LandingPage,
});

/* ----------------------------- i18n (local) ----------------------------- */

type Copy = Record<string, { en: string; tr: string }>;
const L: Copy = {
  navProblem: { en: "Problem", tr: "Sorun" },
  navWhy: { en: "Why ISURA", tr: "Neden ISURA" },
  navHow: { en: "How it works", tr: "Nasıl çalışır" },
  navPreview: { en: "Preview", tr: "Önizleme" },
  navTrust: { en: "Trust", tr: "Güven" },
  navAccess: { en: "Request access", tr: "Erişim iste" },

  heroEyebrow: { en: "Operational cognition platform", tr: "Operasyonel biliş platformu" },
  heroTitle: {
    en: "Operational clarity for overloaded teams.",
    tr: "Aşırı yüklenmiş ekipler için operasyonel netlik.",
  },
  heroSub: {
    en: "ISURA analyzes communication, prioritizes operational attention, and reduces decision fatigue — so people can focus on meaningful work.",
    tr: "ISURA iletişimi analiz eder, operasyonel dikkati önceliklendirir ve karar yorgunluğunu azaltır — böylece insanlar anlamlı işe odaklanır.",
  },
  ctaPrimary: { en: "Request private access", tr: "Özel erişim iste" },
  ctaSecondary: { en: "View product preview", tr: "Ürün önizlemesini gör" },
  heroTrust: {
    en: "ISURA never sends emails without approval.",
    tr: "ISURA, onay olmadan asla e-posta göndermez.",
  },

  problemEyebrow: { en: "The problem", tr: "Sorun" },
  problemTitle: {
    en: "Modern work is dominated by communication overload.",
    tr: "Modern iş, iletişim aşırı yüklemesinin egemenliği altında.",
  },
  problemSub: {
    en: "Fragmented workflows and constant decisions silently consume the attention required for meaningful work.",
    tr: "Parçalanmış iş akışları ve sürekli kararlar, anlamlı iş için gereken dikkati sessizce tüketir.",
  },
  p1t: { en: "Operational pressure", tr: "Operasyonel baskı" },
  p1b: {
    en: "Every message implies a consequence. The pressure to triage them never pauses.",
    tr: "Her mesaj bir sonucu ima eder. Onları ayıklama baskısı asla durmaz.",
  },
  p2t: { en: "Inbox overload", tr: "Gelen kutusu aşırı yükü" },
  p2b: {
    en: "Hundreds of threads compete for attention. Most carry no real consequence.",
    tr: "Yüzlerce konu dikkat için yarışır. Çoğunun gerçek bir sonucu yoktur.",
  },
  p3t: { en: "Mental fragmentation", tr: "Zihinsel parçalanma" },
  p3b: {
    en: "Switching between threads erodes the deep focus operational decisions require.",
    tr: "Konular arası geçiş, operasyonel kararların gerektirdiği derin odağı aşındırır.",
  },
  p4t: { en: "Communication chaos", tr: "İletişim kaosu" },
  p4b: {
    en: "Risks, follow-ups, and waiting threads blur into one undifferentiated stream.",
    tr: "Riskler, takipler ve bekleyen konular tek bir ayrımsız akışta bulanıklaşır.",
  },

  whyEyebrow: { en: "Why ISURA", tr: "Neden ISURA" },
  whyTitle: {
    en: "Not another inbox. Not another copilot.",
    tr: "Başka bir gelen kutusu değil. Başka bir yardımcı pilot değil.",
  },
  whySub: {
    en: "ISURA organizes operational cognition — the decisions, risks, and follow-ups beneath the messages — so attention lands where it matters.",
    tr: "ISURA operasyonel bilişi — mesajların altındaki kararları, riskleri ve takipleri — düzenler; böylece dikkat doğru yere düşer.",
  },
  why1: { en: "Not another inbox.", tr: "Başka bir gelen kutusu değil." },
  why1b: {
    en: "ISURA does not replace your email client. It organizes the decisions inside it.",
    tr: "ISURA e-posta istemcinizi değiştirmez. İçindeki kararları düzenler.",
  },
  why2: { en: "Not another AI copilot.", tr: "Başka bir AI yardımcı pilot değil." },
  why2b: {
    en: "You do not prompt ISURA. It quietly surfaces what carries operational consequence.",
    tr: "ISURA'ya komut vermezsiniz. Operasyonel sonuç doğuranı sessizce öne çıkarır.",
  },
  why3: { en: "Not another automation tool.", tr: "Başka bir otomasyon aracı değil." },
  why3b: {
    en: "No rules. No workflows. ISURA reasons about each thread, then waits for your judgement.",
    tr: "Kural yok. İş akışı yok. ISURA her konuyu değerlendirir, sonra sizin kararınızı bekler.",
  },

  howEyebrow: { en: "How it works", tr: "Nasıl çalışır" },
  howTitle: { en: "From connection to clarity, in four steps.", tr: "Bağlantıdan netliğe, dört adımda." },
  s1: { en: "Connect inbox securely", tr: "Gelen kutusunu güvenle bağlayın" },
  s1b: {
    en: "OAuth-only. Read-only mode available. Your credentials never reach us.",
    tr: "Yalnızca OAuth. Salt okunur mod mevcut. Kimlik bilgileriniz bize ulaşmaz.",
  },
  s2: { en: "ISURA analyzes operational importance", tr: "ISURA operasyonel önemi analiz eder" },
  s2b: {
    en: "Every thread is read for consequence, urgency, and downstream impact.",
    tr: "Her konu; sonuç, aciliyet ve sonraki etki için okunur.",
  },
  s3: { en: "Receive operational clarity", tr: "Operasyonel netliği alın" },
  s3b: {
    en: "A calm briefing of decisions, risks, follow-ups — and a suggested next action for each.",
    tr: "Kararlar, riskler, takipler için sakin bir brifing — ve her biri için önerilen sonraki adım.",
  },
  s4: { en: "Stay fully in control", tr: "Tam kontrolde kalın" },
  s4b: {
    en: "Nothing is sent on your behalf. Approval is always required, always yours.",
    tr: "Adınıza hiçbir şey gönderilmez. Onay daima gereklidir, daima sizindir.",
  },

  prevEyebrow: { en: "Product preview", tr: "Ürün önizlemesi" },
  prevTitle: { en: "An operational layer, quietly applied.", tr: "Sessizce uygulanan operasyonel bir katman." },
  prevBriefingTitle: { en: "Daily operational briefing", tr: "Günlük operasyonel brifing" },
  prevBriefing1: { en: "2 urgent threads require decisions", tr: "2 acil konu kararınızı bekliyor" },
  prevBriefing2: { en: "1 contract-related operational risk", tr: "1 sözleşme kaynaklı operasyonel risk" },
  prevBriefing3: { en: "4 low-priority interruptions filtered", tr: "4 düşük öncelikli kesinti süzüldü" },
  prevBriefing4: { en: "3 responses prepared, awaiting approval", tr: "3 yanıt hazırlandı, onayınızı bekliyor" },
  prevReliefTitle: { en: "Cognitive relief today", tr: "Bugün bilişsel rahatlama" },
  prevReliefMetric: { en: "Estimated focus time recovered", tr: "Tahmini odak süresi kazanımı" },
  prevReliefValue: { en: "1.8h", tr: "1.8 sa" },
  prevRiskTitle: { en: "Operational risk detected", tr: "Operasyonel risk tespit edildi" },
  prevRiskBody: {
    en: "Northwind contract renewal — counter-signature window closes today.",
    tr: "Northwind sözleşme yenilemesi — karşı imza penceresi bugün kapanıyor.",
  },
  prevDecisionTitle: { en: "Decision simplified", tr: "Karar basitleştirildi" },
  prevDecisionBody: {
    en: "Sarah needs your countersignature on the renewed contract before 18:00.",
    tr: "Sarah, yenilenen sözleşmeye karşı imzanızı 18:00'den önce bekliyor.",
  },

  trustEyebrow: { en: "Trust architecture", tr: "Güven mimarisi" },
  trustTitle: { en: "Built so the most cautious operator can use it.", tr: "En temkinli kullanıcının bile kullanabileceği biçimde tasarlandı." },
  t1: { en: "Approval-first architecture", tr: "Önce onay mimarisi" },
  t1b: { en: "Nothing is sent without an explicit click from you.", tr: "Sizden açık bir tıklama olmadan hiçbir şey gönderilmez." },
  t2: { en: "Read-only analysis mode", tr: "Salt okunur analiz modu" },
  t2b: { en: "Run ISURA without ever granting send permissions.", tr: "Gönderme izni vermeden ISURA'yı çalıştırın." },
  t3: { en: "Encryption in transit and at rest", tr: "İletim ve depolamada şifreleme" },
  t3b: { en: "TLS 1.3 in transit. AES-256 at rest. Tokens isolated per workspace.", tr: "İletimde TLS 1.3. Beklemede AES-256. Token'lar çalışma alanı bazında izole." },
  t4: { en: "Disconnect anytime", tr: "İstediğiniz zaman bağlantıyı kesin" },
  t4b: { en: "Tokens revoked instantly. Stored data purged within 24 hours.", tr: "Token'lar anında iptal. Saklanan veriler 24 saat içinde silinir." },
  t5: { en: "No training on private emails", tr: "Özel e-postalarla eğitim yapılmaz" },
  t5b: { en: "Contractual zero-retention with every model provider.", tr: "Her model sağlayıcısıyla sözleşmesel sıfır-saklama." },
  trustLink: { en: "Read the full trust architecture", tr: "Tam güven mimarisini okuyun" },

  visionEyebrow: { en: "Founder vision", tr: "Kurucu vizyonu" },
  visionTitle: {
    en: "Operational complexity is the silent tax on modern work.",
    tr: "Operasyonel karmaşıklık, modern işin sessiz vergisidir.",
  },
  visionBody: {
    en: "We believe the next decade of software will not add more surfaces to manage. It will quietly remove them. ISURA is built so judgement remains human — and the cognitive overhead surrounding it does not.",
    tr: "Yazılımın önümüzdeki on yılında yönetilecek yeni yüzeyler eklenmeyecek; mevcutlar sessizce kaldırılacak. ISURA, kararın insana ait kalması ve etrafındaki bilişsel yükün kalmaması için tasarlandı.",
  },
  visionSig: { en: "— The ISURA team", tr: "— ISURA ekibi" },

  finalEyebrow: { en: "Private pilot", tr: "Özel pilot" },
  finalTitle: {
    en: "Your inbox should not control your brain.",
    tr: "Gelen kutunuz beyninizi kontrol etmemeli.",
  },
  finalSub: {
    en: "We are onboarding a small group of operators, founders, and teams. Joining is free during the pilot.",
    tr: "Az sayıda operatör, kurucu ve ekibi karşılıyoruz. Pilot süresince katılım ücretsizdir.",
  },
  finalCta: { en: "Join private pilot", tr: "Özel pilota katıl" },
  finalPlaceholder: { en: "you@work.com", tr: "siz@isiniz.com" },
  finalSent: { en: "Thank you. We'll be in touch shortly.", tr: "Teşekkürler. Kısa süre içinde size ulaşacağız." },
  footerCopy: { en: "© ISURA. Operational cognition, quietly applied.", tr: "© ISURA. Operasyonel biliş, sessizce uygulanır." },
  footerAccess: { en: "Open workspace", tr: "Çalışma alanını aç" },
  footerTrust: { en: "Trust & security", tr: "Güven ve güvenlik" },
};
const tr = (lang: Lang, k: keyof typeof L) => L[k][lang];

/* ----------------------------- Page ----------------------------- */

function LandingPage() {
  const { lang } = useLang();
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <Nav lang={lang} />
      <Hero lang={lang} />
      <Problem lang={lang} />
      <Why lang={lang} />
      <How lang={lang} />
      <Preview lang={lang} />
      <Trust lang={lang} />
      <Vision lang={lang} />
      <FinalCTA lang={lang} />
      <Footer lang={lang} />
    </div>
  );
}

/* ----------------------------- Nav ----------------------------- */

function Nav({ lang }: { lang: Lang }) {
  const { setLang } = useLang();
  return (
    <header className="sticky top-0 z-30 border-b border-border/50 bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-foreground text-background">
            <span className="font-display text-sm font-semibold leading-none">I</span>
          </span>
          <span className="text-sm font-semibold tracking-tight">ISURA</span>
        </Link>

        <nav className="hidden items-center gap-7 text-[13px] text-muted-foreground md:flex">
          <a href="#problem" className="transition-colors hover:text-foreground">{tr(lang, "navProblem")}</a>
          <a href="#why" className="transition-colors hover:text-foreground">{tr(lang, "navWhy")}</a>
          <a href="#how" className="transition-colors hover:text-foreground">{tr(lang, "navHow")}</a>
          <a href="#preview" className="transition-colors hover:text-foreground">{tr(lang, "navPreview")}</a>
          <a href="#trust" className="transition-colors hover:text-foreground">{tr(lang, "navTrust")}</a>
        </nav>

        <div className="flex items-center gap-2">
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
          <a
            href="#access"
            className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-[12px] font-medium text-background transition hover:opacity-90"
          >
            {tr(lang, "navAccess")}
            <ArrowRight className="h-3 w-3" />
          </a>
        </div>
      </div>
    </header>
  );
}

/* ----------------------------- Hero ----------------------------- */

function Hero({ lang }: { lang: Lang }) {
  return (
    <section className="relative overflow-hidden border-b border-border/50">
      {/* ambient gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[-30%] h-[70%] opacity-60"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, color-mix(in oklab, var(--primary) 14%, transparent), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-4xl px-6 pb-24 pt-24 text-center sm:pt-32">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {tr(lang, "heroEyebrow")}
        </div>
        <h1 className="mt-7 font-display text-[44px] leading-[1.05] tracking-tight sm:text-6xl">
          {tr(lang, "heroTitle")}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:text-lg">
          {tr(lang, "heroSub")}
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#access"
            className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-90"
          >
            {tr(lang, "ctaPrimary")}
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
          <a
            href="#preview"
            className="rounded-md border border-border bg-surface px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-surface-muted"
          >
            {tr(lang, "ctaSecondary")}
          </a>
        </div>
        <p className="mt-6 inline-flex items-center gap-1.5 text-[12px] text-muted-foreground">
          <ShieldCheck className="h-3 w-3" />
          {tr(lang, "heroTrust")}
        </p>
      </div>
    </section>
  );
}

/* ----------------------------- Problem ----------------------------- */

function Problem({ lang }: { lang: Lang }) {
  const items = [
    { t: "p1t", b: "p1b" },
    { t: "p2t", b: "p2b" },
    { t: "p3t", b: "p3b" },
    { t: "p4t", b: "p4b" },
  ] as const;
  return (
    <section id="problem" className="border-b border-border/50">
      <div className="mx-auto max-w-5xl px-6 py-24 sm:py-28">
        <div className="max-w-2xl">
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {tr(lang, "problemEyebrow")}
          </div>
          <h2 className="mt-3 font-display text-3xl leading-tight tracking-tight sm:text-4xl">
            {tr(lang, "problemTitle")}
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
            {tr(lang, "problemSub")}
          </p>
        </div>
        <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/40 sm:grid-cols-2">
          {items.map((it) => (
            <li key={it.t} className="bg-background p-7">
              <div className="text-[12px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {tr(lang, it.t)}
              </div>
              <p className="mt-3 text-[15px] leading-relaxed text-foreground">{tr(lang, it.b)}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ----------------------------- Why ISURA ----------------------------- */

function Why({ lang }: { lang: Lang }) {
  const rows = [
    { t: "why1", b: "why1b" },
    { t: "why2", b: "why2b" },
    { t: "why3", b: "why3b" },
  ] as const;
  return (
    <section id="why" className="border-b border-border/50 bg-surface/40">
      <div className="mx-auto max-w-5xl px-6 py-24 sm:py-28">
        <div className="max-w-2xl">
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {tr(lang, "whyEyebrow")}
          </div>
          <h2 className="mt-3 font-display text-3xl leading-tight tracking-tight sm:text-4xl">
            {tr(lang, "whyTitle")}
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
            {tr(lang, "whySub")}
          </p>
        </div>
        <div className="mt-12 grid gap-3 md:grid-cols-3">
          {rows.map((r) => (
            <div
              key={r.t}
              className="rounded-2xl border border-border/60 bg-background p-7"
            >
              <h3 className="font-display text-lg tracking-tight text-foreground">{tr(lang, r.t)}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{tr(lang, r.b)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- How it works ----------------------------- */

function How({ lang }: { lang: Lang }) {
  const steps = [
    { icon: Plug, t: "s1", b: "s1b" },
    { icon: Brain, t: "s2", b: "s2b" },
    { icon: Sparkles, t: "s3", b: "s3b" },
    { icon: Hand, t: "s4", b: "s4b" },
  ] as const;
  return (
    <section id="how" className="border-b border-border/50">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-28">
        <div className="max-w-2xl">
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {tr(lang, "howEyebrow")}
          </div>
          <h2 className="mt-3 font-display text-3xl leading-tight tracking-tight sm:text-4xl">
            {tr(lang, "howTitle")}
          </h2>
        </div>
        <ol className="mt-12 grid gap-3 md:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.t} className="rounded-2xl border border-border/60 bg-surface p-6">
              <div className="flex items-center justify-between">
                <span className="font-display text-sm tabular-nums text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <s.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <h3 className="mt-6 font-display text-[15px] leading-snug text-foreground">
                {tr(lang, s.t)}
              </h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                {tr(lang, s.b)}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ----------------------------- Preview ----------------------------- */

function Preview({ lang }: { lang: Lang }) {
  return (
    <section id="preview" className="border-b border-border/50 bg-surface/30">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-28">
        <div className="max-w-2xl">
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {tr(lang, "prevEyebrow")}
          </div>
          <h2 className="mt-3 font-display text-3xl leading-tight tracking-tight sm:text-4xl">
            {tr(lang, "prevTitle")}
          </h2>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-12">
          {/* Briefing card — wide */}
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-background shadow-sm lg:col-span-7">
            <div className="flex items-center gap-2 border-b border-border/60 px-5 py-3">
              <Inbox className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                {tr(lang, "prevBriefingTitle")}
              </span>
            </div>
            <ul className="divide-y divide-border/60">
              {[
                { Icon: AlertTriangle, txt: tr(lang, "prevBriefing1") },
                { Icon: ShieldCheck, txt: tr(lang, "prevBriefing2") },
                { Icon: Eye, txt: tr(lang, "prevBriefing3") },
                { Icon: Sparkles, txt: tr(lang, "prevBriefing4") },
              ].map((row, i) => (
                <li key={i} className="flex items-center gap-3 px-5 py-3.5">
                  <span className="grid h-7 w-7 place-items-center rounded-full border border-border/70 bg-surface">
                    <row.Icon className="h-3.5 w-3.5 text-foreground" />
                  </span>
                  <span className="text-[14px] text-foreground">{row.txt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Relief metric */}
          <div className="rounded-2xl border border-border/60 bg-background p-6 lg:col-span-5">
            <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              {tr(lang, "prevReliefTitle")}
            </div>
            <div className="mt-6 flex items-end gap-3">
              <span className="font-display text-5xl leading-none tracking-tight text-foreground">
                {tr(lang, "prevReliefValue")}
              </span>
              <span className="pb-1.5 text-[12px] text-muted-foreground">
                {tr(lang, "prevReliefMetric")}
              </span>
            </div>
            <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-surface-muted">
              <div className="h-full w-[72%] rounded-full bg-foreground/80" />
            </div>
          </div>

          {/* Risk card */}
          <div className="rounded-2xl border border-border/60 bg-background p-6 lg:col-span-6">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              <AlertTriangle className="h-3 w-3" />
              {tr(lang, "prevRiskTitle")}
            </div>
            <p className="mt-3 text-[15px] leading-relaxed text-foreground">
              {tr(lang, "prevRiskBody")}
            </p>
            <div className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-surface px-2.5 py-0.5 text-[11px] text-muted-foreground">
              <Clock className="h-3 w-3" />
              {lang === "en" ? "Closes today · 18:00" : "Bugün kapanır · 18:00"}
            </div>
          </div>

          {/* Decision card */}
          <div className="rounded-2xl border border-border/60 bg-background p-6 lg:col-span-6">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              <Sparkles className="h-3 w-3" />
              {tr(lang, "prevDecisionTitle")}
            </div>
            <p className="mt-3 text-[15px] leading-relaxed text-foreground">
              {tr(lang, "prevDecisionBody")}
            </p>
            <div className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-surface px-2.5 py-0.5 text-[11px] text-muted-foreground">
              <Hand className="h-3 w-3" />
              {lang === "en" ? "Approval required" : "Onay gerekli"}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Trust ----------------------------- */

function Trust({ lang }: { lang: Lang }) {
  const pillars = [
    { Icon: Hand, t: "t1", b: "t1b" },
    { Icon: Eye, t: "t2", b: "t2b" },
    { Icon: Lock, t: "t3", b: "t3b" },
    { Icon: Plug, t: "t4", b: "t4b" },
    { Icon: ShieldCheck, t: "t5", b: "t5b" },
  ] as const;
  return (
    <section id="trust" className="border-b border-border/50">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-28">
        <div className="max-w-2xl">
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {tr(lang, "trustEyebrow")}
          </div>
          <h2 className="mt-3 font-display text-3xl leading-tight tracking-tight sm:text-4xl">
            {tr(lang, "trustTitle")}
          </h2>
        </div>
        <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p) => (
            <li
              key={p.t}
              className="rounded-2xl border border-border/60 bg-surface p-6"
            >
              <span className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-background">
                <p.Icon className="h-4 w-4 text-foreground" />
              </span>
              <h3 className="mt-5 font-display text-[15px] tracking-tight text-foreground">
                {tr(lang, p.t)}
              </h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                {tr(lang, p.b)}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <Link
            to="/trust"
            className="inline-flex items-center gap-1.5 text-[13px] text-foreground underline-offset-4 hover:underline"
          >
            {tr(lang, "trustLink")}
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Vision ----------------------------- */

function Vision({ lang }: { lang: Lang }) {
  return (
    <section className="border-b border-border/50 bg-surface/40">
      <div className="mx-auto max-w-3xl px-6 py-24 sm:py-28">
        <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          {tr(lang, "visionEyebrow")}
        </div>
        <h2 className="mt-3 font-display text-3xl leading-snug tracking-tight sm:text-[34px]">
          {tr(lang, "visionTitle")}
        </h2>
        <p className="mt-6 text-[16px] leading-relaxed text-muted-foreground">
          {tr(lang, "visionBody")}
        </p>
        <p className="mt-8 text-[13px] tracking-wide text-muted-foreground">
          {tr(lang, "visionSig")}
        </p>
      </div>
    </section>
  );
}

/* ----------------------------- Final CTA ----------------------------- */

function FinalCTA({ lang }: { lang: Lang }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return;
    setSent(true);
  };
  return (
    <section id="access" className="border-b border-border/50">
      <div className="relative mx-auto max-w-4xl px-6 py-28 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-full opacity-60"
          style={{
            background:
              "radial-gradient(50% 60% at 50% 50%, color-mix(in oklab, var(--primary) 10%, transparent), transparent 70%)",
          }}
        />
        <div className="relative">
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {tr(lang, "finalEyebrow")}
          </div>
          <h2 className="mt-3 font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl">
            {tr(lang, "finalTitle")}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            {tr(lang, "finalSub")}
          </p>

          {sent ? (
            <p className="mt-9 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-[13px] text-foreground">
              <ShieldCheck className="h-3.5 w-3.5" />
              {tr(lang, "finalSent")}
            </p>
          ) : (
            <form
              onSubmit={submit}
              className="mx-auto mt-9 flex w-full max-w-md items-center gap-2 rounded-full border border-border bg-background p-1 shadow-sm"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={tr(lang, "finalPlaceholder")}
                className="flex-1 bg-transparent px-4 py-2 text-[14px] text-foreground placeholder:text-muted-foreground/70 outline-none"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-[13px] font-medium text-background transition hover:opacity-90"
              >
                {tr(lang, "finalCta")}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>
          )}

          <p className="mt-5 text-[12px] text-muted-foreground">
            {tr(lang, "heroTrust")}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Footer ----------------------------- */

function Footer({ lang }: { lang: Lang }) {
  return (
    <footer>
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-10 text-[12px] text-muted-foreground sm:flex-row sm:items-center">
        <p>{tr(lang, "footerCopy")}</p>
        <div className="flex items-center gap-5">
          <Link to="/trust" className="hover:text-foreground">
            {tr(lang, "footerTrust")}
          </Link>
          <Link to="/app" className="hover:text-foreground">
            {tr(lang, "footerAccess")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
