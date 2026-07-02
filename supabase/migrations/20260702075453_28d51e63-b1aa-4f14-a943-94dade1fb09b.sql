-- Enums for the governance layer
CREATE TYPE public.autonomy_category AS ENUM (
  'marketing','sales','finance','legal','calendar','email_followup','pricing','contracts','data'
);

CREATE TYPE public.autonomy_level AS ENUM (
  'level1_autonomous','level2_silent','level3_approval','level4_strategic'
);

CREATE TYPE public.decision_status AS ENUM (
  'pending','approved','rejected','executed','undone','expired'
);

CREATE TYPE public.risk_level AS ENUM ('low','medium','high','critical');

-- Per-user autonomy configuration (Permission Center)
CREATE TABLE public.permission_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  category public.autonomy_category NOT NULL,
  level public.autonomy_level NOT NULL DEFAULT 'level3_approval',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, category)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.permission_settings TO authenticated;
GRANT ALL ON public.permission_settings TO service_role;

ALTER TABLE public.permission_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own permission settings"
ON public.permission_settings FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Permanent decision timeline
CREATE TABLE public.decisions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  category public.autonomy_category NOT NULL,
  level public.autonomy_level NOT NULL,
  status public.decision_status NOT NULL DEFAULT 'pending',
  title text NOT NULL,
  recommendation text NOT NULL,
  reasoning text,
  evidence jsonb NOT NULL DEFAULT '[]'::jsonb,
  alternatives jsonb NOT NULL DEFAULT '[]'::jsonb,
  do_nothing_outcome text,
  confidence numeric,
  risk public.risk_level NOT NULL DEFAULT 'low',
  business_impact text,
  financial_impact text,
  proposed_by text NOT NULL DEFAULT 'ISURA',
  initiated_by text,
  approved_by text,
  approval_reason text,
  action_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  outcome text,
  executed_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.decisions TO authenticated;
GRANT ALL ON public.decisions TO service_role;

ALTER TABLE public.decisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own decisions"
ON public.decisions FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_decisions_user_status ON public.decisions (user_id, status, created_at DESC);

-- updated_at triggers (reuse existing set_updated_at())
CREATE TRIGGER trg_permission_settings_updated_at
BEFORE UPDATE ON public.permission_settings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_decisions_updated_at
BEFORE UPDATE ON public.decisions
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();