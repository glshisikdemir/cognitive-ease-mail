import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "tr";

type Dict = Record<string, { en: string; tr: string }>;

const dict: Dict = {
  // Operational sections
  workspaceTitle: { en: "Operational workspace", tr: "Operasyonel çalışma alanı" },
  workspaceSubtitle: {
    en: "Organized by what each thread asks of you — not by folders.",
    tr: "Klasörlere göre değil, her konunun sizden istediğine göre düzenlendi.",
  },
  sec_decision: { en: "Requires your decision", tr: "Kararınızı bekliyor" },
  sec_decision_sub: {
    en: "Open items where the next move is yours.",
    tr: "Bir sonraki adım sizde olan açık konular.",
  },
  sec_risk: { en: "Operational risks", tr: "Operasyonel riskler" },
  sec_risk_sub: {
    en: "Threads with downstream consequences if left untouched.",
    tr: "Ele alınmazsa sonraki sonuçları etkileyecek konular.",
  },
  sec_waiting: { en: "Waiting on others", tr: "Karşı taraftan bekleniyor" },
  sec_waiting_sub: {
    en: "Tracked so you don't have to remember.",
    tr: "Hatırlamak zorunda kalmayın diye takip ediliyor.",
  },
  sec_followup: { en: "Follow-up risks", tr: "Takip riskleri" },
  sec_followup_sub: {
    en: "External responses overdue. A nudge may be in order.",
    tr: "Dış yanıtlar gecikti. Hatırlatma uygun olabilir.",
  },
  sec_review: { en: "Ready to review", tr: "İncelemeye hazır" },
  sec_review_sub: {
    en: "Drafts ISURA prepared. Approve and send when you choose.",
    tr: "ISURA'nın hazırladığı taslaklar. Hazır olduğunuzda onaylayın.",
  },
  sec_low: { en: "Low cognitive value", tr: "Düşük zihinsel öncelik" },
  sec_low_sub: {
    en: "Routine and automated noise. Quieted by default.",
    tr: "Rutin ve otomatik gürültü. Varsayılan olarak sessizleştirildi.",
  },
  sec_resolved: { en: "Resolved today", tr: "Bugün çözüldü" },
  sec_resolved_sub: {
    en: "Filed, replied, or quieted in this session.",
    tr: "Bu oturumda arşivlenen, yanıtlanan veya sessizleştirilen.",
  },
  sec_empty: { en: "Nothing here right now.", tr: "Şu anda burada bir şey yok." },
  sec_collapse: { en: "Collapse", tr: "Daralt" },
  sec_expand: { en: "Expand", tr: "Genişlet" },
  sugg_label: { en: "Suggested next action", tr: "Önerilen sonraki adım" },
  urg_label: { en: "Why now", tr: "Neden şimdi" },
  sugg_decide_today: { en: "Open and decide before end of day.", tr: "Açın ve gün bitmeden karar verin." },
  sugg_review_risk: { en: "Review the risk and confirm an action.", tr: "Riski inceleyin ve bir eylem belirleyin." },
  sugg_send_nudge: { en: "Send a brief nudge or update.", tr: "Kısa bir hatırlatma veya güncelleme gönderin." },
  sugg_approve_draft: { en: "Approve the prepared draft.", tr: "Hazırlanan taslağı onaylayın." },
  sugg_let_quiet: { en: "Let it stay quiet. No action needed.", tr: "Sessiz kalsın. Eylem gerekmiyor." },
  sugg_archive: { en: "File and move on.", tr: "Arşivleyin ve devam edin." },
  urg_today: { en: "Time-critical window today.", tr: "Bugün zaman kritik pencere." },
  urg_consequence: { en: "Inaction has operational consequences.", tr: "Eylemsizlik operasyonel sonuçlar doğurur." },
  urg_overdue: { en: "Response window has lapsed.", tr: "Yanıt süresi aşıldı." },
  urg_routine: { en: "Routine — no urgency detected.", tr: "Rutin — aciliyet algılanmadı." },
  urg_drafted: { en: "Draft ready since you opened it.", tr: "Açtığınızdan beri taslak hazır." },

  // Trust & security
  trustPage: { en: "Trust & security", tr: "Güven ve güvenlik" },
  trustHeroLabel: { en: "Trust architecture", tr: "Güven mimarisi" },
  trustHeroTitle: {
    en: "You stay in control. ISURA only assists.",
    tr: "Kontrol sizde kalır. ISURA yalnızca yardımcı olur.",
  },
  trustHeroSub: {
    en: "Every line of access, every action, and every reply is bound to your explicit approval.",
    tr: "Her erişim, her eylem ve her yanıt yalnızca açık onayınıza bağlıdır.",
  },
  trustPillarApproval: { en: "Human approval required", tr: "İnsan onayı gerekli" },
  trustPillarReadOnly: { en: "Read-only mode available", tr: "Yalnızca okuma modu mevcuttur" },
  trustPillarDisconnect: { en: "Disconnect anytime", tr: "İstediğiniz zaman bağlantıyı kesin" },
  trustPillarNoTraining: { en: "No training on your data", tr: "Verileriniz eğitim için kullanılmaz" },
  trustPersistentNoSend: {
    en: "ISURA never sends emails without your approval.",
    tr: "ISURA, onayınız olmadan asla e-posta göndermez.",
  },
  trustPersistentControl: { en: "You stay in control.", tr: "Kontrol sizde kalır." },
  trustPersistentReadOnly: {
    en: "Read-only analysis mode available.",
    tr: "Yalnızca okuma modu mevcuttur.",
  },
  trustPersistentDisconnect: { en: "Disconnect anytime.", tr: "İstediğiniz zaman bağlantıyı kesin." },
  trustS1Title: { en: "How ISURA accesses your email", tr: "ISURA e-postanıza nasıl erişir" },
  trustS1Body: {
    en: "ISURA connects through your provider's official OAuth flow. We never see, store, or request your password. The connection is scoped to the minimum permissions needed for cognitive analysis.",
    tr: "ISURA, sağlayıcınızın resmi OAuth akışı üzerinden bağlanır. Şifrenizi asla göremez, saklayamaz veya istemeyiz. Bağlantı, bilişsel analiz için gereken en az izinle sınırlıdır.",
  },
  trustS2Title: { en: "OAuth, in plain language", tr: "Sade dille OAuth" },
  trustS2Body: {
    en: "OAuth is the same standard your bank, calendar, and operating system use. You authorize ISURA on Google's or Microsoft's own page — your credentials never reach us.",
    tr: "OAuth; bankanızın, takviminizin ve işletim sisteminizin kullandığı aynı standarttır. Yetkiyi Google veya Microsoft'un kendi sayfasında verirsiniz — kimlik bilgileriniz bize asla ulaşmaz.",
  },
  trustS3Title: { en: "Encryption in transit and at rest", tr: "İletim ve depolamada şifreleme" },
  trustS3Body: {
    en: "All traffic is encrypted with TLS 1.3. Stored analysis artifacts are encrypted at rest using AES-256. Access tokens are isolated per workspace and rotated automatically.",
    tr: "Tüm trafik TLS 1.3 ile şifrelenir. Saklanan analiz verileri AES-256 ile beklemede şifrelenir. Erişim token'ları çalışma alanı bazında izole edilir ve otomatik döndürülür.",
  },
  trustS4Title: { en: "Human approval architecture", tr: "İnsan onayı mimarisi" },
  trustS4Body: {
    en: "ISURA prepares drafts. You approve them. Nothing is ever sent on your behalf without an explicit click. Replies are queued, never auto-fired — even on routine threads.",
    tr: "ISURA taslakları hazırlar. Siz onaylarsınız. Açık bir tıklama olmadan adınıza hiçbir şey gönderilmez. Yanıtlar kuyruğa alınır; rutin yazışmalarda bile otomatik gönderilmez.",
  },
  trustS5Title: { en: "Data privacy", tr: "Veri gizliliği" },
  trustS5Body: {
    en: "Your messages remain yours. ISURA processes content only to serve the live request. We do not sell, share, or expose your data to third parties beyond the AI inference provider bound by strict zero-retention agreements.",
    tr: "Mesajlarınız size aittir. ISURA içeriği yalnızca anlık isteğinize hizmet etmek için işler. Verilerinizi üçüncü taraflarla satmaz, paylaşmaz veya ifşa etmez; AI sağlayıcıları sıkı sıfır-saklama anlaşmalarıyla bağlıdır.",
  },
  trustS6Title: { en: "No training on your private email", tr: "Özel e-postanızla eğitim yapılmaz" },
  trustS6Body: {
    en: "Your emails are never used to train any model — ours, our providers', or anyone else's. This is contractual, not optional.",
    tr: "E-postalarınız hiçbir modeli eğitmek için kullanılmaz — ne bizim ne de sağlayıcılarımızın. Bu sözleşmeseldir, isteğe bağlı değildir.",
  },
  trustS7Title: { en: "Permission management", tr: "İzin yönetimi" },
  trustS7Body: {
    en: "Switch to read-only mode at any time. Pause analysis. Disconnect your account in one click — your tokens are revoked immediately and stored artifacts are purged within 24 hours.",
    tr: "İstediğiniz zaman yalnızca okuma moduna geçin. Analizi duraklatın. Hesabınızı tek tıkla kesin — token'larınız anında iptal edilir ve saklanan veriler 24 saat içinde silinir.",
  },
  trustClosingTitle: { en: "Calm, transparent, controlled.", tr: "Sakin, şeffaf, kontrollü." },
  trustClosingBody: {
    en: "ISURA is built so the most cautious operator can use it without hesitation.",
    tr: "ISURA, en temkinli kullanıcının bile tereddütsüz kullanabileceği biçimde tasarlandı.",
  },
  trustViewSecurity: { en: "View trust & security", tr: "Güven ve güvenliği görüntüle" },
  trustModeReadOnly: { en: "Read-only mode", tr: "Yalnızca okuma modu" },
  trustModeApproval: { en: "Approval required", tr: "Onay gerekli" },

  // Daily briefing
  dailyBriefing: { en: "Daily operational briefing", tr: "Günlük operasyonel brifing" },
  greet_morning: { en: "Good morning.", tr: "Günaydın." },
  greet_afternoon: { en: "Good afternoon.", tr: "İyi günler." },
  greet_evening: { en: "Good evening.", tr: "İyi akşamlar." },
  greet_night: { en: "Working late.", tr: "Geç saatler." },
  briefing_intro: {
    en: "ISURA analyzed your inbox and organized your operational attention.",
    tr: "ISURA gelen kutunuzu analiz etti ve operasyonel dikkatinizi düzenledi.",
  },
  brief_urgent: {
    en: "{n} urgent threads require decisions.",
    tr: "{n} acil konu kararınızı bekliyor.",
  },
  brief_risks: {
    en: "{n} contract-related operational risk detected.",
    tr: "{n} sözleşme kaynaklı operasyonel risk tespit edildi.",
  },
  brief_waiting: {
    en: "{n} threads waiting on others — follow-up risk.",
    tr: "{n} konu başkalarını bekliyor — takip riski.",
  },
  brief_filtered: {
    en: "{n} low-priority interruptions filtered.",
    tr: "{n} düşük öncelikli kesinti süzüldü.",
  },
  brief_drafts: {
    en: "{n} responses prepared and waiting for your approval.",
    tr: "{n} yanıt hazırlandı, onayınızı bekliyor.",
  },
  brief_clear: {
    en: "Nothing urgent. Your operational queue is calm.",
    tr: "Acil bir şey yok. Operasyon kuyruğunuz sakin.",
  },
  brief_load_label: { en: "Estimated mental load reduced", tr: "Tahmini bilişsel yük azalması" },
  brief_load_value: { en: "{h}h recovered", tr: "{h} sa geri kazanıldı" },
  brief_closing: {
    en: "Begin with what carries consequence. ISURA holds the rest.",
    tr: "Sonuç doğuranla başlayın. Geri kalanı ISURA tutar.",
  },
  brief_closing_calm: {
    en: "Use this stillness. Deep work belongs to you today.",
    tr: "Bu sakinliği kullanın. Bugün derin çalışma sizin.",
  },

  appName: { en: "ISURA", tr: "ISURA" },
  appTagline: { en: "Operational cognition, quietly applied.", tr: "Operasyonel biliş, sessizce uygulanır." },
  inbox: { en: "Operations", tr: "Operasyon" },
  settings: { en: "Settings", tr: "Ayarlar" },
  connected: { en: "Connected: Gmail", tr: "Bağlı: Gmail" },
  offline: { en: "Offline", tr: "Çevrimdışı" },
  syncing: { en: "Syncing…", tr: "Eşitleniyor…" },

  // Hero
  heroTitle: { en: "Your operations are under control.", tr: "Operasyonlarınız kontrol altında." },
  heroSubtitle: {
    en: "ISURA reads every message, surfaces real consequences, and quiets the rest.",
    tr: "ISURA her mesajı okur, gerçek sonuçları öne çıkarır, geri kalanı sessizleştirir.",
  },
  viewAllEmails: { en: "View all messages", tr: "Tüm mesajları gör" },
  hiddenMinimized: { en: "Quieted", tr: "Sessizleştirildi" },
  emailPreviewTitle: { en: "Latest in your operations queue", tr: "Operasyon kuyruğundaki en yeniler" },
  emailsToday: { en: "Messages received today", tr: "Bugün gelen mesajlar" },
  highPriority: { en: "Requires decision", tr: "Karar gerektiriyor" },
  mediumPriority: { en: "Operational risk", tr: "Operasyonel risk" },
  lowPriority: { en: "Low cognitive value", tr: "Düşük zihinsel öncelik" },
  draftsReady: { en: "Drafts awaiting your approval", tr: "Onayınızı bekleyen taslaklar" },

  // Primary actions
  reviewPriority: { en: "Open priority queue", tr: "Öncelik kuyruğunu aç" },
  seeReplies: { en: "Review approved drafts", tr: "Hazır taslakları incele" },
  archiveLow: { en: "Quiet low-value messages", tr: "Düşük değerli mesajları sessizleştir" },
  archivedToast: { en: "Quieted {n} low-value messages.", tr: "{n} düşük değerli mesaj sessizleştirildi." },
  archivedOneToast: { en: "Filed. One less thing to think about.", tr: "Arşivlendi. Düşünecek bir şey daha eksildi." },
  restoredToast: { en: "Restored to operations queue.", tr: "Operasyon kuyruğuna geri alındı." },
  archiveEmpty: { en: "Nothing to quiet right now.", tr: "Sessizleştirilecek bir şey yok." },
  undo: { en: "Undo", tr: "Geri al" },

  // Priority review
  priorityReviewLabel: { en: "Priority queue", tr: "Öncelik kuyruğu" },
  priorityHeading: {
    en: "{n} items need a decision from you.",
    tr: "{n} öğe sizden karar bekliyor.",
  },
  priorityHeadingSub: {
    en: "Estimated focus time: about {min} minutes. Take them one at a time.",
    tr: "Tahmini odak süresi: yaklaşık {min} dakika. Birer birer ele alın.",
  },
  priorityCleared: { en: "Operationally clear.", tr: "Operasyonel olarak temiz." },
  priorityClearedSub: {
    en: "Nothing demands a decision. Use this time well.",
    tr: "Karar gerektiren bir şey yok. Bu zamanı iyi kullanın.",
  },
  openAndDecide: { en: "Open & decide", tr: "Aç ve karar ver" },
  nothingUrgent: { en: "Queue at zero.", tr: "Kuyrukta hiçbir şey yok." },
  nothingUrgentSub: {
    en: "ISURA found no operational risks or pending decisions right now.",
    tr: "ISURA şu anda operasyonel risk veya bekleyen karar bulamadı.",
  },
  backToDashboard: { en: "Back to operations", tr: "Operasyona dön" },
  generateReply: { en: "Draft a response", tr: "Yanıt hazırla" },
  archive: { en: "File", tr: "Arşivle" },
  needsAttention: { en: "Needs your decision", tr: "Kararınızı bekliyor" },
  hiddenLow: { en: "Quieted — low value", tr: "Sessizleştirildi — düşük değer" },
  decisionHint: {
    en: "ISURA already analyzed the consequences. You confirm.",
    tr: "ISURA sonuçları analiz etti. Siz onaylayın.",
  },

  // Operational categories
  cat_decision: { en: "Requires decision", tr: "Karar gerektiriyor" },
  cat_risk: { en: "Operational risk", tr: "Operasyonel risk" },
  cat_waiting: { en: "Waiting on others", tr: "Karşı taraftan bekleniyor" },
  cat_low_value: { en: "Low cognitive value", tr: "Düşük zihinsel öncelik" },
  cat_safe_ignore: { en: "Safe to ignore", tr: "Yok sayılabilir" },

  // Confidence
  conf_high: { en: "High confidence", tr: "Yüksek güven" },
  conf_medium: { en: "Medium confidence", tr: "Orta güven" },
  conf_review: { en: "Needs review", tr: "İnceleme gerekli" },

  // Why this matters
  whyThisMatters: { en: "Why this matters", tr: "Neden önemli" },
  operationalReasoning: { en: "Operational reasoning", tr: "Operasyonel gerekçe" },
  consequenceIfIgnored: { en: "If you do nothing", tr: "Hiçbir şey yapmazsanız" },
  recommendedAction: { en: "Recommended action", tr: "Önerilen eylem" },

  // Reason chips (from heuristics)
  rsn_automated_sender: { en: "Automated sender", tr: "Otomatik gönderici" },
  rsn_no_action_required: { en: "No action required from you", tr: "Sizden eylem gerekmiyor" },
  rsn_service_interruption: { en: "Service interruption risk detected", tr: "Hizmet kesintisi riski tespit edildi" },
  rsn_signature_required: { en: "Signature required", tr: "İmza gerekli" },
  rsn_time_critical: { en: "Time-critical window", tr: "Zaman kritik pencere" },
  rsn_decision_required_today: { en: "Decision required today", tr: "Bugün karar gerekiyor" },
  rsn_blocks_others: { en: "Blocks someone else's work", tr: "Başka birinin işini engelliyor" },
  rsn_substantive_input_needed: { en: "Substantive input needed", tr: "Esaslı katkı gerekli" },
  rsn_affects_outcome: { en: "Affects downstream outcome", tr: "Sonraki sonuçları etkiler" },
  rsn_awaiting_external_response: { en: "Awaiting an external response", tr: "Dış yanıt bekleniyor" },
  rsn_routine_correspondence: { en: "Routine correspondence", tr: "Rutin yazışma" },

  // Cognitive relief metrics
  reliefTitle: { en: "Cognitive relief today", tr: "Bugün bilişsel rahatlama" },
  reliefSubtitle: {
    en: "What ISURA carried so you didn't have to.",
    tr: "Sizin yerinize ISURA'nın taşıdıkları.",
  },
  metric_decisions_simplified: { en: "Decisions simplified", tr: "Basitleştirilen kararlar" },
  metric_risks_detected: { en: "Operational risks detected", tr: "Tespit edilen operasyonel riskler" },
  metric_focus_recovered: { en: "Focus time recovered", tr: "Geri kazanılan odak süresi" },
  metric_pressure_reduced: { en: "Communication pressure reduced", tr: "Azalan iletişim baskısı" },
  metric_load_score: { en: "Cognitive load score", tr: "Bilişsel yük skoru" },
  minutesShort: { en: "min", tr: "dk" },

  // Trust
  trustNoAutoSend: {
    en: "ISURA never sends messages without your approval.",
    tr: "ISURA, onayınız olmadan asla mesaj göndermez.",
  },
  trustReadOnly: {
    en: "Read-only access. Your data stays yours.",
    tr: "Yalnızca okuma erişimi. Verileriniz sizde kalır.",
  },

  // Insight
  insightTitle: { en: "Today's operational insight", tr: "Bugünün operasyonel içgörüsü" },
  insightFocus: {
    en: "Focus only on the decisions with real consequences.",
    tr: "Yalnızca gerçek sonuçları olan kararlara odaklanın.",
  },
  insightLow: {
    en: "Most of your inbox is low cognitive value. ISURA has quieted it.",
    tr: "Gelen kutunuzun çoğu düşük zihinsel önceliğe sahip. ISURA bunları sessizleştirdi.",
  },
  insightHigh: {
    en: "{n} items genuinely require your decision today.",
    tr: "{n} öğe bugün gerçekten kararınızı gerektiriyor.",
  },

  // List & tabs
  emailListTitle: { en: "Today's queue", tr: "Bugünün kuyruğu" },
  viewAll: { en: "All", tr: "Tümü" },
  viewPriority: { en: "Priority", tr: "Öncelik" },
  viewReplies: { en: "Drafts", tr: "Taslaklar" },
  viewLow: { en: "Quieted", tr: "Sessizleştirildi" },
  tab_all: { en: "All", tr: "Tümü" },
  tab_priority: { en: "Priority", tr: "Öncelik" },
  tab_replies: { en: "Drafts", tr: "Taslaklar" },
  tab_low: { en: "Quieted", tr: "Sessizleştirildi" },
  archiveAll: { en: "File all", tr: "Tümünü arşivle" },
  archived: { en: "Filed", tr: "Arşivlendi" },
  restore: { en: "Restore", tr: "Geri al" },
  emptyView: { en: "Nothing here. One less thing to think about.", tr: "Burada bir şey yok. Düşünecek bir şey eksildi." },
  view: { en: "Open", tr: "Aç" },
  reply: { en: "Reply", tr: "Yanıtla" },
  ignore: { en: "Quiet", tr: "Sessizleştir" },
  ignored: { en: "Quieted", tr: "Sessizleştirildi" },
  replied: { en: "Replied", tr: "Yanıtlandı" },
  tab_active: { en: "Active", tr: "Aktif" },
  tab_archived: { en: "Filed", tr: "Arşiv" },
  tab_ignored: { en: "Quieted", tr: "Sessizleştirildi" },
  tab_replied: { en: "Replied", tr: "Yanıtlanan" },
  noEmailsHere: { en: "Nothing here.", tr: "Burada bir şey yok." },
  allCaughtUp: { en: "Operationally clear.", tr: "Operasyonel olarak temiz." },
  ignoredToast: { en: "Quieted.", tr: "Sessizleştirildi." },
  repliedToast: { en: "Sent. ISURA marked it replied.", tr: "Gönderildi. ISURA yanıtlandı olarak işaretledi." },
  restoredOk: { en: "Restored.", tr: "Geri alındı." },

  // Magic moment
  whatChanged: { en: "What changed?", tr: "Ne değişti?" },
  beforeIsura: { en: "Before ISURA", tr: "ISURA'dan önce" },
  afterIsura: { en: "After ISURA", tr: "ISURA'dan sonra" },
  before1: { en: "Inbox overload", tr: "Gelen kutusu yığını" },
  before2: { en: "Constant context switching", tr: "Sürekli bağlam değiştirme" },
  before3: { en: "Decision fatigue", tr: "Karar yorgunluğu" },
  before4: { en: "No prioritization clarity", tr: "Öncelik netliği yok" },
  after1: { en: "Operational consequences surfaced", tr: "Operasyonel sonuçlar öne çıkarıldı" },
  after2: { en: "Drafts awaiting approval", tr: "Onay bekleyen taslaklar" },
  after3: { en: "Reduced cognitive load", tr: "Azaltılmış bilişsel yük" },
  after4: { en: "Structured attention", tr: "Yapılandırılmış dikkat" },

  positioning: {
    en: "ISURA is not an inbox tool. It is the cognition layer for your operations.",
    tr: "ISURA bir gelen kutusu aracı değildir. Operasyonlarınızın biliş katmanıdır.",
  },

  // Detail page
  load: { en: "Category", tr: "Kategori" },
  loadLow: { en: "Low cognitive value", tr: "Düşük zihinsel öncelik" },
  loadMedium: { en: "Operational risk", tr: "Operasyonel risk" },
  loadHigh: { en: "Requires decision", tr: "Karar gerektiriyor" },
  prUrgent: { en: "Decide today", tr: "Bugün karar ver" },
  prNormal: { en: "Standard", tr: "Standart" },
  prIgnore: { en: "Safe to ignore", tr: "Yok sayılabilir" },
  back: { en: "Back to operations", tr: "Operasyona dön" },
  understanding: { en: "Understanding", tr: "Anlama" },
  summary: { en: "Summary", tr: "Özet" },
  intent: { en: "Intent", tr: "Niyet" },
  decision: { en: "Decision layer", tr: "Karar katmanı" },
  shouldRespond: { en: "Should you respond?", tr: "Yanıt vermeli misiniz?" },
  why: { en: "Reasoning", tr: "Gerekçe" },
  urgency: { en: "Urgency", tr: "Aciliyet" },
  tone: { en: "Tone", tr: "Ton" },
  regenerate: { en: "Regenerate", tr: "Yeniden oluştur" },
  edit: { en: "Edit", tr: "Düzenle" },
  approveSend: { en: "Approve & send", tr: "Onayla ve gönder" },
  thinking: { en: "Reading the situation…", tr: "Durumu okuyor…" },
  yes: { en: "Yes", tr: "Evet" },
  no: { en: "No", tr: "Hayır" },
  delegate: { en: "Delegate", tr: "Devret" },
  language: { en: "Language", tr: "Dil" },
  sentToast: { en: "Sent. One less decision to carry.", tr: "Gönderildi. Taşınacak bir karar daha eksildi." },
  byIsura: { en: "Drafted by ISURA · awaiting your approval", tr: "ISURA tarafından hazırlandı · onayınızı bekliyor" },

  // Product navigation
  navWorkspace: { en: "Workspace", tr: "Çalışma alanı" },
  navPriority: { en: "Priority", tr: "Öncelik" },
  navTrust: { en: "Trust", tr: "Güven" },
  navHelp: { en: "Help", tr: "Yardım" },

  // Product footer
  footerTagline: { en: "The operational cognition platform.", tr: "Operasyonel biliş platformu." },
  footerProduct: { en: "Product", tr: "Ürün" },
  footerCompany: { en: "Company", tr: "Şirket" },
  footerLegal: { en: "Legal & trust", tr: "Yasal ve güven" },
  footerLinkWorkspace: { en: "Workspace", tr: "Çalışma alanı" },
  footerLinkPriority: { en: "Priority queue", tr: "Öncelik kuyruğu" },
  footerLinkLanding: { en: "Overview", tr: "Genel bakış" },
  footerLinkPhilosophy: { en: "Philosophy", tr: "Felsefe" },
  footerLinkContact: { en: "Contact", tr: "İletişim" },
  footerLinkTrust: { en: "Trust & security", tr: "Güven ve güvenlik" },
  footerLinkPrivacy: { en: "Privacy", tr: "Gizlilik" },
  footerLinkTerms: { en: "Terms", tr: "Şartlar" },
  footerCopy: { en: "© ISURA. Operational clarity, quietly applied.", tr: "© ISURA. Operasyonel netlik, sessizce uygulanır." },
  footerStatus: { en: "All systems calm", tr: "Tüm sistemler sakin" },

  // Premium empty states
  emptyDecisionTitle: { en: "No decisions on your desk.", tr: "Masanızda karar yok." },
  emptyDecisionBody: { en: "ISURA is watching. You'll see something here only when it truly requires you.", tr: "ISURA izliyor. Yalnızca gerçekten gerektiğinde burada bir şey göreceksiniz." },
  emptyRiskTitle: { en: "No operational risks detected.", tr: "Operasyonel risk tespit edilmedi." },
  emptyRiskBody: { en: "Nothing on the horizon carries downstream consequence right now.", tr: "Şu anda ufukta sonuç doğuran bir şey yok." },
  emptyWaitingTitle: { en: "Nothing is waiting on others.", tr: "Karşı taraftan beklenen bir şey yok." },
  emptyWaitingBody: { en: "External threads are settled. ISURA will track the next one for you.", tr: "Dış konular yerinde. Bir sonrakini ISURA sizin için takip edecek." },
  emptyFollowupTitle: { en: "No follow-ups overdue.", tr: "Geciken takip yok." },
  emptyFollowupBody: { en: "Conversations are flowing. No nudges to send.", tr: "Yazışmalar akışta. Gönderilecek hatırlatma yok." },
  emptyReviewTitle: { en: "No drafts pending review.", tr: "İncelenecek taslak yok." },
  emptyReviewBody: { en: "ISURA hasn't prepared anything new since you last looked.", tr: "Son baktığınızdan beri ISURA yeni bir şey hazırlamadı." },
  emptyLowTitle: { en: "Quiet zone is quiet.", tr: "Sessiz bölge sessiz." },
  emptyLowBody: { en: "No low-value noise to filter today.", tr: "Bugün süzülecek düşük değerli gürültü yok." },
  emptyResolvedTitle: { en: "Nothing resolved yet.", tr: "Henüz çözülen bir şey yok." },
  emptyResolvedBody: { en: "Items you file, reply to, or quiet in this session will land here.", tr: "Bu oturumda arşivlediğiniz, yanıtladığınız veya sessizleştirdikleriniz burada görünür." },

  // Pilot notice (Part 1)
  pilotBadge: { en: "Private pilot", tr: "Özel pilot" },
  pilotNoticeBody: {
    en: "ISURA is currently in private pilot. Features and system behavior may evolve during testing.",
    tr: "ISURA şu anda özel pilot sürecindedir. Özellikler ve sistem davranışları test sürecinde değişebilir.",
  },
  pilotLearnMore: { en: "Read the pilot status →", tr: "Pilot durumunu okuyun →" },

  // Shared legal copy
  legalEffective: { en: "Effective", tr: "Yürürlük tarihi" },
  legalContactTitle: { en: "Questions or requests?", tr: "Sorularınız veya talepleriniz mi var?" },
  legalContactBody: {
    en: "Reach our privacy and trust team directly. We respond within five working days.",
    tr: "Gizlilik ve güven ekibimize doğrudan ulaşın. Beş iş günü içinde yanıt veriyoruz.",
  },

  // Privacy
  privacyEyebrow: { en: "Privacy policy", tr: "Gizlilik politikası" },
  privacyTitle: { en: "Your inbox stays yours.", tr: "Gelen kutunuz sizin kalır." },
  privacySubtitle: {
    en: "How ISURA collects, processes, and protects the data you connect — written in plain language, not legal templates.",
    tr: "ISURA'nın bağladığınız verileri nasıl topladığı, işlediği ve koruduğu — şablon değil, sade dille.",
  },

  // Terms
  termsEyebrow: { en: "Terms of service", tr: "Hizmet şartları" },
  termsTitle: { en: "A calm contract.", tr: "Sakin bir sözleşme." },
  termsSubtitle: {
    en: "What ISURA does, what it does not, and the responsibilities each side carries during the private pilot.",
    tr: "ISURA'nın ne yaptığı, ne yapmadığı ve özel pilot süresince her iki tarafın taşıdığı sorumluluklar.",
  },

  // Cookies
  cookiesEyebrow: { en: "Cookie policy", tr: "Çerez politikası" },
  cookiesTitle: { en: "A small, considered set of cookies.", tr: "Az ve özenle seçilmiş çerezler." },
  cookiesSubtitle: {
    en: "We use only the cookies needed to keep your session safe, your preferences remembered, and the product measurably reliable.",
    tr: "Yalnızca oturumunuzu güvende tutmak, tercihlerinizi hatırlamak ve ürünün ölçülebilir biçimde güvenilir kalmasını sağlamak için çerez kullanırız.",
  },

  // Security
  securityEyebrow: { en: "Security", tr: "Güvenlik" },
  securityTitle: { en: "Built for the most cautious operator.", tr: "En temkinli kullanıcı için tasarlandı." },
  securitySubtitle: {
    en: "OAuth-based authentication, encrypted tokens, read-only analysis — and a clear path to disconnect at any time.",
    tr: "OAuth tabanlı kimlik doğrulama, şifreli token'lar, yalnızca okuma analizi — ve istediğiniz an bağlantıyı kesme yolu.",
  },

  // AI Transparency
  aiEyebrow: { en: "AI transparency", tr: "AI şeffaflığı" },
  aiTitle: { en: "Suggestions, never actions.", tr: "Öneriler, eylemler değil." },
  aiSubtitle: {
    en: "What ISURA's AI analyzes, what it never does, and how every operational suggestion reaches you.",
    tr: "ISURA'nın AI'ının neyi analiz ettiği, asla neyi yapmadığı ve her operasyonel önerinin size nasıl ulaştığı.",
  },
  aiNeverActs: {
    en: "ISURA never takes action without user approval.",
    tr: "ISURA, kullanıcı onayı olmadan asla eylemde bulunmaz.",
  },

  // Pilot status page
  pilotPageEyebrow: { en: "Pilot status", tr: "Pilot durumu" },
  pilotPageTitle: { en: "Where ISURA is right now.", tr: "ISURA şu an nerede." },
  pilotPageSubtitle: {
    en: "ISURA is in private pilot with a small group of operators. This page describes what that means for you, today.",
    tr: "ISURA, az sayıda operatörle özel pilot sürecindedir. Bu sayfa bugün sizin için ne anlama geldiğini açıklar.",
  },

  // Footer additions
  footerLinkSecurity: { en: "Security", tr: "Güvenlik" },
  footerLinkCookies: { en: "Cookies", tr: "Çerezler" },
  footerLinkAI: { en: "AI transparency", tr: "AI şeffaflığı" },
  footerLinkPilot: { en: "Pilot status", tr: "Pilot durumu" },
  footerPilotLine: {
    en: "ISURA is in private pilot. Behavior may evolve during testing.",
    tr: "ISURA özel pilot sürecindedir. Davranışlar test sürecinde değişebilir.",
  },

  // Audio briefing & voice commands
  navBriefing: { en: "Briefing", tr: "Brifing" },
  briefingEyebrow: { en: "Audio briefing", tr: "Sesli brifing" },
  briefingTitle: { en: "Listen to your inbox.", tr: "Gelen kutunuzu dinleyin." },
  briefingSubtitle: {
    en: "ISURA narrates your operational briefing like a calm podcast — segment by segment, with commentary. Control it with your voice.",
    tr: "ISURA operasyonel brifinginizi sakin bir podcast gibi anlatır — bölüm bölüm, yorumlarıyla. Sesinizle kontrol edin.",
  },
  briefingPreparing: { en: "Preparing your audio briefing…", tr: "Sesli brifinginiz hazırlanıyor…" },
  briefingNowPlaying: { en: "Now playing", tr: "Şimdi çalıyor" },
  briefingSegment: { en: "Segment", tr: "Bölüm" },
  briefingPlay: { en: "Play", tr: "Oynat" },
  briefingPause: { en: "Pause", tr: "Duraklat" },
  briefingNext: { en: "Next", tr: "Sonraki" },
  briefingPrev: { en: "Previous", tr: "Önceki" },
  briefingRestart: { en: "Restart", tr: "Baştan" },

  voiceStart: { en: "Voice commands", tr: "Sesli komut" },
  voiceStop: { en: "Listening… tap to stop", tr: "Dinleniyor… durdurmak için dokun" },
  voiceListening: { en: "Listening for voice commands.", tr: "Sesli komutlar dinleniyor." },
  voiceCommand: { en: "Command", tr: "Komut" },
  voiceHeard: { en: "Heard", tr: "Algılanan" },
  voiceNotSupported: {
    en: "Voice recognition isn't supported in this browser. Try Chrome.",
    tr: "Bu tarayıcı ses tanımayı desteklemiyor. Chrome'u deneyin.",
  },
  voiceTTSUnsupported: {
    en: "Audio playback isn't supported in this browser.",
    tr: "Bu tarayıcı sesli oynatmayı desteklemiyor.",
  },
  voiceCommandsTitle: { en: "Voice commands", tr: "Sesli komutlar" },
  voiceCommandsSub: {
    en: "Tap “Voice commands”, then speak naturally in English or Turkish.",
    tr: "“Sesli komut”a dokunun, ardından İngilizce veya Türkçe doğal konuşun.",
  },
  cmd_play: { en: "“Play” / “Oynat” — start listening", tr: "“Oynat” / “Play” — dinlemeyi başlat" },
  cmd_pause: { en: "“Pause” / “Duraklat” — stop the voice", tr: "“Duraklat” / “Pause” — sesi durdur" },
  cmd_next: { en: "“Next” / “Sonraki” — skip ahead", tr: "“Sonraki” / “Next” — ileri atla" },
  cmd_prev: { en: "“Previous” / “Önceki” — go back", tr: "“Önceki” / “Previous” — geri dön" },
  cmd_repeat: { en: "“Repeat” / “Baştan” — restart briefing", tr: "“Baştan” / “Repeat” — brifingi yeniden başlat" },
  cmd_priority: { en: "“Priority” / “Öncelik” — open priority queue", tr: "“Öncelik” / “Priority” — öncelik kuyruğunu aç" },
  cmd_workspace: { en: "“Inbox” / “Gelen kutusu” — open workspace", tr: "“Gelen kutusu” / “Inbox” — çalışma alanını aç" },
  cmd_faster: { en: "“Faster” / “Hızlandır” — speed up playback", tr: "“Hızlandır” / “Faster” — oynatmayı hızlandır" },
  cmd_slower: { en: "“Slower” / “Yavaşlat” — slow down playback", tr: "“Yavaşlat” / “Slower” — oynatmayı yavaşlat" },
  voiceSpeed: { en: "Speed", tr: "Hız" },
  cmd_reply: {
    en: "“Reply” / “Yanıtla” — draft a reply for the current email",
    tr: "“Yanıtla” / “Reply” — mevcut e-posta için taslak oluştur",
  },
  voiceDraftReply: { en: "Draft reply", tr: "Yanıt taslağı" },
  voiceDrafting: { en: "Drafting reply…", tr: "Yanıt taslağı hazırlanıyor…" },
  voiceDraftReady: { en: "Reply draft ready", tr: "Yanıt taslağı hazır" },
  voiceDraftFailed: { en: "Couldn't generate a draft.", tr: "Taslak oluşturulamadı." },
  voiceNoEmail: {
    en: "This segment isn't tied to an email.",
    tr: "Bu bölüm bir e-postaya bağlı değil.",
  },
  cmd_confirm: {
    en: "“Approve” / “Onayla” — confirm, or “Cancel” / “İptal” to discard",
    tr: "“Onayla” / “Approve” — onayla, vazgeçmek için “İptal” / “Cancel”",
  },
  voiceAwaitingApproval: { en: "Awaiting your approval", tr: "Onayınız bekleniyor" },
  voiceApprovalHint: {
    en: "I'll read a summary aloud. Say “approve” to confirm or “cancel” to discard.",
    tr: "Sesli bir özet okuyacağım. Onaylamak için “onayla”, vazgeçmek için “iptal” deyin.",
  },
  voiceApprove: { en: "Approve & mark replied", tr: "Onayla ve yanıtlandı işaretle" },
  voiceDiscard: { en: "Discard", tr: "Vazgeç" },
  voiceDraftApproved: { en: "Reply approved", tr: "Yanıt onaylandı" },
  voiceDraftApprovedSpoken: {
    en: "Great, the reply has been approved and marked as replied.",
    tr: "Harika, yanıt onaylandı ve yanıtlandı olarak işaretlendi.",
  },
  voiceDraftDiscarded: { en: "Draft discarded.", tr: "Taslak iptal edildi." },
};

export function t(lang: Lang, key: keyof typeof dict | string, vars?: Record<string, string | number>): string {
  const entry = dict[key as keyof typeof dict];
  let str = entry?.[lang] ?? (key as string);
  if (vars) for (const [k, v] of Object.entries(vars)) str = str.replace(`{${k}}`, String(v));
  return str;
}

const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "en",
  setLang: () => {},
});

export const SUPPORTED_LANGS: { code: Lang; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "tr", label: "Turkish", native: "Türkçe" },
];

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  useEffect(() => {
    const saved = typeof window !== "undefined" ? (localStorage.getItem("isura.lang") as Lang | null) : null;
    const initial: Lang =
      saved === "en" || saved === "tr"
        ? saved
        : typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("tr")
        ? "tr"
        : "en";
    setLangState(initial);
    if (typeof document !== "undefined") document.documentElement.lang = initial;
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("isura.lang", l);
    if (typeof document !== "undefined") document.documentElement.lang = l;
  };
  return <LangCtx.Provider value={{ lang, setLang }}>{children}</LangCtx.Provider>;
}

export function useLang() {
  return useContext(LangCtx);
}
