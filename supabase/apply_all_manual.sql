-- >>> 20260611000001_initial_schema.sql

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

-- >>> 20260611000002_scoring.sql

-- Funções e triggers de pontuação

CREATE OR REPLACE FUNCTION public.calc_points(
  pred_home INT,
  pred_away INT,
  actual_home INT,
  actual_away INT
)
RETURNS INT
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  IF pred_home = actual_home AND pred_away = actual_away THEN
    RETURN 5;
  END IF;

  IF sign(pred_home - pred_away) = sign(actual_home - actual_away) THEN
    RETURN 3;
  END IF;

  RETURN 0;
END;
$$;

CREATE OR REPLACE FUNCTION public.recalculate_match_points()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF NEW.status = 'finished'
      AND NEW.home_score IS NOT NULL
      AND NEW.away_score IS NOT NULL THEN
      UPDATE public.predictions
      SET points = public.calc_points(
        home_score,
        away_score,
        NEW.home_score,
        NEW.away_score
      )
      WHERE match_id = NEW.id;
    END IF;

    IF NEW.status = 'postponed' AND OLD.status IS DISTINCT FROM 'postponed' THEN
      UPDATE public.predictions
      SET points = NULL
      WHERE match_id = NEW.id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER matches_recalculate_points
AFTER UPDATE OF status, home_score, away_score ON public.matches
FOR EACH ROW
EXECUTE FUNCTION public.recalculate_match_points();

CREATE OR REPLACE FUNCTION public.check_prediction_editable()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  match_record public.matches%ROWTYPE;
BEGIN
  SELECT *
  INTO match_record
  FROM public.matches
  WHERE id = NEW.match_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Jogo não encontrado';
  END IF;

  IF match_record.status = 'postponed' THEN
    RETURN NEW;
  END IF;

  IF match_record.status <> 'scheduled' THEN
    RAISE EXCEPTION 'Palpites fechados para este jogo';
  END IF;

  IF now() >= match_record.kickoff_at THEN
    RAISE EXCEPTION 'Palpites fechados: o jogo já iniciou';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER predictions_check_editable
BEFORE INSERT OR UPDATE ON public.predictions
FOR EACH ROW
EXECUTE FUNCTION public.check_prediction_editable();

-- >>> 20260611000003_rls.sql

-- Row Level Security

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Perfis visíveis para autenticados"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Usuário cria o próprio perfil"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Usuário edita o próprio perfil"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Configurações visíveis para autenticados"
ON public.settings
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Jogos visíveis para autenticados"
ON public.matches
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admin gerencia jogos"
ON public.matches
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND is_admin = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND is_admin = true
  )
);

CREATE POLICY "Palpites visíveis para autenticados"
ON public.predictions
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Usuário gerencia os próprios palpites"
ON public.predictions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuário atualiza os próprios palpites"
ON public.predictions
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- >>> 20260611000004_seed_matches.sql

-- Jogos iniciais — Copa do Mundo 2026 (fase de grupos, amostra)
-- Horários em UTC. Mexico City (UTC-6) na abertura ≈ 19:00 local.

INSERT INTO public.matches (home_team, away_team, kickoff_at, stage, external_id) VALUES
  ('México', 'África do Sul', '2026-06-12 01:00:00+00', 'Grupo A — Rodada 1', 'wc2026-a-mex-rsa'),
  ('Coreia do Sul', 'Europa B', '2026-06-12 04:00:00+00', 'Grupo A — Rodada 1', 'wc2026-a-kor-eub'),
  ('Canadá', 'Europeu A', '2026-06-13 01:00:00+00', 'Grupo B — Rodada 1', 'wc2026-b-can-eua'),
  ('Estados Unidos', 'Paraguai', '2026-06-13 04:00:00+00', 'Grupo D — Rodada 1', 'wc2026-d-usa-par'),
  ('Brasil', 'Marrocos', '2026-06-14 01:00:00+00', 'Grupo C — Rodada 1', 'wc2026-c-bra-mar'),
  ('Haiti', 'Escócia', '2026-06-14 04:00:00+00', 'Grupo C — Rodada 1', 'wc2026-c-hai-sco'),
  ('Qatar', 'Suíça', '2026-06-15 01:00:00+00', 'Grupo B — Rodada 1', 'wc2026-b-qat-sui'),
  ('Alemanha', 'Curaçao', '2026-06-15 04:00:00+00', 'Grupo E — Rodada 1', 'wc2026-e-ger-cuw'),
  ('Holanda', 'Japão', '2026-06-16 01:00:00+00', 'Grupo F — Rodada 1', 'wc2026-f-ned-jpn'),
  ('Colômbia', 'Europa D', '2026-06-16 04:00:00+00', 'Grupo D — Rodada 1', 'wc2026-d-col-eud'),
  ('México', 'Coreia do Sul', '2026-06-19 01:00:00+00', 'Grupo A — Rodada 2', 'wc2026-a-mex-kor'),
  ('África do Sul', 'Europa B', '2026-06-19 04:00:00+00', 'Grupo A — Rodada 2', 'wc2026-a-rsa-eub'),
  ('Brasil', 'Haiti', '2026-06-20 01:00:00+00', 'Grupo C — Rodada 2', 'wc2026-c-bra-hai'),
  ('Marrocos', 'Escócia', '2026-06-20 04:00:00+00', 'Grupo C — Rodada 2', 'wc2026-c-mar-sco'),
  ('Estados Unidos', 'Austrália', '2026-06-21 01:00:00+00', 'Grupo D — Rodada 2', 'wc2026-d-usa-aus'),
  ('Paraguai', 'Europeu A', '2026-06-21 04:00:00+00', 'Grupo D — Rodada 2', 'wc2026-d-par-eua');

-- Exemplo de jogo já finalizado (para testar pontuação na Fase 2)
UPDATE public.matches
SET home_score = 2,
    away_score = 0,
    status = 'finished'
WHERE external_id = 'wc2026-a-mex-rsa';

-- >>> 20260611000005_profile_trigger.sql

-- Cria perfil automaticamente quando usuário se cadastra com convite validado no app.
-- O app grava invite_validated: true em raw_user_meta_data no signUp.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  invite_ok BOOLEAN;
  profile_name TEXT;
BEGIN
  invite_ok := COALESCE((NEW.raw_user_meta_data ->> 'invite_validated')::BOOLEAN, false);

  IF NOT invite_ok THEN
    RETURN NEW;
  END IF;

  profile_name := COALESCE(
    NULLIF(trim(NEW.raw_user_meta_data ->> 'display_name'), ''),
    split_part(NEW.email, '@', 1),
    'Jogador'
  );

  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, profile_name)
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
