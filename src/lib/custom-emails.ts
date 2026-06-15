import { useEffect, useState } from "react";
import type { Email } from "./emails";

const KEY = "isura.custom-emails.v1";
const EVENT = "isura.custom-emails.change";

function read(): Email[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Email[]) : [];
  } catch {
    return [];
  }
}

function write(list: Email[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent(EVENT));
  } catch {
    /* ignore */
  }
}

export type NewEmailInput = {
  sender: string;
  senderEmail: string;
  subject: string;
  body: string;
  language?: "en" | "tr";
};

export function addCustomEmail(input: NewEmailInput): Email {
  const body = input.body.trim();
  const email: Email = {
    id: `u-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    sender: input.sender.trim() || input.senderEmail.trim(),
    senderEmail: input.senderEmail.trim(),
    subject: input.subject.trim(),
    preview: body.replace(/\s+/g, " ").slice(0, 140),
    body,
    receivedAt: new Date().toISOString(),
    language: input.language ?? (/[çğıöşü]/i.test(body) ? "tr" : "en"),
  };
  write([email, ...read()]);
  return email;
}

export function removeCustomEmail(id: string) {
  write(read().filter((e) => e.id !== id));
}

export function getCustomEmail(id: string): Email | undefined {
  return read().find((e) => e.id === id);
}

export function useCustomEmails(): Email[] {
  const [list, setList] = useState<Email[]>(() => read());
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
