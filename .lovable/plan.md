# Kanal Asistanları — Plan

Kullanıcı her kanal için bir asistan seçebilecek (E-posta, WhatsApp, Slack, Telegram) ve ISURA brifingini/özetini bu kanallara **yalnızca gönderecek** (gönder-al değil).

## 1. Uygulama içi seçim arayüzü (harici bağımlılık yok)

`/settings/channels` (veya `/app` içinde bir bölüm) rotası:

- Her kanal için bir kart: **E-posta**, **WhatsApp**, **Slack**, **Telegram**.
- Her kartta:
  - Açık/Kapalı anahtarı (kanalı etkinleştir).
  - Bir **asistan/persona** seçimi (ör. "Operasyonel asistan", "Kısa özet asistanı", "Resmi ton").
  - Kanala özel hedef alanı: WhatsApp telefon (E.164), Slack kanal adı, Telegram chat ID, e-posta adresi.
- Seçimler `localStorage` tabanlı bir store'da tutulur (`channel-settings.ts`), tıpkı mevcut `email-store` gibi.
- i18n (EN/TR) anahtarları eklenir.

Bu adım tek başına çalışır; kullanıcı asistanlarını seçip yapılandırabilir.

## 2. Gönderim altyapısı (bağlantı gerektirir)

"Sadece gönderme" için her kanal sunucu tarafında çağrılır:

- **Slack**: Lovable Slack connector → `chat.postMessage`.
- **Telegram**: Lovable Telegram connector → `sendMessage`.
- **WhatsApp**: Twilio connector → `Messages.json` (WhatsApp from/to).

Her biri için `createServerFn` ile bir gönderim fonksiyonu (`send-briefing.functions.ts`) yazılır; gateway üzerinden çağrı yapar. Brifing metni mevcut `briefing.functions.ts` çıktısından veya seçili asistana göre üretilir.

UI'da "Brifingi gönder" butonu seçili/etkin kanallara metni yollar.

### Gereken kullanıcı aksiyonu
Gerçek gönderim için bağlantıların kurulması gerekir (her biri tek seferlik):
- Slack connector bağlama
- Telegram connector bağlama
- Twilio connector bağlama (WhatsApp için)

Bağlantı kurulmazsa ilgili kanal arayüzde "Bağlantı gerekli" olarak gösterilir.

## Teknik notlar
- Gönderim mantığı sunucu fonksiyonlarında; connector secret'ları `process.env`'den okunur, tarayıcıya sızmaz.
- Girdi doğrulaması (telefon E.164, kanal adı, mesaj uzunluğu) Zod ile yapılır.
- Önce Adım 1 (arayüz) uygulanır; Adım 2 için bağlantıları sırayla bağlamanı isteyeceğim.

## Sıra
1. Seçim arayüzü + store + i18n.
2. Bağlantıları kur (Slack, Telegram, Twilio).
3. Gönderim sunucu fonksiyonları + "Gönder" butonu.
