# Migrations Supabase

Arquivos SQL versionados para o schema do bolão.

| Arquivo | Conteúdo |
|---------|----------|
| `20260611000001_initial_schema.sql` | Tabelas, índices, settings |
| `20260611000002_scoring.sql` | Funções e triggers de pontuação |
| `20260611000003_rls.sql` | Row Level Security |
| `20260611000004_seed_matches.sql` | Jogos iniciais da Copa 2026 |

## Aplicar

```bash
npm run db:concat   # gera apply_all_manual.sql
```

Depois execute `supabase/apply_all_manual.sql` no **SQL Editor** do Supabase.

Veja [docs/SETUP.md](../docs/SETUP.md) para o passo a passo completo.
