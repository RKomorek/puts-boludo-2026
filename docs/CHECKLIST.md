# PutsBoludo 2026 — Plano de ação

Use este arquivo para acompanhar o progresso, testar o bolão e anotar ideias suas e dos amigos.

**Legenda:** `[x]` feito · `[ ]` pendente · `[-]` opcional / depois

---

## Fase 0 — Setup

- [x] Projeto Next.js + TypeScript + Tailwind
- [x] Cliente Supabase (`@supabase/ssr`)
- [x] Estrutura de pastas e tipos
- [x] Documentação inicial (README, SETUP, ARCHITECTURE)
- [x] Licença MIT (open source)

---

## Fase 1 — Fundação

- [x] Migrations SQL no Supabase (schema, RLS, triggers)
- [x] Seed de jogos da Copa 2026
- [x] Trigger de perfil automático no cadastro
- [x] Login e-mail/senha
- [x] Login Google OAuth (precisa configurar no Supabase)
- [x] Cadastro fechado com código de convite
- [x] Middleware protegendo rotas
- [x] Páginas `/jogos` e `/ranking` (listagem básica)

**Você precisa confirmar no Supabase:**

- [ ] Migrations aplicadas (todas, incluindo `20260611000005`)
- [ ] `INVITE_CODE` no `.env` = código no banco (`settings.invite_code`)
- [ ] Auth → Site URL e Redirect URLs (local **e** produção)
- [ ] Google OAuth habilitado (se for usar)
- [ ] Você marcado como admin (`is_admin = true`)

---

## Fase 2 — Core do bolão

- [x] Formulário de palpite por jogo
- [x] Editar palpite até o apito inicial
- [x] Página `/jogos/[id]` com detalhe do jogo
- [x] Palpites de todos visíveis (modo social)
- [x] Pontuação automática 5 / 3 / 0
- [x] Ranking com desempate por placares exatos
- [x] Tema visual Copa (verde + dourado)

---

## Fase 3 — Admin

- [x] Painel `/admin` (só `is_admin`)
- [x] Lançar placar e status do jogo
- [x] Recálculo de pontos ao finalizar jogo
- [x] Link Admin no header (quem é admin)

---

## Fase 4 — Extras

- [x] PWA (manifest + ícones + instalar no celular)
- [x] Nav mobile (barra inferior)
- [x] Countdown “palpite fecha em X”
- [x] Deploy na Vercel
- [x] Docs de deploy (`docs/DEPLOY.md`)
- [x] Estrutura sync API (`/api/cron/sync-matches`) — **sem agendamento** (Hobby)
- [ ] Sync automático API-Football (futuro)
- [ ] Cron na Vercel (futuro — plano Pro ou 1×/dia no Hobby)

---

## Deploy e produção

- [x] Repositório no GitHub (`RKomorek/puts-boludo-2026`)
- [x] Projeto na Vercel
- [x] Branch de produção (`master`)
- [x] Remoção do cron que bloqueava deploy (Hobby)
- [ ] Variáveis de ambiente na Vercel conferidas
- [ ] `NEXT_PUBLIC_APP_URL` = URL real da Vercel
- [ ] Supabase Auth URLs apontando para produção
- [ ] Admin configurado no banco de **produção**
- [ ] Testado no celular (navegador + PWA)

**URL de produção:** `_________________________________`

---

## Roteiro de testes (marque conforme for testando)

### Conta e acesso

- [ ] Criar conta com código de convite (e-mail)
- [ ] Confirmar e-mail (se confirmação estiver ativa)
- [ ] Login com e-mail/senha
- [ ] Login com Google (se configurado)
- [ ] Tentar cadastro com convite errado → deve bloquear
- [ ] Logout

### Jogos e palpites

- [ ] Listar jogos em `/jogos`
- [ ] Abrir um jogo → `/jogos/[id]`
- [ ] Salvar palpite (placar casa × fora)
- [ ] Editar palpite antes do horário do jogo
- [ ] Ver palpites de outros participantes na mesma tela
- [ ] Countdown “Fecha em…” aparecendo
- [ ] Palpite bloqueado após kickoff / jogo finalizado

### Pontuação e ranking

- [ ] Palpite no jogo já finalizado (ex.: México 2×0) — conferir pontos
  - Placar exato → 5 pts
  - Acertou vencedor → 3 pts
  - Errou → 0 pts
- [ ] Ranking em `/ranking` atualiza após palpitar
- [ ] Top 3 com destaque visual

### Admin

- [ ] Acessar `/admin` (como admin)
- [ ] Usuário normal **não** acessa admin
- [ ] Lançar resultado de um jogo → pontos recalculam
- [ ] Marcar jogo como adiado → palpites reabrem

### Mobile / PWA

- [ ] Layout ok no celular
- [ ] Barra inferior (Jogos / Ranking / Admin)
- [ ] “Adicionar à tela inicial” funciona
- [ ] App abre em tela cheia (standalone)

---

## Ideias — suas

_Anote aqui enquanto testa:_

1.
2.
3.

---

## Ideias — amigos

_Cole feedback do grupo:_

| Quem | Ideia | Prioridade (alta/média/baixa) |
|------|-------|-------------------------------|
|      |       |                               |
|      |       |                               |
|      |       |                               |

---

## Backlog (não prioritário agora)

- [ ] Sync automático de placares (API-Football)
- [ ] Dark mode (escolha do usuário)
- [ ] Bandeiras / emojis dos times
- [ ] Notificação “faltam X min para fechar palpites”
- [ ] Histórico de palpites editados
- [ ] Gráfico de evolução no ranking
- [ ] Múltiplos bolões na mesma instância
- [ ] Compartilhar convite por link (`/login?invite=...`)
- [ ] Estatísticas (quem mais acerta exato, etc.)

---

## Comandos úteis

```bash
# Local
npm run dev

# Gerar SQL combinado (Supabase)
npm run db:concat

# Build de produção
npm run build
```

---

## Links rápidos

- [Setup local](./SETUP.md)
- [Deploy Vercel](./DEPLOY.md)
- [Sync API (futuro)](./API_SYNC.md)
- [Decisões do projeto](./DECISIONS.md)

**Última atualização:** junho 2026 — pós-deploy Vercel ✅
