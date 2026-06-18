# PutsBoludo 2026

Bolão da Copa do Mundo 2026 para grupos de amigos. Cada participante palpita o placar dos jogos; quem acerta exatamente ganha **5 pontos**, quem acerta o vencedor (ou empate) ganha **3 pontos**.

Projeto open source — use, adapte e compartilhe com seu grupo.

## Funcionalidades (roadmap)

| Fase | Status | Conteúdo |
|------|--------|----------|
| **0 — Setup** | ✅ Concluída | Next.js, Supabase client, estrutura base, docs |
| **1 — Fundação** | ✅ Concluída | Schema DB, auth, RLS, seed de jogos, login |
| **2 — Core** | ✅ Concluída | Palpites, detalhe do jogo, tema visual |
| **3 — Admin** | ✅ Concluída | Painel admin, tema visual corrigido |
| **4 — Extras** | ✅ Concluída | PWA, mobile, deploy, cron sync (estrutura) |

## Regras do bolão

- **Placar exato:** 5 pontos
- **Vencedor ou empate correto:** 3 pontos (não acumula com placar exato)
- **Errou:** 0 pontos
- **Prazo:** palpites até o apito inicial; editável quantas vezes quiser antes disso
- **Placar oficial:** tempo regulamentar (90 min)
- **Jogo adiado:** palpites reabertos enquanto `status = postponed`
- **Visibilidade:** palpites de todos sempre visíveis (modo social)
- **Acesso:** cadastro fechado por código de convite

## Stack

- [Next.js 16](https://nextjs.org/) (App Router, TypeScript)
- [Supabase](https://supabase.com/) (PostgreSQL, Auth, RLS)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Zod](https://zod.dev/) — validação
- [date-fns](https://date-fns.org/) — datas e fusos

## Início rápido

```bash
# Clonar e instalar
git clone <url-do-repo>
cd PutsBoludo2026
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais Supabase

# Rodar em desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

Guia completo: [docs/SETUP.md](./docs/SETUP.md) · Deploy: [docs/DEPLOY.md](./docs/DEPLOY.md)

## Documentação

- [Setup local](./docs/SETUP.md)
- [Deploy na Vercel](./docs/DEPLOY.md)
- [Checklist e testes](./docs/CHECKLIST.md)
- [Sync API externa](./docs/API_SYNC.md)
- [Arquitetura](./docs/ARCHITECTURE.md)
- [Decisões do projeto](./docs/DECISIONS.md)
- [Como contribuir](./docs/CONTRIBUTING.md)

## Estrutura do projeto

```
src/
  app/              # Rotas Next.js (App Router)
  components/       # Componentes React (Fase 2+)
  lib/
    supabase/       # Clientes browser, server e middleware
    scoring.ts      # Lógica de pontuação
    constants.ts    # Constantes do bolão
  types/
    database.ts     # Tipos do Supabase
supabase/
  migrations/       # SQL migrations (Fase 1)
docs/               # Documentação
```

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Servidor de produção |
| `npm run lint` | ESLint |

## Licença

MIT — veja [LICENSE](./LICENSE).
