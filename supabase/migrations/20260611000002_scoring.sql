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
