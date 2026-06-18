-- PutsBoludo 2026 — schema inicial

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE public.match_status AS ENUM (
  'scheduled',
  'live',
  'finished',
  'postponed'
);

CREATE TYPE public.prediction_visibility AS ENUM (
  'always',
  'after_kickoff'
);

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  display_name TEXT NOT NULL CHECK (char_length(trim(display_name)) >= 2),
  avatar_url TEXT,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exact_score_points INT NOT NULL DEFAULT 5 CHECK (exact_score_points >= 0),
  correct_winner_points INT NOT NULL DEFAULT 3 CHECK (correct_winner_points >= 0),
  predictions_visible public.prediction_visibility NOT NULL DEFAULT 'always',
  invite_code TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  kickoff_at TIMESTAMPTZ NOT NULL,
  home_score INT CHECK (home_score IS NULL OR home_score >= 0),
  away_score INT CHECK (away_score IS NULL OR away_score >= 0),
  status public.match_status NOT NULL DEFAULT 'scheduled',
  stage TEXT NOT NULL,
  external_id TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT scores_required_when_finished CHECK (
    status <> 'finished'
    OR (home_score IS NOT NULL AND away_score IS NOT NULL)
  )
);

CREATE TABLE public.predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  match_id UUID NOT NULL REFERENCES public.matches (id) ON DELETE CASCADE,
  home_score INT NOT NULL CHECK (home_score >= 0 AND home_score <= 99),
  away_score INT NOT NULL CHECK (away_score >= 0 AND away_score <= 99),
  points INT CHECK (points IS NULL OR points >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, match_id)
);

CREATE INDEX idx_matches_kickoff_at ON public.matches (kickoff_at);
CREATE INDEX idx_matches_status ON public.matches (status);
CREATE INDEX idx_predictions_match_id ON public.predictions (match_id);
CREATE INDEX idx_predictions_user_id ON public.predictions (user_id);

INSERT INTO public.settings (invite_code)
VALUES ('putsboludo2026');

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER predictions_set_updated_at
BEFORE UPDATE ON public.predictions
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();
