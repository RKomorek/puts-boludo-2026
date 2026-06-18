"use client";

import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";

import {
  type AuthActionState,
  signInWithEmail,
  signUpWithEmail,
  startGoogleAuth,
} from "@/lib/actions/auth";

const initialState: AuthActionState = {};

const errorMessages: Record<string, string> = {
  auth_failed: "Não foi possível concluir o login. Tente novamente.",
  oauth_failed:
    "Erro no login com Google. Confira se o Google está configurado no Supabase (docs/AUTH.md).",
  invite_required:
    "Conta nova exige código de convite. Use a aba Criar conta, preencha o convite e tente o Google de novo.",
  profile_failed: "Erro ao criar perfil. Tente novamente.",
};

function Field({
  label,
  name,
  type = "text",
  required = true,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-boludo-text">{label}</span>
      <input
        className="input-field w-full"
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
      />
    </label>
  );
}

export function LoginForm() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [signInState, signInAction, signInPending] = useActionState(
    signInWithEmail,
    initialState,
  );
  const [signUpState, signUpAction, signUpPending] = useActionState(
    signUpWithEmail,
    initialState,
  );
  const [googleState, googleAction, googlePending] = useActionState(
    startGoogleAuth,
    initialState,
  );

  const queryError = searchParams.get("error");
  const queryDetail = searchParams.get("detail");
  const state = mode === "signin" ? signInState : signUpState;
  const error =
    state.error ??
    googleState.error ??
    (queryError
      ? queryDetail
        ? `${errorMessages[queryError] ?? queryError} (${decodeURIComponent(queryDetail)})`
        : (errorMessages[queryError] ?? queryError)
      : undefined);
  const success = state.success ?? googleState.success;
  const pending = signInPending || signUpPending || googlePending;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 rounded-lg bg-boludo-primary-light p-1">
        <button
          type="button"
          className={`rounded-md px-3 py-2 text-sm font-medium transition ${
            mode === "signin"
              ? "bg-white text-boludo-primary-dark shadow-sm"
              : "text-boludo-muted"
          }`}
          onClick={() => setMode("signin")}
        >
          Entrar
        </button>
        <button
          type="button"
          className={`rounded-md px-3 py-2 text-sm font-medium transition ${
            mode === "signup"
              ? "bg-white text-boludo-primary-dark shadow-sm"
              : "text-boludo-muted"
          }`}
          onClick={() => setMode("signup")}
        >
          Criar conta
        </button>
      </div>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {success ? (
        <p className="rounded-lg border border-boludo-primary/20 bg-boludo-primary-light px-3 py-2 text-sm text-boludo-primary-dark">
          {success}
        </p>
      ) : null}

      {mode === "signin" ? (
        <form action={signInAction} className="space-y-4">
          <Field
            label="E-mail"
            name="email"
            type="email"
            autoComplete="email"
          />
          <Field
            label="Senha"
            name="password"
            type="password"
            autoComplete="current-password"
          />
          <button
            type="submit"
            disabled={pending}
            className="btn-primary w-full px-4 py-2.5 text-sm"
          >
            {signInPending ? "Entrando..." : "Entrar"}
          </button>
        </form>
      ) : (
        <form action={signUpAction} className="space-y-4">
          <Field
            label="Nome no bolão"
            name="displayName"
            autoComplete="name"
          />
          <Field
            label="E-mail"
            name="email"
            type="email"
            autoComplete="email"
          />
          <Field
            label="Senha"
            name="password"
            type="password"
            autoComplete="new-password"
          />
          <Field
            label="Código de convite"
            name="inviteCode"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={pending}
            className="btn-primary w-full px-4 py-2.5 text-sm"
          >
            {signUpPending ? "Criando conta..." : "Criar conta"}
          </button>
        </form>
      )}

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-boludo-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-boludo-card px-2 text-boludo-muted">ou</span>
        </div>
      </div>

      <form action={googleAction} className="space-y-3">
        <input type="hidden" name="mode" value={mode} />
        {mode === "signup" ? (
          <Field
            label="Código de convite (obrigatório no cadastro)"
            name="inviteCode"
            autoComplete="off"
          />
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="btn-secondary flex w-full items-center justify-center gap-2 px-4 py-2.5 text-sm disabled:opacity-60"
        >
          {googlePending ? "Redirecionando..." : "Continuar com Google"}
        </button>
      </form>
    </div>
  );
}
