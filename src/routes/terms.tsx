import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, type LegalSection } from "@/components/LegalPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of service — ISURA" },
      {
        name: "description",
        content:
          "The terms governing your use of ISURA during the private pilot — calm, plain, and bilateral.",
      },
      { property: "og:title", content: "Terms of service — ISURA" },
      {
        property: "og:description",
        content: "What ISURA does, what it does not, and your responsibilities.",
      },
    ],
  }),
  component: TermsPage,
});

const sections: LegalSection[] = [
  {
    title: { en: "Service scope and limitations", tr: "Hizmet kapsamı ve sınırları" },
    body: {
      en: (
        <p>
          ISURA is an operational cognition platform currently offered as a
          private pilot. The service may change, pause, or evolve as we refine
          it with pilot users. We will give reasonable notice before any
          material change to data handling.
        </p>
      ),
      tr: (
        <p>
          ISURA, şu anda özel pilot olarak sunulan bir operasyonel biliş
          platformudur. Hizmet, pilot kullanıcılarla geliştirilirken
          değişebilir, duraklatılabilir veya evrilebilir. Veri işlemeye ilişkin
          önemli değişikliklerden önce makul süre içinde bildirimde bulunuruz.
        </p>
      ),
    },
  },
  {
    title: { en: "AI-generated suggestions", tr: "AI tarafından üretilen öneriler" },
    body: {
      en: (
        <p>
          ISURA's analyses, summaries, drafts, and recommendations are
          probabilistic outputs of AI models. They are intended to assist human
          judgment, not replace it. You remain responsible for any decision,
          message, or action you choose to take based on a suggestion.
        </p>
      ),
      tr: (
        <p>
          ISURA'nın analizleri, özetleri, taslakları ve önerileri AI
          modellerinin olasılıksal çıktılarıdır. İnsan kararını desteklemek için
          tasarlanmıştır, yerine geçmez. Bir öneriye dayanarak aldığınız her
          karar, mesaj veya eylemden siz sorumlusunuz.
        </p>
      ),
    },
  },
  {
    title: { en: "Approval-first architecture", tr: "Onay öncelikli mimari" },
    body: {
      en: (
        <p>
          ISURA does not send messages, archive items, or take any externally
          visible action without an explicit click from you. Drafts are queued,
          never auto-fired. This is an architectural commitment, not a setting.
        </p>
      ),
      tr: (
        <p>
          ISURA, sizden açık bir tıklama olmadan dışarıya görünür hiçbir
          eylemde bulunmaz, mesaj göndermez ya da öğe arşivlemez. Taslaklar
          kuyruğa alınır; otomatik tetiklenmez. Bu bir ayar değil, mimari bir
          taahhüttür.
        </p>
      ),
    },
  },
  {
    title: { en: "Your responsibilities", tr: "Sorumluluklarınız" },
    body: {
      en: (
        <p>
          You agree to use ISURA in compliance with the laws applicable to you,
          to respect the confidentiality of messages you process, and to not
          attempt to bypass approval controls or extract data on third parties
          beyond your own communications.
        </p>
      ),
      tr: (
        <p>
          ISURA'yı tabi olduğunuz yasalara uygun şekilde kullanmayı, işlediğiniz
          mesajların gizliliğine saygı göstermeyi ve onay kontrollerini aşmaya
          ya da kendi iletişiminiz dışındaki üçüncü taraflara ait veri elde
          etmeye çalışmamayı kabul edersiniz.
        </p>
      ),
    },
  },
  {
    title: { en: "Acceptable use", tr: "Kabul edilebilir kullanım" },
    body: {
      en: (
        <p>
          ISURA may not be used to harass, defraud, generate unlawful content,
          attempt unauthorized access, or send unsolicited bulk communications.
          We reserve the right to suspend any workspace that violates these
          terms.
        </p>
      ),
      tr: (
        <p>
          ISURA; taciz, dolandırıcılık, yasa dışı içerik üretme, yetkisiz
          erişim girişimleri veya istenmeyen toplu iletişim göndermek için
          kullanılamaz. Bu şartları ihlal eden çalışma alanlarını askıya alma
          hakkımızı saklı tutarız.
        </p>
      ),
    },
  },
  {
    title: { en: "Limitation of liability", tr: "Sorumluluk sınırlaması" },
    body: {
      en: (
        <p>
          During the private pilot, ISURA is provided on an "as is" basis. To
          the maximum extent permitted by law, our liability for any direct,
          indirect, or consequential damages arising from your use of the
          service is limited to the amount you paid us in the prior twelve
          months — which during the pilot is typically zero.
        </p>
      ),
      tr: (
        <p>
          Özel pilot süresince ISURA "olduğu gibi" sağlanır. Yasaların izin
          verdiği azami ölçüde, hizmeti kullanımınızdan kaynaklanan doğrudan,
          dolaylı veya türevsel zararlara ilişkin sorumluluğumuz, son on iki
          ayda bize ödediğiniz tutarla sınırlıdır — bu pilot sürecinde
          genellikle sıfırdır.
        </p>
      ),
    },
  },
  {
    title: { en: "Termination", tr: "Fesih" },
    body: {
      en: (
        <p>
          You may stop using ISURA and disconnect your inbox at any time. We
          may end your access if you materially breach these terms or if the
          pilot concludes. On termination, stored analysis artifacts are
          purged within 24 hours.
        </p>
      ),
      tr: (
        <p>
          ISURA'yı kullanmayı bırakabilir ve gelen kutunuzu istediğiniz zaman
          ayırabilirsiniz. Bu şartları esaslı şekilde ihlal etmeniz veya pilot
          sürecinin sona ermesi halinde erişiminizi sonlandırabiliriz. Fesih
          üzerine, saklanan analiz verileri 24 saat içinde silinir.
        </p>
      ),
    },
  },
];

function TermsPage() {
  return (
    <LegalPage
      eyebrowKey="termsEyebrow"
      titleKey="termsTitle"
      subtitleKey="termsSubtitle"
      effective={{ en: "May 11, 2026", tr: "11 Mayıs 2026" }}
      sections={sections}
    />
  );
}
