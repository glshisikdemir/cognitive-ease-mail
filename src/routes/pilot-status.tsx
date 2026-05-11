import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, type LegalSection } from "@/components/LegalPage";

export const Route = createFileRoute("/pilot-status")({
  head: () => ({
    meta: [
      { title: "Pilot status — ISURA" },
      {
        name: "description",
        content:
          "ISURA is in private pilot. What that means for you, today.",
      },
      { property: "og:title", content: "Pilot status — ISURA" },
      {
        property: "og:description",
        content:
          "Features and behavior may evolve during testing. Calmly explained.",
      },
    ],
  }),
  component: PilotStatusPage,
});

const sections: LegalSection[] = [
  {
    title: { en: "We are in private pilot", tr: "Özel pilot sürecindeyiz" },
    body: {
      en: (
        <p>
          ISURA is currently in private pilot. Features and system behavior may
          evolve during testing. We are intentionally onboarding a small group
          of operators so we can iterate carefully and listen closely.
        </p>
      ),
      tr: (
        <p>
          ISURA şu anda özel pilot sürecindedir. Özellikler ve sistem
          davranışları test sürecinde değişebilir. Dikkatlice yineleyip yakından
          dinleyebilmek için bilinçli olarak az sayıda operatörü dahil ediyoruz.
        </p>
      ),
    },
  },
  {
    title: { en: "What may change", tr: "Neler değişebilir" },
    body: {
      en: (
        <ul className="list-disc pl-5 space-y-1">
          <li>UI surface area, naming, and visual hierarchy.</li>
          <li>Heuristics that classify priority, risk, and quietness.</li>
          <li>Approval flows and draft behaviors.</li>
          <li>Onboarding steps and pilot-specific limits.</li>
        </ul>
      ),
      tr: (
        <ul className="list-disc pl-5 space-y-1">
          <li>Arayüz yüzeyi, adlandırma ve görsel hiyerarşi.</li>
          <li>Önceliği, riski ve sessizliği sınıflandıran sezgisel kurallar.</li>
          <li>Onay akışları ve taslak davranışları.</li>
          <li>Başlangıç adımları ve pilota özgü sınırlar.</li>
        </ul>
      ),
    },
  },
  {
    title: { en: "What will not change", tr: "Neler değişmeyecek" },
    body: {
      en: (
        <ul className="list-disc pl-5 space-y-1">
          <li>Approval-first architecture: no action without your click.</li>
          <li>Read-only mode availability.</li>
          <li>No training on your private email content.</li>
          <li>One-click disconnect with token revocation and data purge.</li>
        </ul>
      ),
      tr: (
        <ul className="list-disc pl-5 space-y-1">
          <li>Onay öncelikli mimari: tıklamanız olmadan eylem yok.</li>
          <li>Yalnızca okuma modunun erişilebilirliği.</li>
          <li>Özel e-posta içeriğinizle eğitim yapılmaması.</li>
          <li>Token iptali ve veri silmeyle tek tıkla bağlantı kesme.</li>
        </ul>
      ),
    },
  },
  {
    title: { en: "How we communicate changes", tr: "Değişiklikleri nasıl bildiririz" },
    body: {
      en: (
        <p>
          Material changes to data handling, security, or pricing get a direct
          email with reasonable notice. Smaller product updates are reflected
          in the workspace itself. You can reach us anytime at
          hello@isura.tech.
        </p>
      ),
      tr: (
        <p>
          Veri işleme, güvenlik veya fiyatlandırmadaki önemli değişiklikler için
          makul süre içinde doğrudan e-posta gönderilir. Küçük ürün güncellemeleri
          çalışma alanının içinde yansıtılır. İstediğiniz zaman
          hello@isura.tech adresinden bize ulaşabilirsiniz.
        </p>
      ),
    },
  },
];

function PilotStatusPage() {
  return (
    <LegalPage
      eyebrowKey="pilotPageEyebrow"
      titleKey="pilotPageTitle"
      subtitleKey="pilotPageSubtitle"
      effective={{ en: "May 11, 2026", tr: "11 Mayıs 2026" }}
      sections={sections}
      showPilot={false}
    />
  );
}
