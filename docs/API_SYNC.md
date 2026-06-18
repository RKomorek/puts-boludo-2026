# Sync automático de jogos (API-Football)

Estrutura preparada na Fase 4. O painel **/admin** continua funcionando sem API externa.

## Status atual

- Rota cron: `GET /api/cron/sync-matches`
- Agendamento: a cada hora (`vercel.json`)
- Lógica de sync: **stub** — retorna mensagem até implementar a integração

## Quando implementar

Vale a pena se você cansar de lançar placar manualmente no admin. Para 15–20 amigos, o admin manual costuma bastar.

## Passos para ativar (futuro)

### 1. API-Football

1. Crie conta em [api-football.com](https://www.api-football.com/)
2. Copie a API key
3. Adicione na Vercel: `API_FOOTBALL_KEY`

### 2. Service Role (somente servidor)

1. Supabase → **Settings → API → service_role** (secret!)
2. Adicione na Vercel: `SUPABASE_SERVICE_ROLE_KEY`
3. **Nunca** exponha no client ou `NEXT_PUBLIC_*`

### 3. CRON_SECRET

String aleatória na Vercel para proteger a rota cron.

### 4. Implementar `src/lib/sync/matches.ts`

Fluxo sugerido:

```
1. GET fixtures da Copa 2026 (league/season)
2. Para cada jogo com external_id correspondente em `matches`:
   - Atualizar home_score, away_score, status
3. Trigger do Postgres recalcula pontos automaticamente
```

Mapeamento via coluna `matches.external_id` (já existe no seed).

### 5. Testar localmente

```bash
curl -H "Authorization: Bearer SEU_CRON_SECRET" \
  http://localhost:3000/api/cron/sync-matches
```

## Alternativas

| API | Observação |
|-----|------------|
| [API-Football](https://www.api-football.com/) | Boa cobertura, free limitado |
| [football-data.org](https://www.football-data.org/) | Free tier restrito |
| Manual (/admin) | ✅ Já funciona, zero config |

## Segurança

- Rota cron exige `Authorization: Bearer CRON_SECRET`
- Service role só no servidor (route handler / cron)
- Anon key continua no client para usuários normais
