CREATE TABLE public.draft_states (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  draft_id text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'dismissed')),
  edited_body text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, draft_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.draft_states TO authenticated;
GRANT ALL ON public.draft_states TO service_role;

ALTER TABLE public.draft_states ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own draft states"
  ON public.draft_states
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER set_draft_states_updated_at
  BEFORE UPDATE ON public.draft_states
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();