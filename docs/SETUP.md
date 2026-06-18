# Setup e deploy

Guia para configurar o PutsBoludo 2026 do zero.

## Pré-requisitos

- Node.js 20+
- npm
- Conta no [Supabase](https://supabase.com/)
- (Opcional) Conta na [Vercel](https://vercel.com/) para deploy

## 1. Clonar e instalar

```bash
git clone <url-do-repo>
cd PutsBoludo2026
npm install
```

## 2. Criar projeto no Supabase

1. Acesse [supabase.com/dashboard](https://supabase.com/dashboard)
2. **New project** → escolha nome, senha do banco e região
3. Em **Settings → API**, copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 3. Variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite `.env.local`:

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave pública anon |
| `NEXT_PUBLIC_APP_URL` | URL do app (`http://localhost:3000` em dev) |
| `INVITE_CODE` | Código de convite para cadastro fechado |

> **Importante:** nunca commite `.env.local`. O `.env.example` pode ser commitado.

## 4. Auth no Supabase (Fase 1)

Na Fase 1, configure em **Authentication → Providers**:

### Email / senha
- Habilite **Email** provider
- **Desative Confirm email** — essencial para bolão entre amigos (evita limite de e-mails e cadastro instantâneo)
- Ajuste **Site URL** para `http://localhost:3000` (dev)
- Adicione redirect: `http://localhost:3000/auth/callback`
- **Não use** “Invite user” no dashboard — amigos cadastram pelo site com `INVITE_CODE`

Guia completo de problemas de auth: [AUTH.md](./AUTH.md)

### Google OAuth
1. Crie credenciais em [Google Cloud Console](https://console.cloud.google.com/)
2. Tipo: **OAuth 2.0 Client ID** (Web application)
3. Authorized redirect URI: `https://<seu-projeto>.supabase.co/auth/v1/callback`
4. Cole Client ID e Secret no Supabase → **Authentication → Providers → Google**

## 6. Migrations do banco

**Opção A — SQL Editor (mais simples)**

1. Gere o arquivo combinado (opcional): `npm run db:concat`
2. Abra o [SQL Editor](https://supabase.com/dashboard) do seu projeto
3. Copie todo o conteúdo de `supabase/apply_all_manual.sql`
4. Cole e clique em **Run**

**Opção B — Supabase CLI**

```bash
npx supabase login
npx supabase link --project-ref <seu-project-ref>
npx supabase db push
```

**Sincronizar código de convite**

O seed cria `settings.invite_code = 'putsboludo2026'`. Se você mudou `INVITE_CODE` no `.env.local`, atualize também no banco:

```sql
UPDATE settings SET invite_code = 'seu-codigo-aqui';
```

## 7. Rodar localmente

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) → faça login ou crie conta com o código de convite.

## 8. Deploy na Vercel

1. Importe o repositório na Vercel
2. Adicione as mesmas variáveis de `.env.local` em **Settings → Environment Variables**
3. Atualize no Supabase **Authentication → URL Configuration**:
   - Site URL: `https://seu-dominio.vercel.app`
   - Redirect URLs: `https://seu-dominio.vercel.app/auth/callback`

## 9. Primeiro admin

Após criar sua conta (Fase 1), marque-se como admin no SQL Editor:

```sql
UPDATE profiles SET is_admin = true WHERE id = '<seu-user-uuid>';
```

## Troubleshooting

| Problema | Solução |
|----------|---------|
| Build falha sem env | Copie `.env.example` → `.env.local` com valores reais |
| Auth redirect loop | Confira Site URL e redirect URLs no Supabase |
| Palpite não salva | Verifique RLS e se o jogo ainda não começou |
| Horário errado | Jogos são armazenados em UTC; exibição em `America/Sao_Paulo` |
| `email rate limit exceeded` | Desative Confirm email; não use Invite no Supabase — veja [AUTH.md](./AUTH.md) |
| Google não funciona | Configure Google provider + Google Cloud — veja [AUTH.md](./AUTH.md) |
