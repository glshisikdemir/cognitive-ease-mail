import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

// Calm, warm narration voices for the briefing experience.
// Sarah (EN) — composed, clear; Charlotte works well for multilingual incl. TR.
const VOICE_EN = "EXAVITQu4vr4xnSDxMaL"; // Sarah
const VOICE_TR = "XB0fDUnXU5powFXDhCwa"; // Charlotte (multilingual)

const BodySchema = z.object({
  text: z.string().min(1).max(5000),
  lang: z.enum(["en", "tr"]).default("en"),
});

export const Route = createFileRoute("/api/tts")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.ELEVENLABS_API_KEY;
        if (!apiKey) {
          return new Response(JSON.stringify({ error: "TTS not configured" }), {
            status: 503,
            headers: { "Content-Type": "application/json" },
          });
        }

        let parsed;
        try {
          parsed = BodySchema.parse(await request.json());
        } catch {
          return new Response(JSON.stringify({ error: "Invalid request" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const voiceId = parsed.lang === "tr" ? VOICE_TR : VOICE_EN;

        const res = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
          {
            method: "POST",
            headers: {
              "xi-api-key": apiKey,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              text: parsed.text,
              model_id: "eleven_multilingual_v2",
              voice_settings: {
                stability: 0.55,
                similarity_boost: 0.75,
                style: 0.25,
                use_speaker_boost: true,
                speed: 1.0,
              },
            }),
          },
        );

        if (!res.ok) {
          const detail = await res.text().catch(() => "");
          console.error("ElevenLabs TTS failed", res.status, detail);
          return new Response(JSON.stringify({ error: "TTS generation failed" }), {
            status: 502,
            headers: { "Content-Type": "application/json" },
          });
        }

        const audio = await res.arrayBuffer();
        return new Response(audio, {
          status: 200,
          headers: {
            "Content-Type": "audio/mpeg",
            "Cache-Control": "no-store",
          },
        });
      },
    },
  },
});
