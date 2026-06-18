"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { formatAuthError } from "@/lib/auth/errors";
import { INVITE_COOKIE, validateInviteCode } from "@/lib/auth/invite";
import { ensureUserProfile } from "@/lib/auth/profile";
import { createClient } from "@/lib/supabase/server";
import {
  googleAuthSchema,
  signInSchema,
  signUpSchema,
} from "@/lib/validations/auth";

export type AuthActionState = {
  error?: string;
  success?: string;
};

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export async function signInWithEmail(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: "E-mail ou senha incorretos." };
  }

  const profileResult = await ensureUserProfile(supabase, data.user);

  if (!profileResult.ok) {
    await supabase.auth.signOut();

    if (profileResult.reason === "insert_failed") {
      return { error: "Não foi possível criar seu perfil. Tente novamente." };
    }

    return {
      error: "Conta sem acesso ao bolão. Crie uma conta com código de convite.",
    };
  }

  redirect("/jogos");
}

export async function signUpWithEmail(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = signUpSchema.safeParse({
    displayName: formData.get("displayName"),
    email: formData.get("email"),
    password: formData.get("password"),
    inviteCode: formData.get("inviteCode"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  if (!validateInviteCode(parsed.data.inviteCode)) {
    return { error: "Código de convite inválido." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        display_name: parsed.data.displayName,
        invite_validated: true,
      },
      emailRedirectTo: `${getAppUrl()}/auth/callback`,
    },
  });

  if (error) {
    return { error: formatAuthError(error.message) };
  }

  if (data.user && data.session) {
    const profileResult = await ensureUserProfile(supabase, data.user);

    if (!profileResult.ok) {
      return { error: "Não foi possível criar seu perfil. Tente novamente." };
    }

    redirect("/jogos");
  }

  return {
    success:
      "Conta criada! Confirme o e-mail (se solicitado) e depois faça login.",
  };
}

export async function startGoogleAuth(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = googleAuthSchema.safeParse({
    inviteCode: formData.get("inviteCode") || undefined,
    mode: formData.get("mode"),
  });

  if (!parsed.success) {
    return { error: "Não foi possível iniciar login com Google." };
  }

  if (parsed.data.mode === "signup") {
    if (!parsed.data.inviteCode || !validateInviteCode(parsed.data.inviteCode)) {
      return { error: "Informe um código de convite válido para criar conta." };
    }

    const cookieStore = await cookies();
    cookieStore.set(INVITE_COOKIE, "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10,
      path: "/",
    });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${getAppUrl()}/auth/callback`,
    },
  });

  if (error || !data.url) {
    return {
      error: error
        ? formatAuthError(error.message)
        : "Google OAuth não configurado no Supabase. Veja docs/AUTH.md",
    };
  }

  redirect(data.url);
}
