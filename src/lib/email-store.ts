import { useEffect, useState } from "react";

export type EmailStatus = "active" | "archived" | "ignored" | "replied";

export type EmailState = {
  status: EmailStatus;
  replyDraft?: string;
};

const KEY = "isura.email-state.v1";
const EVENT = "isura.email-state.change";

type Store = Record<string, EmailState>;

function read(): Store {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Store) : {};
  } catch {
    return {};
  }
}

function write(s: Store) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s));
    window.dispatchEvent(new CustomEvent(EVENT));
  } catch {
    /* ignore */
  }
}

export function getEmailState(id: string): EmailState {
  return read()[id] ?? { status: "active" };
}

export function setStatus(id: string, status: EmailStatus) {
  const s = read();
  s[id] = { ...(s[id] ?? {}), status };
  write(s);
}

export function setReplyDraft(id: string, replyDraft: string) {
  const s = read();
  s[id] = { ...(s[id] ?? { status: "active" }), replyDraft };
  write(s);
}

export function resetEmail(id: string) {
  const s = read();
  delete s[id];
  write(s);
}

export function useEmailStore(): Store {
  const [state, setState] = useState<Store>(() => read());
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

export function useEmailState(id: string): EmailState {
  const store = useEmailStore();
  return store[id] ?? { status: "active" };
}
