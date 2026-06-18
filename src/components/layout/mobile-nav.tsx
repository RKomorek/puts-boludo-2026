import Link from "next/link";

type MobileNavProps = {
  isAdmin: boolean;
};

export function MobileNav({ isAdmin }: MobileNavProps) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-boludo-border bg-boludo-card/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      aria-label="Navegação principal"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 py-2">
        <MobileNavLink href="/jogos" label="Jogos" icon="⚽" />
        <MobileNavLink href="/ranking" label="Ranking" icon="🏆" />
        {isAdmin ? (
          <MobileNavLink href="/admin" label="Admin" icon="⚙️" />
        ) : null}
      </div>
    </nav>
  );
}

function MobileNavLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: string;
}) {
  return (
    <Link
      href={href}
      className="flex min-w-[72px] flex-col items-center gap-0.5 rounded-xl px-3 py-2 text-boludo-muted transition active:bg-boludo-primary-light active:text-boludo-primary-dark"
    >
      <span className="text-lg leading-none" aria-hidden>
        {icon}
      </span>
      <span className="text-[11px] font-semibold">{label}</span>
    </Link>
  );
}
