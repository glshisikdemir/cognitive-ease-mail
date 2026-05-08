import { useEffect, useState } from "react";

const KEY = "isura.archived";

function read(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

export function archiveEmails(ids: string[]) {
  const s = read();
  for (const id of ids) s.add(id);
  localStorage.setItem(KEY, JSON.stringify([...s]));
  emit();
}

export function unarchive(id: string) {
  const s = read();
  s.delete(id);
  localStorage.setItem(KEY, JSON.stringify([...s]));
  emit();
}

export function useArchived(): Set<string> {
  const [state, setState] = useState<Set<string>>(() => new Set());
  useEffect(() => {
    setState(read());
    const l = () => setState(read());
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  return state;
}
