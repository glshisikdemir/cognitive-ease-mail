import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, type LegalSection } from "@/components/LegalPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy policy — ISURA" },
      {
        name: "description",
        content:
          "How ISURA collects, processes, and protects the email and operational data you connect.",
      },
      { property: "og:title", content: "Privacy policy — ISURA" },
      {
        property: "og:description",
        content: "Plain-language privacy policy. GDPR and KVKK aligned.",
      },
    ],
  }),
  component: PrivacyPage,
});

const sections: LegalSection[] = [
  {
    title: { en: "What we collect", tr: "Topladığımız veriler" },
    body: {
      en: (
        <>
          <p>
            When you connect a mailbox, ISURA receives the message metadata and
            content needed to perform cognitive analysis: sender, recipients,
            subject, body, timestamps, thread identifiers, and attachment
            filenames. We also store basic account information (your email,
            optional name, company, and role) and product telemetry strictly
            scoped to reliability — not behavioral profiling.
          </p>
        </>
      ),
      tr: (
        <>
          <p>
            Bir posta kutusu bağladığınızda ISURA, bilişsel analiz için gereken
            mesaj meta verilerini ve içeriğini alır: gönderen, alıcılar, konu,
            gövde, zaman damgaları, konu kimlikleri ve ek dosya adları. Ayrıca
            temel hesap bilgilerini (e-posta, isteğe bağlı ad, şirket, rol) ve
            yalnızca güvenilirlik kapsamında ürün telemetrisini saklarız —
            davranışsal profil oluşturma yapılmaz.
          </p>
        </>
      ),
    },
  },
  {
    title: { en: "Why we process it", tr: "Neden işleriz" },
    body: {
      en: (
        <p>
          We process this data for one purpose: to surface real operational
          consequences in your inbox and quiet the rest. We do not profile you,
          we do not sell data, and we do not enrich it with third-party sources.
        </p>
      ),
      tr: (
        <p>
          Bu verileri tek bir amaçla işleriz: gelen kutunuzdaki gerçek
          operasyonel sonuçları öne çıkarıp geri kalanı sessizleştirmek. Profil
          oluşturmayız, veri satmayız ve üçüncü taraf kaynaklarla
          zenginleştirmeyiz.
        </p>
      ),
    },
  },
  {
    title: { en: "Gmail OAuth permissions", tr: "Gmail OAuth izinleri" },
    body: {
      en: (
        <>
          <p>
            ISURA connects to Gmail through Google's official OAuth flow. We
            request the minimum scopes needed: read message metadata and content,
            and (if you enable approval-based replies) prepare drafts that wait
            for your explicit click. We never request "send on your behalf"
            scopes that would allow autonomous sending.
          </p>
          <p>
            Your Google credentials never reach us. You can revoke access at any
            time from your Google account or directly inside ISURA.
          </p>
        </>
      ),
      tr: (
        <>
          <p>
            ISURA, Gmail'e Google'ın resmi OAuth akışı üzerinden bağlanır.
            Yalnızca gerekli minimum izinleri isteriz: mesaj meta verilerini ve
            içeriği okumak ve (onay tabanlı yanıtları etkinleştirirseniz) açık
            tıklamanızı bekleyen taslaklar hazırlamak. Otonom gönderim sağlayan
            "adınıza gönder" izinlerini asla istemeyiz.
          </p>
          <p>
            Google kimlik bilgileriniz bize asla ulaşmaz. Erişimi istediğiniz
            zaman Google hesabınızdan veya doğrudan ISURA içinden iptal
            edebilirsiniz.
          </p>
        </>
      ),
    },
  },
  {
    title: { en: "How AI processes your data", tr: "AI verilerinizi nasıl işler" },
    body: {
      en: (
        <p>
          AI inference runs only when needed to fulfil a live request from your
          workspace. Processing is transient — the provider does not retain your
          message content beyond the call. ISURA never uses your private email
          to train any model: ours, our providers', or anyone else's. This is
          contractual, not optional.
        </p>
      ),
      tr: (
        <p>
          AI çıkarımı yalnızca çalışma alanınızdaki anlık bir isteği karşılamak
          için çalışır. İşleme geçicidir — sağlayıcı, çağrı sonrası mesaj
          içeriğinizi saklamaz. ISURA, özel e-postanızı hiçbir modeli eğitmek
          için kullanmaz: ne bizim ne sağlayıcılarımızın ne de bir başkasının.
          Bu sözleşmeseldir, isteğe bağlı değildir.
        </p>
      ),
    },
  },
  {
    title: { en: "Third-party providers", tr: "Üçüncü taraf sağlayıcılar" },
    body: {
      en: (
        <p>
          ISURA relies on a small set of subprocessors: a managed cloud database,
          a transactional email provider for system messages, and AI inference
          providers bound by zero-retention agreements. A current list is
          available on request to privacy@isura.tech.
        </p>
      ),
      tr: (
        <p>
          ISURA, sınırlı sayıda alt işleyici kullanır: yönetilen bir bulut
          veritabanı, sistem mesajları için işlemsel e-posta sağlayıcısı ve
          sıfır-saklama anlaşmalarıyla bağlı AI çıkarım sağlayıcıları. Güncel
          liste için privacy@isura.tech adresine yazabilirsiniz.
        </p>
      ),
    },
  },
  {
    title: { en: "Storage, encryption, and security", tr: "Depolama, şifreleme ve güvenlik" },
    body: {
      en: (
        <p>
          All traffic is encrypted with TLS 1.3. Stored data is encrypted at
          rest with AES-256. OAuth tokens are isolated per workspace and
          rotated automatically. Production access is restricted, audited, and
          requires multi-factor authentication.
        </p>
      ),
      tr: (
        <p>
          Tüm trafik TLS 1.3 ile şifrelenir. Saklanan veriler beklemede AES-256
          ile şifrelenir. OAuth token'ları çalışma alanı bazında izole edilir
          ve otomatik döndürülür. Üretim erişimi sınırlıdır, denetlenir ve çok
          faktörlü kimlik doğrulama gerektirir.
        </p>
      ),
    },
  },
  {
    title: { en: "Your rights — GDPR and KVKK", tr: "Haklarınız — GDPR ve KVKK" },
    body: {
      en: (
        <p>
          You can request access, correction, export, or deletion of your data
          at any time. Disconnecting your inbox revokes tokens immediately and
          purges stored analysis artifacts within 24 hours. Email
          privacy@isura.tech to exercise any GDPR or KVKK right.
        </p>
      ),
      tr: (
        <p>
          Verilerinize erişim, düzeltme, dışa aktarma veya silme talebinde
          istediğiniz zaman bulunabilirsiniz. Gelen kutunuzu ayırmak token'ları
          anında iptal eder ve saklanan analiz verileri 24 saat içinde silinir.
          Herhangi bir GDPR veya KVKK hakkını kullanmak için
          privacy@isura.tech adresine yazın.
        </p>
      ),
    },
  },
  {
    title: { en: "No training on your private email", tr: "Özel e-postanızla eğitim yapılmaz" },
    body: {
      en: (
        <p>
          To repeat what matters most: your messages are not used to train any
          model — ours, our providers', or anyone else's.
        </p>
      ),
      tr: (
        <p>
          En önemli noktayı tekrarlamak gerekirse: mesajlarınız hiçbir modeli
          eğitmek için kullanılmaz — ne bizim ne sağlayıcılarımızın ne de bir
          başkasının.
        </p>
      ),
    },
  },
];

function PrivacyPage() {
  return (
    <LegalPage
      eyebrowKey="privacyEyebrow"
      titleKey="privacyTitle"
      subtitleKey="privacySubtitle"
      effective={{ en: "May 11, 2026", tr: "11 Mayıs 2026" }}
      sections={sections}
    />
  );
}
