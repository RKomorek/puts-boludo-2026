# Auth — Supabase e Google

Guia para resolver cadastro, limite de e-mail e login com Google.

---

## Problema 1: `email rate limit exceeded` (429)

### O que aconteceu

O Supabase **free tier** limita quantos e-mails de auth podem ser enviados por hora (confirmação de cadastro, convites do dashboard, reset de senha, etc.). Seu log mostra isso no endpoint `/invite` e no cadastro do site.

### O que fazer AGORA (recomendado para bolão entre amigos)

1. Supabase → **Authentication** → **Providers** → **Email**
2. Desligue **Confirm email** (confirmação de e-mail)
3. Salve

Com isso, o cadastro pelo site **não envia e-mail** → entra direto, sem bater no limite.

### O que NÃO fazer

- **Não use** “Invite user” no Supabase (Authentication → Users → Invite). Isso também gasta cota de e-mail e duplica o fluxo — o bolão já tem **código de convite no site**.

### Como os amigos devem se cadastrar

1. Abrir `https://puts-boludo-2026.vercel.app/login`
2. Aba **Criar conta**
3. Preencher nome, e-mail, senha e **código de convite**
4. Clicar **Criar conta** → deve ir direto para `/jogos`

### Se alguém ficou “preso” sem confirmar e-mail

No Supabase → **Authentication** → **Users** → abra o usuário → **Confirm user** manualmente.

Ou no SQL Editor:

```sql
UPDATE auth.users
SET email_confirmed_at = now()
WHERE email = 'email@do-amigo.com';
```

### Limite ainda ativo?

Aguarde **~1 hora** para o contador resetar. Depois disso, com **Confirm email OFF**, novos cadastros não devem disparar e-mail.

### Futuro (muitos usuários)

Configure **SMTP customizado** (Resend, SendGrid, etc.) em Supabase → **Project Settings** → **Auth** → **SMTP Settings**.

---

## Problema 2: Login com Google não funciona

### Checklist Supabase

**Authentication → URL Configuration**

| Campo | Valor |
|-------|--------|
| Site URL | `https://puts-boludo-2026.vercel.app` |
| Redirect URLs | `https://puts-boludo-2026.vercel.app/auth/callback` |
| | `http://localhost:3000/auth/callback` (dev) |

**Authentication → Providers → Google**

- [ ] Provider **Enabled**
- [ ] Client ID preenchido
- [ ] Client Secret preenchido

### Checklist Google Cloud Console

1. [console.cloud.google.com](https://console.cloud.google.com/)
2. Projeto → **APIs & Services** → **OAuth consent screen**
   - Tipo: External (ou Internal se for Workspace)
   - Preencha app name, e-mail de suporte
   - Adicione seu e-mail em **Test users** (enquanto app estiver em “Testing”)
3. **Credentials** → **Create Credentials** → **OAuth client ID**
   - Tipo: **Web application**
   - **Authorized redirect URIs** (copie exatamente):

```
https://jyltfhagbvsfszbbuqja.supabase.co/auth/v1/callback
```

> Troque `jyltfhagbvsfszbbuqja` se seu project ref for outro (Settings → General no Supabase).

4. Copie **Client ID** e **Client Secret** → cole no Supabase (Google provider)

### Vercel

Confirme na Vercel → **Environment Variables**:

```
NEXT_PUBLIC_APP_URL=https://puts-boludo-2026.vercel.app
```

Redeploy após alterar.

### Como usar Google no site

| Ação | Passos |
|------|--------|
| **Conta nova** | Aba **Criar conta** → preencher **código de convite** → **Continuar com Google** |
| **Já tem conta** | Aba **Entrar** → **Continuar com Google** |

Conta nova sem convite → erro “Conta nova exige código de convite”.

### Erros comuns

| Sintoma | Causa |
|---------|--------|
| Redirect para login genérico | URL Configuration errada ou Google provider off |
| `redirect_uri_mismatch` | URI no Google Console ≠ `...supabase.co/auth/v1/callback` |
| Google abre e volta com erro | App em Testing e e-mail do amigo não está em Test users |
| “Código de convite” após Google | Cadastro novo sem convite na aba Criar conta |

---

## Resumo para mandar no grupo

```
Bolão PutsBoludo — como entrar:

1. Acesse: https://puts-boludo-2026.vercel.app/login
2. Criar conta → nome, e-mail, senha, código de convite: XXXXX
3. Ou Entrar se já tiver conta

Google: na primeira vez use "Criar conta" + convite + Google.
Não precisa esperar e-mail de confirmação.
```

Substitua `XXXXX` pelo seu `INVITE_CODE`.

---

## Links

- [Setup geral](./SETUP.md)
- [Deploy Vercel](./DEPLOY.md)
