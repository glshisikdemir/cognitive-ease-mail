import { useCallback, useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Mic, MicOff, Loader2, Send, Archive, EyeOff, Sparkles, Volume2 } from "lucide-react";
import { toast } from "sonner";
import {
  interpretVoiceCommand,
  type VoiceAssistantResult,
} from "@/lib/voice-assistant.functions";
import { emails as allEmails } from "@/lib/emails";
import { setReplyDraft, setStatus, useEmailStore } from "@/lib/email-store";
import { addSentEmail } from "@/lib/sent-emails";
import { useLang, t, type Lang } from "@/lib/i18n";

// Web Speech API is experimental and loosely typed.
type AnyRec = any;

type Turn = { role: "user" | "isura"; text: string };

function pickVoice(lang: Lang): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  const prefix = lang === "tr" ? "tr" : "en";
  return (
    voices.find((v) => v.lang?.toLowerCase().startsWith(prefix)) ??
    voices.find((v) => v.lang?.toLowerCase().startsWith("en")) ??
    voices[0] ??
    null
  );
}

export function VoiceAssistant() {
  const { lang } = useLang();
  const store = useEmailStore();
  const interpret = useServerFn(interpretVoiceCommand);

  const [turns, setTurns] = useState<Turn[]>([]);
  const [listening, setListening] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [pending, setPending] = useState<{ emailId: string; subject: string; draft: string } | null>(null);

  const recRef = useRef<AnyRec>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playTokenRef = useRef(0);
  const turnsRef = useRef<Turn[]>([]);
  const pendingRef = useRef<typeof pending>(null);
  const logRef = useRef<HTMLDivElement | null>(null);
  turnsRef.current = turns;
  pendingRef.current = pending;

  useEffect(() => {
    if ("speechSynthesis" in window) window.speechSynthesis.getVoices();
  }, []);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [turns, thinking]);

  // Speak text via ElevenLabs (/api/tts) with native fallback.
  const speak = useCallback(
    async (text: string) => {
      const token = ++playTokenRef.current;
      if (audioRef.current) audioRef.current.pause();
      if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
      setSpeaking(true);
      try {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, lang }),
        });
        if (!res.ok) throw new Error("tts_failed");
        const url = URL.createObjectURL(await res.blob());
        if (token !== playTokenRef.current) return URL.revokeObjectURL(url);
        let audio = audioRef.current;
        if (!audio) {
          audio = new Audio();
          audioRef.current = audio;
        }
        audio.onended = () => {
          if (token === playTokenRef.current) setSpeaking(false);
          URL.revokeObjectURL(url);
        };
        audio.src = url;
        await audio.play();
      } catch {
        if (token !== playTokenRef.current) return;
        if (typeof window !== "undefined" && window.speechSynthesis) {
          const u = new SpeechSynthesisUtterance(text);
          const v = pickVoice(lang);
          if (v) u.voice = v;
          u.lang = lang === "tr" ? "tr-TR" : "en-US";
          u.onend = () => {
            if (token === playTokenRef.current) setSpeaking(false);
          };
          window.speechSynthesis.speak(u);
        } else {
          setSpeaking(false);
        }
      }
    },
    [lang],
  );

  // Apply ISURA's decision to the inbox + speak the response.
  const applyResult = useCallback(
    (r: VoiceAssistantResult) => {
      const email = r.emailId ? allEmails.find((e) => e.id === r.emailId) : undefined;

      if (r.intent === "draft" && email && r.replyDraft) {
        setReplyDraft(email.id, r.replyDraft);
        setPending({ emailId: email.id, subject: email.subject, draft: r.replyDraft });
        toast.success(`${t(lang, "vaDraftReady")} — ${email.subject}`);
      } else if (r.intent === "send" && email) {
        const draft = r.replyDraft ?? pendingRef.current?.draft ?? "";
        if (draft) setReplyDraft(email.id, draft);
        setStatus(email.id, "replied");
        setPending(null);
        toast.success(`${t(lang, "vaSent")} — ${email.subject}`);
      } else if (r.intent === "archive" && email) {
        setStatus(email.id, "archived");
        toast.message(`${t(lang, "vaArchived")} — ${email.subject}`);
      } else if (r.intent === "ignore" && email) {
        setStatus(email.id, "ignored");
        toast.message(`${t(lang, "vaIgnored")} — ${email.subject}`);
      }

      setTurns((prev) => [...prev, { role: "isura", text: r.spoken }]);
      void speak(r.spoken);
    },
    [lang, speak],
  );

  // Send a transcript to ISURA for interpretation.
  const handleCommand = useCallback(
    async (transcript: string) => {
      const clean = transcript.trim();
      if (!clean) return;
      setTurns((prev) => [...prev, { role: "user", text: clean }]);
      setThinking(true);
      try {
        const result = await interpret({
          data: {
            lang,
            transcript: clean,
            pendingEmailId: pendingRef.current?.emailId ?? null,
            history: turnsRef.current.slice(-8),
            emails: allEmails.map((e) => ({
              id: e.id,
              sender: e.sender,
              subject: e.subject,
              body: e.body,
              status: store[e.id]?.status ?? "active",
            })),
          },
        });
        applyResult(result);
      } catch (e) {
        const msg = e instanceof Error ? e.message : t(lang, "vaError");
        setTurns((prev) => [...prev, { role: "isura", text: msg }]);
        toast.error(msg);
      } finally {
        setThinking(false);
      }
    },
    [interpret, lang, store, applyResult],
  );

  const toggleListening = useCallback(() => {
    if (typeof window === "undefined") return;
    const SR = (window as AnyRec).SpeechRecognition || (window as AnyRec).webkitSpeechRecognition;
    if (!SR) {
      toast.error(t(lang, "voiceNotSupported"));
      return;
    }
    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }
    // Stop any current playback so ISURA doesn't hear itself.
    playTokenRef.current += 1;
    audioRef.current?.pause();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setSpeaking(false);

    const rec: AnyRec = new SR();
    rec.lang = lang === "tr" ? "tr-TR" : "en-US";
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (event: AnyRec) => {
      const transcript = event.results[event.results.length - 1]?.[0]?.transcript ?? "";
      void handleCommand(transcript);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recRef.current = rec;
    rec.start();
    setListening(true);
  }, [listening, lang, handleCommand]);

  useEffect(() => {
    return () => {
      playTokenRef.current += 1;
      audioRef.current?.pause();
      if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
      recRef.current?.stop?.();
    };
  }, []);

  const status = listening
    ? t(lang, "vaListening")
    : thinking
    ? t(lang, "vaThinking")
    : speaking
    ? t(lang, "vaSpeaking")
    : t(lang, "vaIdle");

  return (
    <div className="space-y-6">
      {/* Conversation log */}
      <div
        ref={logRef}
        className="max-h-[46vh] min-h-[18rem] space-y-3 overflow-y-auto rounded-2xl border border-border/70 bg-surface px-5 py-5"
      >
        {turns.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-3 py-10 text-center text-muted-foreground">
            <Sparkles className="h-6 w-6" />
            <p className="max-w-sm text-sm leading-relaxed">{t(lang, "vaEmpty")}</p>
          </div>
        )}
        {turns.map((turn, i) => (
          <div
            key={i}
            className={`flex ${turn.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                turn.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface-muted text-foreground"
              }`}
            >
              {turn.text}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl bg-surface-muted px-4 py-2.5 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t(lang, "vaThinking")}
            </div>
          </div>
        )}
      </div>

      {/* Pending confirmation banner */}
      {pending && (
        <div className="rounded-2xl border border-amber-500/40 bg-amber-500/5 px-5 py-4">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-amber-600 dark:text-amber-400">
            <Send className="h-3.5 w-3.5" />
            {t(lang, "vaPendingTitle")}
          </div>
          <p className="mt-1 text-sm font-medium text-foreground">{pending.subject}</p>
          <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{pending.draft}</p>
          <p className="mt-3 text-xs text-muted-foreground">{t(lang, "vaPendingHint")}</p>
        </div>
      )}

      {/* Mic control */}
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-border/70 bg-surface px-6 py-8">
        <button
          onClick={toggleListening}
          aria-label={listening ? t(lang, "vaStop") : t(lang, "vaStart")}
          className={`flex h-20 w-20 items-center justify-center rounded-full text-primary-foreground transition ${
            listening
              ? "animate-pulse bg-destructive"
              : "bg-primary hover:opacity-90"
          }`}
        >
          {listening ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
        </button>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {speaking && <Volume2 className="h-4 w-4 animate-pulse" />}
          <span>{status}</span>
        </div>
        <p className="max-w-md text-center text-xs leading-relaxed text-muted-foreground">
          {t(lang, "vaHint")}
        </p>
      </div>

      {/* Example commands */}
      <div className="flex flex-wrap justify-center gap-2">
        {[t(lang, "vaEx1"), t(lang, "vaEx2"), t(lang, "vaEx3"), t(lang, "vaEx4")].map((ex, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground"
          >
            {i === 2 ? <Archive className="h-3 w-3" /> : i === 3 ? <EyeOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
            {ex}
          </span>
        ))}
      </div>
    </div>
  );
}
