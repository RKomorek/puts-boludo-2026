import { Suspense } from "react";

import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <div className="pitch-gradient px-4 py-10 text-center text-white">
        <p className="text-xs font-bold uppercase tracking-wider text-[#f0b429]">
          Copa do Mundo 2026
        </p>
        <h1 className="mt-2 text-3xl font-bold">PutsBoludo</h1>
        <p className="mt-2 text-sm text-white/85">
          Bolão entre amigos — palpite, dispute e zoe no ranking
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="card-surface w-full max-w-md p-8">
          <div className="mb-6 text-center">
            <h2 className="text-lg font-semibold text-boludo-text">
              Entrar no bolão
            </h2>
            <p className="mt-1 text-sm text-boludo-muted">
              Use seu convite para criar conta ou faça login.
            </p>
          </div>

          <Suspense
            fallback={<p className="text-sm text-boludo-muted">Carregando...</p>}
          >
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
