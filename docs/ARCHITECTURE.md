# Arquitetura

Visão geral técnica do PutsBoludo 2026.

## Diagrama

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js (Vercel)                      │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐ │
│  │   Pages     │  │ Server       │  │  Middleware     │ │
│  │   (React)   │──│ Actions /    │──│  (auth refresh) │ │
│  │             │  │ Route Handlers│  │                 │ │
│  └─────────────┘  └──────────────┘  └─────────────────┘ │
└──────────────────────────┬──────────────────────────────┘
                           │ @supabase/ssr
┌──────────────────────────▼──────────────────────────────┐
│                      Supabase                            │
│  ┌──────────┐  ┌────────────┐  ┌─────────────────────┐  │
│  │   Auth   │  │ PostgreSQL │  │  RLS + Triggers     │  │
│  │ Google + │  │ profiles   │  │  bloqueio pós-      │  │
│  │  Email   │  │ matches    │  │  kickoff, scoring   │  │
│  └──────────┘  │ predictions│  └─────────────────────┘  │
│                │ settings   │                            │
│                └────────────┘                            │
└─────────────────────────────────────────────────────────┘
                           ▲
                           │ Fase 4
                    ┌──────┴───────┐
                    │ API-Football │
                    │ (cron sync)  │
                    └──────────────┘
```

## Modelo de dados

### `profiles`
Extensão de `auth.users`. Nome de exibição, avatar, flag de admin.

### `matches`
Jogos da Copa: times, horário (`kickoff_at` em UTC), placar, status, fase.

**Status:** `scheduled` | `live` | `finished` | `postponed`

### `predictions`
Um palpite por usuário por jogo. Pontos calculados quando o jogo termina.

**Constraint:** `UNIQUE(user_id, match_id)`

### `settings`
Configuração global: pontos por acerto, visibilidade de palpites, código de convite.

## Regras de negócio

### Pontuação

Implementada em `src/lib/scoring.ts` e replicada no PostgreSQL (trigger/função na Fase 1):

```
placar exato     → 5 pts
vencedor/empate  → 3 pts (se não foi exato)
errou            → 0 pts
```

### Prazo de palpite

- Permitido enquanto `now() < kickoff_at` e `status = scheduled`
- Reaberto se `status = postponed`
- Bloqueado em `live` e `finished`

Validação em **três camadas:**
1. UI (desabilita formulário)
2. Server Action (validação Zod + regra de horário)
3. RLS / trigger no Postgres (última linha de defesa)

### Visibilidade de palpites

Modo **always**: todos veem palpites de todos a qualquer momento.

### Cadastro fechado

Na Fase 1, signup exige `INVITE_CODE` válido (validado no server antes de criar conta).

## Auth

| Provider | Uso |
|----------|-----|
| Email/senha | Fallback para quem não usa Google |
| Google OAuth | Login rápido |

Fluxo OAuth: `/login` → Supabase → `/auth/callback` → app.

Middleware (`src/middleware.ts`) renova sessão em cada request.

## Clientes Supabase

| Arquivo | Contexto |
|---------|----------|
| `lib/supabase/client.ts` | Browser (Client Components) |
| `lib/supabase/server.ts` | Server Components, Actions |
| `lib/supabase/middleware.ts` | Edge middleware |

## Rotas planejadas

| Rota | Descrição |
|------|-----------|
| `/` | Landing / redirect se logado |
| `/login` | Login e cadastro com convite |
| `/auth/callback` | Callback OAuth |
| `/jogos` | Lista de jogos |
| `/jogos/[id]` | Detalhe + palpites do grupo |
| `/ranking` | Classificação geral |
| `/admin` | Inserir resultados (admin) |

## Fuso horário

- **Armazenamento:** UTC (`timestamptz` no Postgres)
- **Exibição:** `America/Sao_Paulo` via `date-fns-tz`
- Kickoff nunca convertido de forma ambígua — sempre referência UTC do apito

## Segurança (RLS)

| Operação | Quem |
|----------|------|
| Ler jogos | Usuário autenticado |
| Ler palpites | Usuário autenticado |
| Criar/editar palpite próprio | Dono, antes do kickoff |
| Atualizar placar do jogo | `is_admin = true` |

## Escala

Projetado para **15–20 usuários**. Supabase free tier e Vercel hobby são suficientes.

## Fase 4 — Sync externo

Cron na Vercel chama Edge Function ou Route Handler que consulta API-Football, atualiza `matches` e dispara recálculo de pontos. Manual admin permanece como fallback.
