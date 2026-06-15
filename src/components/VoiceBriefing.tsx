import { useCallback, useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useNavigate } from "@tanstack/react-router";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Mic,
  MicOff,
  Radio,
  Volume2,
} from "lucide-react";
import { toast } from "sonner";
import { generateBriefing, type BriefingSegment } from "@/lib/briefing.functions";
import { emails as allEmails } from "@/lib/emails";
import { quickAssess } from "@/lib/heuristics";
import { useLang, t, type Lang } from "@/lib/i18n";

// --- Web Speech API (loosely typed; experimental browser APIs) ---
type AnyRec = any;

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

export function VoiceBriefing() {
  const { lang } = useLang();
  const navigate = useNavigate();
  const fn = useServerFn(generateBriefing);

  const [segments, setSegments] = useState<BriefingSegment[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const [lastHeard, setLastHeard] = useState<string>("");

  const recRef = useRef<AnyRec>(null);
  const currentRef = useRef(0);
  const segRef = useRef<BriefingSegment[] | null>(null);
  segRef.current = segments;
  currentRef.current = current;

  // --- Load briefing script ---
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const ranked = allEmails
        .map((e) => ({ e, a: quickAssess(e) }))
        .sort((x, y) => weight(y.a.category) - weight(x.a.category));
      const result = await fn({
        data: {
          lang,
          emails: ranked.map(({ e, a }) => ({
            id: e.id,
            sender: e.sender,
            subject: e.subject,
            body: e.body,
            category: a.category,
          })),
        },
      });
      setSegments(result.segments);
      setCurrent(0);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate briefing");
    } finally {
      setLoading(false);
    }
  }, [fn, lang]);

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  // --- Detect support ---
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hasTTS = "speechSynthesis" in window;
    setSupported(hasTTS);
    // warm up voices
    if (hasTTS) window.speechSynthesis.getVoices();
  }, []);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setPlaying(false);
  }, []);

  const speakFrom = useCallback(
    (index: number) => {
      const segs = segRef.current;
      if (!segs || typeof window === "undefined" || !window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      if (index < 0 || index >= segs.length) {
        setPlaying(false);
        return;
      }
      setCurrent(index);
      const u = new SpeechSynthesisUtterance(segs[index].spoken);
      const voice = pickVoice(lang);
      if (voice) u.voice = voice;
      u.lang = lang === "tr" ? "tr-TR" : "en-US";
      u.rate = 1;
      u.pitch = 1;
      u.onend = () => {
        const next = index + 1;
        if (next < segs.length) {
          speakFrom(next);
        } else {
          setPlaying(false);
        }
      };
      window.speechSynthesis.speak(u);
      setPlaying(true);
    },
    [lang],
  );

  const handlePlayPause = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    if (playing) {
      window.speechSynthesis.cancel();
      setPlaying(false);
    } else {
      speakFrom(currentRef.current);
    }
  }, [playing, speakFrom]);

  const handleNext = useCallback(() => {
    const segs = segRef.current;
    if (!segs) return;
    speakFrom(Math.min(currentRef.current + 1, segs.length - 1));
  }, [speakFrom]);

  const handlePrev = useCallback(() => {
    speakFrom(Math.max(currentRef.current - 1, 0));
  }, [speakFrom]);

  const handleRestart = useCallback(() => speakFrom(0), [speakFrom]);

  // --- Voice command parsing ---
  const runCommand = useCallback(
    (raw: string) => {
      const text = raw.toLowerCase().trim();
      setLastHeard(raw);
      const has = (...words: string[]) => words.some((w) => text.includes(w));

      if (has("play", "oynat", "başlat", "devam", "dinle")) {
        if (!playing) speakFrom(currentRef.current);
        return "play";
      }
      if (has("pause", "duraklat", "bekle", "dur")) {
        stopSpeaking();
        return "pause";
      }
      if (has("next", "sonraki", "ileri", "geç", "atla")) {
        handleNext();
        return "next";
      }
      if (has("previous", "önceki", "geri", "back")) {
        handlePrev();
        return "previous";
      }
      if (has("repeat", "tekrar", "yeniden", "restart", "baştan")) {
        handleRestart();
        return "repeat";
      }
      if (has("priority", "öncelik")) {
        navigate({ to: "/priority" });
        return "priority";
      }
      if (has("workspace", "operations", "operasyon", "çalışma", "inbox", "gelen")) {
        navigate({ to: "/app" });
        return "workspace";
      }
      return null;
    },
    [playing, speakFrom, stopSpeaking, handleNext, handlePrev, handleRestart, navigate],
  );

  // --- Speech recognition (voice commands) ---
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
    const rec: AnyRec = new SR();
    rec.lang = lang === "tr" ? "tr-TR" : "en-US";
    rec.continuous = true;
    rec.interimResults = false;
    rec.onresult = (event: AnyRec) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0]?.transcript ?? "";
      const matched = runCommand(transcript);
      if (matched) toast.success(`${t(lang, "voiceCommand")}: "${transcript.trim()}"`);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recRef.current = rec;
    rec.start();
    setListening(true);
    toast.success(t(lang, "voiceListening"));
  }, [listening, lang, runCommand]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
      recRef.current?.stop?.();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 text-center text-muted-foreground">
        <Radio className="h-6 w-6 animate-pulse" />
        <p className="font-display text-lg italic">{t(lang, "briefingPreparing")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-border/70 bg-surface px-6 py-8 text-center">
        <p className="text-sm text-destructive">{error}</p>
        <button
          onClick={() => void load()}
          className="mt-4 rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface-muted"
        >
          {t(lang, "regenerate")}
        </button>
      </div>
    );
  }

  if (!segments) return null;

  const active = segments[current];

  return (
    <div className="space-y-6">
      {/* Player */}
      <section className="rounded-2xl border border-border/70 bg-surface px-6 py-7">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          <Volume2 className="h-3.5 w-3.5" />
          {t(lang, "briefingNowPlaying")}
        </div>

        <div className="mt-4">
          <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            {t(lang, "briefingSegment")} {current + 1} / {segments.length}
          </div>
          <h2 className="mt-1 font-display text-xl text-foreground">{active.title}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {active.spoken}
          </p>
        </div>

        {/* Progress dots */}
        <div className="mt-5 flex flex-wrap gap-1.5">
          {segments.map((s, i) => (
            <button
              key={i}
              onClick={() => speakFrom(i)}
              aria-label={s.title}
              className={`h-1.5 rounded-full transition-all ${
                i === current ? "w-8 bg-primary" : "w-4 bg-border hover:bg-border-strong"
              }`}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={!supported}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground transition hover:bg-surface-muted disabled:opacity-50"
            aria-label={t(lang, "briefingPrev")}
          >
            <SkipBack className="h-4 w-4" />
          </button>
          <button
            onClick={handlePlayPause}
            disabled={!supported}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
            aria-label={playing ? t(lang, "briefingPause") : t(lang, "briefingPlay")}
          >
            {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </button>
          <button
            onClick={handleNext}
            disabled={!supported}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground transition hover:bg-surface-muted disabled:opacity-50"
            aria-label={t(lang, "briefingNext")}
          >
            <SkipForward className="h-4 w-4" />
          </button>
          <button
            onClick={handleRestart}
            disabled={!supported}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition hover:text-foreground disabled:opacity-50"
            aria-label={t(lang, "briefingRestart")}
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          {/* Voice command toggle */}
          <button
            onClick={toggleListening}
            className={`ml-auto inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
              listening
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-surface text-foreground hover:bg-surface-muted"
            }`}
          >
            {listening ? <Mic className="h-4 w-4 animate-pulse" /> : <MicOff className="h-4 w-4" />}
            {listening ? t(lang, "voiceStop") : t(lang, "voiceStart")}
          </button>
        </div>

        {!supported && (
          <p className="mt-3 text-xs text-muted-foreground">{t(lang, "voiceTTSUnsupported")}</p>
        )}
        {lastHeard && (
          <p className="mt-3 text-xs text-muted-foreground">
            {t(lang, "voiceHeard")}: <span className="text-foreground">"{lastHeard}"</span>
          </p>
        )}
      </section>

      {/* Command reference */}
      <section className="rounded-2xl border border-border/70 bg-surface px-6 py-6">
        <h3 className="font-display text-base text-foreground">{t(lang, "voiceCommandsTitle")}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{t(lang, "voiceCommandsSub")}</p>
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {[
            "cmd_play",
            "cmd_pause",
            "cmd_next",
            "cmd_prev",
            "cmd_repeat",
            "cmd_priority",
          ].map((k) => (
            <div
              key={k}
              className="rounded-lg border border-border/70 bg-background px-3 py-2 text-sm text-muted-foreground"
            >
              {t(lang, k)}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function weight(category: string): number {
  switch (category) {
    case "risk":
      return 4;
    case "decision":
      return 3;
    case "waiting":
      return 2;
    case "low_value":
      return 1;
    default:
      return 0;
  }
}
