-- Execute este arquivo inteiro no SQL Editor do Supabase (Dashboard → SQL → New query)
-- Ou use: npm run db:apply (se DATABASE_URL estiver configurado)

\i supabase/migrations/20260611000001_initial_schema.sql
\i supabase/migrations/20260611000002_scoring.sql
\i supabase/migrations/20260611000003_rls.sql
\i supabase/migrations/20260611000004_seed_matches.sql
