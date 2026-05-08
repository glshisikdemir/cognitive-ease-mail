import { useEffect, useState } from "react";

const KEY = "isura.archived";
const EVENT = "isura.archived.change";

function read(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function write(s: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify([...s]));
    // Notify same-tab subscribers (storage event only fires across tabs)
    window.dispatchEvent(new CustomEvent(EVENT));
  } catch {
    /* quota / private mode — ignore */
  }
}

export function archiveEmails(ids: string[]) {
  if (ids.length === 0) return;
  const s = read();
  for (const id of ids) s.add(id);
  write(s);
}

export function unarchive(id: string) {
  const s = read();
  if (!s.delete(id)) return;
  write(s);
}

export function clearArchive() {
  write(new Set());
}

export function useArchived(): Set<string> {
  const [state, setState] = useState<Set<string>>(() => read());

  useEffect(() => {
    // Re-read on mount (covers SSR hydration where read() returned empty)
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
