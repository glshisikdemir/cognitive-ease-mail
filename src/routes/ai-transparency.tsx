import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, type LegalSection } from "@/components/LegalPage";

export const Route = createFileRoute("/ai-transparency")({
  head: () => ({
    meta: [
      { title: "AI transparency — ISURA" },
      {
        name: "description",
        content:
          "What ISURA's AI analyzes, what it never does, and how every operational suggestion reaches you.",
      },
      { property: "og:title", content: "AI transparency — ISURA" },
      {
        property: "og:description",
        content: "ISURA never takes action without user approval.",
      },
    ],
  }),
  component: AITransparencyPage,
});

const sections: LegalSection[] = [
  {
    title: { en: "What ISURA's AI analyzes", tr: "ISURA'nın AI'ı neyi analiz eder" },
    body: {
      en: (
        <ul className="list-disc pl-5 space-y-1">
          <li>The text and metadata of messages in your connected mailbox.</li>
          <li>Sender reputation patterns inferred from your own thread history.</li>
          <li>Time-sensitive language, decision cues, and risk signals in content.</li>
          <li>Reply patterns to surface threads waiting on you or on others.</li>
        </ul>
      ),
      tr: (
        <ul className="list-disc pl-5 space-y-1">
          <li>Bağlı posta kutunuzdaki mesajların metni ve meta verileri.</li>
          <li>Kendi yazışma geçmişinizden çıkarılan gönderici örüntüleri.</li>
          <li>İçerikteki zamana duyarlı ifadeler, karar işaretleri ve risk sinyalleri.</li>
          <li>Sizi veya başkalarını bekleyen konuları öne çıkarmak için yanıt örüntüleri.</li>
        </ul>
      ),
    },
  },
  {
    title: { en: "What ISURA's AI never does", tr: "ISURA'nın AI'ı asla neyi yapmaz" },
    body: {
      en: (
        <ul className="list-disc pl-5 space-y-1">
          <li>Send, archive, or delete messages without your explicit click.</li>
          <li>Train any model on your private email content.</li>
          <li>Profile you, score you, or share your data with advertisers.</li>
          <li>Operate autonomously — there is no agent loop running on your inbox.</li>
        </ul>
      ),
      tr: (
        <ul className="list-disc pl-5 space-y-1">
          <li>Açık tıklamanız olmadan mesaj gönderme, arşivleme veya silme.</li>
          <li>Özel e-posta içeriğinizle herhangi bir modeli eğitme.</li>
          <li>Profil çıkarma, puanlama veya verilerinizi reklamcılarla paylaşma.</li>
          <li>Otonom çalışma — gelen kutunuzda çalışan bir ajan döngüsü yoktur.</li>
        </ul>
      ),
    },
  },
  {
    title: { en: "When user approval is required", tr: "Kullanıcı onayı ne zaman gerekir" },
    body: {
      en: (
        <p>
          Every outbound action — sending a draft, archiving, marking
          something as resolved, or any externally visible side effect —
          requires an explicit click from you. There is no "auto-send",
          "auto-archive", or background reply mode.
        </p>
      ),
      tr: (
        <p>
          Her dışa yönelik eylem — taslak göndermek, arşivlemek, çözüldü
          olarak işaretlemek veya dışarıya görünür herhangi bir yan etki —
          sizden açık bir tıklama gerektirir. "Otomatik gönder", "otomatik
          arşivle" veya arka plan yanıt modu yoktur.
        </p>
      ),
    },
  },
  {
    title: {
      en: "How operational suggestions are generated",
      tr: "Operasyonel öneriler nasıl üretilir",
    },
    body: {
      en: (
        <p>
          ISURA combines deterministic heuristics (sender, recency, language
          cues) with LLM-based reasoning over the relevant message context.
          Confidence is shown alongside each suggestion. When confidence is
          low, ISURA says so rather than guessing assertively.
        </p>
      ),
      tr: (
        <p>
          ISURA, belirleyici sezgisel kuralları (gönderici, yenilik, dil
          işaretleri) ilgili mesaj bağlamı üzerinde LLM tabanlı muhakemeyle
          birleştirir. Her öneriyle birlikte güven düzeyi gösterilir. Güven
          düşük olduğunda ISURA, kararlı bir tahmin yerine bunu açıkça belirtir.
        </p>
      ),
    },
  },
  {
    title: { en: "The line we will not cross", tr: "Aşmayacağımız çizgi" },
    body: {
      en: (
        <p className="text-foreground font-medium">
          ISURA never takes action without user approval.
        </p>
      ),
      tr: (
        <p className="text-foreground font-medium">
          ISURA, kullanıcı onayı olmadan asla eylemde bulunmaz.
        </p>
      ),
    },
  },
];

function AITransparencyPage() {
  return (
    <LegalPage
      eyebrowKey="aiEyebrow"
      titleKey="aiTitle"
      subtitleKey="aiSubtitle"
      effective={{ en: "May 11, 2026", tr: "11 Mayıs 2026" }}
      sections={sections}
    />
  );
}
