// Server functions for persisting per-user draft decisions.
//
// Each authenticated user gets their own row per draft (unique on
// user_id + draft_id). This is what makes drafts survive logout/login:
// the decision (pending / approved / dismissed) and any edited body are
// stored in the `draft_states` table, scoped by RLS to the current user.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type DraftStatus = "pending" | "approved" | "dismissed";

export interface DraftStateDTO {
  draftId: string;
  status: DraftStatus;
  editedBody: string | null;
}

const SaveInput = z.object({
  draftId: z.string().trim().min(1).max(120),
  status: z.enum(["pending", "approved", "dismissed"]),
  editedBody: z.string().max(20000).nullable().optional(),
});

// Load every saved draft state for the signed-in user.
export const getDraftStates = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<DraftStateDTO[]> => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("draft_states")
      .select("draft_id, status, edited_body")
      .eq("user_id", userId);

    if (error) {
      console.error("[draft-states] load failed", { code: (error as { code?: string }).code });
      throw new Error("Could not load draft states");
    }

    return (data ?? []).map((row) => ({
      draftId: row.draft_id,
      status: row.status as DraftStatus,
      editedBody: row.edited_body ?? null,
    }));
  });

// Upsert a single draft's state for the signed-in user.
export const saveDraftState = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => SaveInput.parse(data))
  .handler(async ({ data, context }): Promise<DraftStateDTO> => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("draft_states")
      .upsert(
        {
          user_id: userId,
          draft_id: data.draftId,
          status: data.status,
          edited_body: data.editedBody ?? null,
        },
        { onConflict: "user_id,draft_id" },
      )
      .select("draft_id, status, edited_body")
      .single();

    if (error || !row) {
      console.error("[draft-states] save failed", { code: (error as { code?: string })?.code });
      throw new Error("Could not save draft state");
    }

    return {
      draftId: row.draft_id,
      status: row.status as DraftStatus,
      editedBody: row.edited_body ?? null,
    };
  });
