import { useEffect, useState } from "react";

export type ChannelId = "email" | "whatsapp" | "slack" | "telegram";

export type AssistantId = "operational" | "concise" | "formal";

export type ChannelConfig = {
  enabled: boolean;
  assistant: AssistantId;
  target: string; // phone (E.164), slack channel, telegram chat id, or email
};

export type ChannelSettings = Record<ChannelId, ChannelConfig>;

export const CHANNELS: ChannelId[] = ["email", "whatsapp", "slack", "telegram"];
export const ASSISTANTS: AssistantId[] = ["operational", "concise", "formal"];

const KEY = "isura.channel-settings.v1";
const EVENT = "isura.channel-settings.change";

const DEFAULTS: ChannelSettings = {
  email: { enabled: false, assistant: "operational", target: "" },
  whatsapp: { enabled: false, assistant: "concise", target: "" },
  slack: { enabled: false, assistant: "operational", target: "" },
  telegram: { enabled: false, assistant: "concise", target: "" },
};

function read(): ChannelSettings {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<ChannelSettings>;
    return {
      email: { ...DEFAULTS.email, ...parsed.email },
      whatsapp: { ...DEFAULTS.whatsapp, ...parsed.whatsapp },
      slack: { ...DEFAULTS.slack, ...parsed.slack },
      telegram: { ...DEFAULTS.telegram, ...parsed.telegram },
    };
  } catch {
    return DEFAULTS;
  }
}

function write(s: ChannelSettings) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s));
    window.dispatchEvent(new CustomEvent(EVENT));
  } catch {
    /* ignore */
  }
}

export function updateChannel(id: ChannelId, patch: Partial<ChannelConfig>) {
  const s = read();
  s[id] = { ...s[id], ...patch };
  write(s);
}

export function useChannelSettings(): ChannelSettings {
  const [state, setState] = useState<ChannelSettings>(() => read());
  useEffect(() => {
    setState(read());
    const sync = () => setState(read());
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) sync();
    };
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", onStorage);
    };
  }, []);
  return state;
}
