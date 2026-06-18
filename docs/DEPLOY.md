# Deploy na Vercel

Guia passo a passo para colocar o PutsBoludo no ar para seu grupo.

## 1. Subir código no GitHub

```bash
git init   # se ainda não tiver
git add .
git commit -m "feat: bolão Copa 2026 pronto para deploy"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/puts-boludo-2026.git
git push -u origin main
```

## 2. Importar na Vercel

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Importe o repositório do GitHub
3. **Framework Preset:** Next.js (detectado automaticamente)
4. Não altere Build Command (`next build`) nem Output Directory

## 3. Variáveis de ambiente

Em **Settings → Environment Variables**, adicione para **Production** (e Preview se quiser):

| Variável | Obrigatória | Exemplo |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Sim | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sim | `eyJ...` |
| `NEXT_PUBLIC_APP_URL` | Sim | `https://puts-boludo.vercel.app` |
| `INVITE_CODE` | Sim | `putsboludo2026` |
| `CRON_SECRET` | Recomendado | string aleatória longa |
| `SUPABASE_SERVICE_ROLE_KEY` | Só sync API | ver Supabase → Settings → API |
| `API_FOOTBALL_KEY` | Opcional | ver docs/API_SYNC.md |

> **IMPORTANTE:** após o primeiro deploy, atualize `NEXT_PUBLIC_APP_URL` com a URL real da Vercel e faça **Redeploy**.

## 4. Configurar Supabase para produção

Em **Authentication → URL Configuration**:

| Campo | Valor |
|-------|-------|
| Site URL | `https://sua-url.vercel.app` |
| Redirect URLs | `https://sua-url.vercel.app/auth/callback` |

Se usar Google OAuth, nada muda no Google Console (redirect continua no Supabase).

## 5. Deploy

Clique **Deploy** ou faça push na branch `main` — a Vercel redeploya automaticamente.

## 6. Testar em produção

- [ ] Abrir a URL e criar conta com convite
- [ ] Login / logout
- [ ] Palpitar em um jogo
- [ ] Ver ranking
- [ ] Admin: lançar resultado (se for admin)
- [ ] No celular: **Adicionar à tela inicial** (PWA)

## 7. Compartilhar com o grupo

Envie:

- Link do site
- Código de convite (`INVITE_CODE`)
- Regras: placar exato 5 pts, vencedor 3 pts, palpite até o apito

## Cron (sync automático)

O arquivo `vercel.json` agenda `/api/cron/sync-matches` a cada hora.

1. Defina `CRON_SECRET` na Vercel (string aleatória)
2. A Vercel envia `Authorization: Bearer <CRON_SECRET>` automaticamente
3. Para sync real de placares, veja [API_SYNC.md](./API_SYNC.md)

> Cron jobs na Vercel exigem plano **Pro** em alguns casos. No Hobby, verifique limites atuais na documentação da Vercel.

## Domínio customizado (opcional)

1. Vercel → **Settings → Domains**
2. Adicione seu domínio
3. Atualize `NEXT_PUBLIC_APP_URL` e URLs no Supabase
4. Redeploy

## Troubleshooting

| Problema | Solução |
|----------|---------|
| Login redireciona errado | `NEXT_PUBLIC_APP_URL` e Supabase Site URL devem bater |
| Build falha | Confira se todas env vars obrigatórias estão na Vercel |
| Palpite não salva | RLS ok? Jogo ainda `scheduled` e antes do kickoff? |
| PWA não instala | Acesse via HTTPS; use Chrome/Safari no celular |
