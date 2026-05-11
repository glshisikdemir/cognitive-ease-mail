-- ISURA Waitlist — production-grade schema (text-based, no citext dep)

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'waitlist_onboarding_status') THEN
    CREATE TYPE public.waitlist_onboarding_status AS ENUM (
      'pending', 'invited', 'onboarded', 'declined', 'archived'
    );
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'waitlist_lang') THEN
    CREATE TYPE public.waitlist_lang AS ENUM ('en', 'tr');
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS public.waitlist_signups (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email                TEXT NOT NULL,
  name                 TEXT,
  company              TEXT,
  role                 TEXT,
  language             public.waitlist_lang NOT NULL DEFAULT 'en',
  onboarding_status    public.waitlist_onboarding_status NOT NULL DEFAULT 'pending',
  notes                TEXT,
  source               TEXT NOT NULL DEFAULT 'landing',
  ip_hash              TEXT,
  user_agent           TEXT,
  confirmation_sent_at TIMESTAMPTZ,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT waitlist_email_format_chk
    CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(email) <= 320),
  CONSTRAINT waitlist_name_len_chk    CHECK (name    IS NULL OR length(name)    <= 120),
  CONSTRAINT waitlist_company_len_chk CHECK (company IS NULL OR length(company) <= 160),
  CONSTRAINT waitlist_role_len_chk    CHECK (role    IS NULL OR length(role)    <= 120),
  CONSTRAINT waitlist_notes_len_chk   CHECK (notes   IS NULL OR length(notes)   <= 2000),
  CONSTRAINT waitlist_source_len_chk  CHECK (length(source) <= 60)
);

CREATE UNIQUE INDEX IF NOT EXISTS waitlist_signups_email_lower_uidx
  ON public.waitlist_signups ((lower(email)));

CREATE INDEX IF NOT EXISTS waitlist_signups_status_idx
  ON public.waitlist_signups (onboarding_status, created_at DESC);

DROP TRIGGER IF EXISTS waitlist_signups_set_updated_at ON public.waitlist_signups;
CREATE TRIGGER waitlist_signups_set_updated_at
  BEFORE UPDATE ON public.waitlist_signups
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- RLS — denies all browser-side access. Backend (service role) only.
ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.waitlist_signups IS
  'ISURA private-pilot waitlist. Writes only via backend server function; no browser-side reads or writes. Emails are never publicly exposed.';
