import { useEffect, useState } from "react";

export type SentEmail = {
  id: string;
  to: string;
  subject: string;
  body: string;
  sentAt: string; // ISO
  via: "voice" | "written";
};

const KEY = "isura.sent-emails.v1";
const EVENT = "isura.sent-emails.change";

function read(): SentEmail[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SentEmail[]) : [];
  } catch {
    return [];
  }
}

function write(list: SentEmail[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent(EVENT));
  } catch {
    /* ignore */
  }
}

export type NewSentEmail = {
  to: string;
  subject: string;
  body: string;
  via: SentEmail["via"];
};

export function addSentEmail(input: NewSentEmail): SentEmail {
  const email: SentEmail = {
    id: `s-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    to: input.to.trim(),
    subject: input.subject.trim(),
    body: input.body.trim(),
    sentAt: new Date().toISOString(),
    via: input.via,
  };
  write([email, ...read()]);
  return email;
}

export function removeSentEmail(id: string) {
  write(read().filter((e) => e.id !== id));
}

export function useSentEmails(): SentEmail[] {
  const [list, setList] = useState<SentEmail[]>(() => read());
  useEffect(() => {
    setList(read());
    const sync = () => setList(read());
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
  return list;
}
