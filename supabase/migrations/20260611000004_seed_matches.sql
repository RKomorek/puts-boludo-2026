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
