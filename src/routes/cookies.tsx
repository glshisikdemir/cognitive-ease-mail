import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, type LegalSection } from "@/components/LegalPage";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Cookie policy — ISURA" },
      {
        name: "description",
        content: "The small, considered set of cookies ISURA uses, and why.",
      },
      { property: "og:title", content: "Cookie policy — ISURA" },
      {
        property: "og:description",
        content: "Session, authentication, analytics, and preference cookies — explained.",
      },
    ],
  }),
  component: CookiesPage,
});

const sections: LegalSection[] = [
  {
    title: { en: "Session cookies", tr: "Oturum çerezleri" },
    body: {
      en: (
        <p>
          Short-lived cookies that keep you signed in while you use ISURA. They
          expire when you close your browser or sign out. Without them the
          product cannot function.
        </p>
      ),
      tr: (
        <p>
          ISURA'yı kullanırken oturumunuzu açık tutan kısa ömürlü çerezlerdir.
          Tarayıcınızı kapattığınızda veya çıkış yaptığınızda sona ererler.
          Bunlar olmadan ürün çalışamaz.
        </p>
      ),
    },
  },
  {
    title: { en: "Authentication cookies", tr: "Kimlik doğrulama çerezleri" },
    body: {
      en: (
        <p>
          Secure, httpOnly cookies that bind your browser to your authenticated
          workspace. They are required for OAuth flows and to verify each
          request you make.
        </p>
      ),
      tr: (
        <p>
          Tarayıcınızı kimliği doğrulanmış çalışma alanınıza bağlayan güvenli,
          httpOnly çerezlerdir. OAuth akışları için ve yaptığınız her isteğin
          doğrulanması için gereklidir.
        </p>
      ),
    },
  },
  {
    title: { en: "Analytics cookies", tr: "Analitik çerezler" },
    body: {
      en: (
        <p>
          Privacy-respecting, aggregated metrics about page reliability and
          feature usage. We never use third-party advertising trackers, and we
          never track you across other websites.
        </p>
      ),
      tr: (
        <p>
          Sayfa güvenilirliği ve özellik kullanımı hakkında gizliliğe saygılı,
          toplu metriklerdir. Üçüncü taraf reklam izleyicileri kullanmayız ve
          sizi başka sitelerde takip etmeyiz.
        </p>
      ),
    },
  },
  {
    title: { en: "Optional preference cookies", tr: "İsteğe bağlı tercih çerezleri" },
    body: {
      en: (
        <p>
          Remember your language (EN/TR), theme, and minor UI preferences. Safe
          to disable — the product still works, you'll just need to set them
          again next time.
        </p>
      ),
      tr: (
        <p>
          Dilinizi (EN/TR), temanızı ve küçük arayüz tercihlerinizi hatırlar.
          Devre dışı bırakmak güvenlidir — ürün çalışmaya devam eder, yalnızca
          bir sonraki sefer tekrar ayarlamanız gerekir.
        </p>
      ),
    },
  },
  {
    title: { en: "Managing cookies", tr: "Çerez yönetimi" },
    body: {
      en: (
        <p>
          You can clear cookies through your browser at any time. Doing so
          will sign you out and reset your preferences. We do not display
          interruptive banners because we do not use advertising or
          cross-site tracking cookies.
        </p>
      ),
      tr: (
        <p>
          İstediğiniz zaman tarayıcınızdan çerezleri temizleyebilirsiniz. Bu
          işlem sizi çıkış yaptırır ve tercihlerinizi sıfırlar. Reklam veya
          siteler arası izleme çerezleri kullanmadığımız için kesintili
          afişler göstermeyiz.
        </p>
      ),
    },
  },
];

function CookiesPage() {
  return (
    <LegalPage
      eyebrowKey="cookiesEyebrow"
      titleKey="cookiesTitle"
      subtitleKey="cookiesSubtitle"
      effective={{ en: "May 11, 2026", tr: "11 Mayıs 2026" }}
      sections={sections}
    />
  );
}
