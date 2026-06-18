import Link from "next/link";

import { getCurrentProfile } from "@/lib/auth/session";

export async function AppHeader() {
  const { user, profile, isAdmin } = await getCurrentProfile();

  const displayName =
    profile?.display_name ?? user?.email?.split("@")[0] ?? "Jogador";

  return (
    <header className="pitch-gradient text-white shadow-lg">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#f0b429]">
            Copa do Mundo 2026
          </p>
          <Link
            href="/jogos"
            className="text-xl font-bold tracking-tight text-white hover:text-white/90"
          >
            PutsBoludo
          </Link>
        </div>

        <nav className="hidden flex-wrap items-center gap-1 text-sm md:flex">
          <Link href="/jogos" className="nav-link">
            Jogos
          </Link>
          <Link href="/ranking" className="nav-link">
            Ranking
          </Link>
          {isAdmin ? (
            <Link href="/admin" className="nav-link">
              Admin
            </Link>
          ) : null}
          <span className="mx-1 hidden h-5 w-px bg-white/25 sm:block" />
          <span className="hidden rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold text-white sm:inline">
            {displayName}
          </span>
          <form action="/auth/signout" method="post">
            <button type="submit" className="nav-link">
              Sair
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
