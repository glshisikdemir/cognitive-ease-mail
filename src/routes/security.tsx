import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, type LegalSection } from "@/components/LegalPage";

export const Route = createFileRoute("/security")({
  head: () => ({
    meta: [
      { title: "Security — ISURA" },
      {
        name: "description",
        content:
          "OAuth-based authentication, encrypted token handling, read-only inbox analysis, and responsible disclosure.",
      },
      { property: "og:title", content: "Security — ISURA" },
      {
        property: "og:description",
        content: "How ISURA is engineered to protect your inbox.",
      },
    ],
  }),
  component: SecurityPage,
});

const sections: LegalSection[] = [
  {
    title: { en: "OAuth-based authentication", tr: "OAuth tabanlı kimlik doğrulama" },
    body: {
      en: (
        <p>
          ISURA never sees your password. You authorize the connection on your
          provider's own page (Google or Microsoft) and we receive a scoped,
          revocable token in return. The same standard your bank, calendar,
          and operating system use.
        </p>
      ),
      tr: (
        <p>
          ISURA şifrenizi asla görmez. Bağlantıyı sağlayıcınızın kendi
          sayfasında (Google veya Microsoft) yetkilendirirsiniz ve karşılığında
          kapsamlı, iptal edilebilir bir token alırız. Bankanızın, takviminizin
          ve işletim sisteminizin kullandığı aynı standart.
        </p>
      ),
    },
  },
  {
    title: { en: "Encrypted token handling", tr: "Şifreli token yönetimi" },
    body: {
      en: (
        <p>
          OAuth tokens are stored encrypted at rest using AES-256, isolated per
          workspace, and rotated automatically. Tokens are never logged or
          exposed to client code. Refresh failures are handled silently — you
          simply re-authorize when needed.
        </p>
      ),
      tr: (
        <p>
          OAuth token'ları AES-256 ile şifrelenerek saklanır, çalışma alanı
          bazında izole edilir ve otomatik döndürülür. Token'lar asla
          loglanmaz veya istemci koduna açılmaz. Yenileme hataları sessizce
          işlenir — gerektiğinde yalnızca yeniden yetki vermeniz yeterlidir.
        </p>
      ),
    },
  },
  {
    title: { en: "Read-only inbox analysis", tr: "Yalnızca okuma gelen kutusu analizi" },
    body: {
      en: (
        <p>
          You can run ISURA in pure read-only mode at any time. In this mode,
          ISURA can analyze and surface — but cannot draft, queue, or send.
          Approval-based mode adds drafting, but every send still requires an
          explicit click from you.
        </p>
      ),
      tr: (
        <p>
          ISURA'yı istediğiniz zaman tamamen yalnızca okuma modunda
          çalıştırabilirsiniz. Bu modda ISURA analiz edip öne çıkarabilir —
          ancak taslak hazırlayamaz, kuyruğa alamaz veya gönderemez. Onay
          tabanlı mod taslak hazırlamayı ekler, ancak her gönderim yine sizin
          açık tıklamanızı gerektirir.
        </p>
      ),
    },
  },
  {
    title: { en: "Secure infrastructure", tr: "Güvenli altyapı" },
    body: {
      en: (
        <p>
          Hosted on a hardened cloud with edge runtimes for compute, a managed
          Postgres database for storage, and TLS 1.3 across all traffic.
          Production access is multi-factor, audited, and limited to a small
          number of named engineers. Backups are encrypted and tested.
        </p>
      ),
      tr: (
        <p>
          Hesaplama için kenar çalışma zamanları, depolama için yönetilen bir
          Postgres veritabanı ve tüm trafikte TLS 1.3 kullanan sertleştirilmiş
          bir bulutta barındırılır. Üretim erişimi çok faktörlüdür, denetlenir
          ve az sayıda belirli mühendisle sınırlıdır. Yedekler şifrelenir ve
          test edilir.
        </p>
      ),
    },
  },
  {
    title: { en: "Access revocation", tr: "Erişim iptali" },
    body: {
      en: (
        <p>
          Disconnect ISURA from inside the product or from your provider's
          security settings. We revoke tokens immediately, stop all background
          processing, and purge stored analysis artifacts within 24 hours.
        </p>
      ),
      tr: (
        <p>
          ISURA'yı ürün içinden veya sağlayıcınızın güvenlik ayarlarından
          ayırın. Token'ları anında iptal eder, tüm arka plan işlemeyi
          durdurur ve saklanan analiz verilerini 24 saat içinde sileriz.
        </p>
      ),
    },
  },
  {
    title: { en: "Responsible disclosure", tr: "Sorumlu güvenlik bildirimi" },
    body: {
      en: (
        <>
          <p>
            If you believe you've found a security issue, please tell us
            privately first. We respond within 48 hours and credit researchers
            who follow good-faith disclosure.
          </p>
          <p>
            Contact:{" "}
            <a className="text-foreground underline-offset-4 hover:underline" href="mailto:security@isura.tech">
              security@isura.tech
            </a>
          </p>
        </>
      ),
      tr: (
        <>
          <p>
            Bir güvenlik sorunu bulduğunuza inanıyorsanız lütfen önce
            gizlice bize bildirin. 48 saat içinde yanıt veririz ve iyi
            niyetli bildirim sürecini izleyen araştırmacıları belirtiriz.
          </p>
          <p>
            İletişim:{" "}
            <a className="text-foreground underline-offset-4 hover:underline" href="mailto:security@isura.tech">
              security@isura.tech
            </a>
          </p>
        </>
      ),
    },
  },
];

function SecurityPage() {
  return (
    <LegalPage
      eyebrowKey="securityEyebrow"
      titleKey="securityTitle"
      subtitleKey="securitySubtitle"
      effective={{ en: "May 11, 2026", tr: "11 Mayıs 2026" }}
      sections={sections}
    />
  );
}
