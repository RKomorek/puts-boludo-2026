# Decisões do projeto

Registro das decisões tomadas para manter consistência durante o desenvolvimento e para quem for usar o projeto open source.

## Produto

| Decisão | Escolha | Motivo |
|---------|---------|--------|
| Palpites visíveis antes do jogo? | **Sempre visíveis** | Modo social entre amigos |
| Quem entra no bolão? | **Convite fechado** | Cadastro só com código/link |
| Placar oficial | **90 min (tempo regulamentar)** | Padrão de bolão |
| Jogo adiado/cancelado | **Reabrir palpites** se `status = postponed` | Justo para todos |
| Fonte dos jogos | **Manual no MVP**, API na Fase 2+ | Menos complexidade inicial |
| Tamanho do grupo | **15–20 pessoas** | Free tier Supabase/Vercel |

## Pontuação

| Resultado | Pontos |
|-----------|--------|
| Placar exato | 5 |
| Vencedor ou empate correto | 3 |
| Errou | 0 |

> Placar exato **não** soma +3. Ou 5, ou 3, ou 0.

## Auth

| Decisão | Escolha |
|---------|---------|
| Providers | Google OAuth **e** email/senha |
| Sessão | Cookies via `@supabase/ssr` |

## Stack

| Camada | Tecnologia |
|--------|------------|
| Frontend + API | Next.js 16 (App Router) |
| Banco + Auth | Supabase |
| Deploy | Vercel |
| Validação | Zod |
| Datas | date-fns + date-fns-tz |
| Estilo | Tailwind CSS 4 |

## Desempate no ranking (sugerido)

1. Mais pontos totais
2. Mais placares exatos (5 pts)
3. (Opcional) Critério manual definido pelo grupo

## Fora de escopo (por enquanto)

- Prorrogação e pênaltis no placar
- Múltiplos bolões/grupos na mesma instância
- Apostas com dinheiro real
- App nativo (PWA é Fase 4)

## Histórico

| Data | Decisão |
|------|---------|
| 2026-06-11 | Kickoff do projeto, stack Next.js + Supabase |
| 2026-06-11 | Regras de produto e auth definidas pelo grupo |
