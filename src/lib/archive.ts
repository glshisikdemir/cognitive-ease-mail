// Backwards-compat shim — delegates to the unified email store.
import { useMemo } from "react";
import { useEmailStore, setStatus, resetEmail } from "./email-store";

export function archiveEmails(ids: string[]) {
  for (const id of ids) setStatus(id, "archived");
}

export function unarchive(id: string) {
  resetEmail(id);
}

export function clearArchive() {
  // No-op kept for compatibility.
}

export function useArchived(): Set<string> {
  const store = useEmailStore();
  return useMemo(() => {
    const s = new Set<string>();
    for (const [id, st] of Object.entries(store)) {
      if (st.status === "archived") s.add(id);
    }
    return s;
  }, [store]);
}
