import { AppHeader } from "@/components/layout/app-header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { getCurrentProfile } from "@/lib/auth/session";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAdmin } = await getCurrentProfile();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <AppHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-6 pb-24 md:py-8 md:pb-8">
        {children}
      </main>
      <MobileNav isAdmin={isAdmin} />
    </div>
  );
}
