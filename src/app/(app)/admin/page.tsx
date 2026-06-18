import { redirect } from "next/navigation";

import { AdminMatchForm } from "@/components/admin/admin-match-form";
import { PageHeader } from "@/components/ui/page-header";
import { getCurrentProfile } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const { isAdmin } = await getCurrentProfile();

  if (!isAdmin) {
    redirect("/jogos");
  }

  const supabase = await createClient();
  const { data: matches, error } = await supabase
    .from("matches")
    .select("*")
    .order("kickoff_at", { ascending: true });

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
        <h1 className="text-lg font-semibold">Erro ao carregar jogos</h1>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        badge="Admin"
        title="Gerenciar jogos"
        description="Atualize placares e status. Ao finalizar um jogo, a pontuação de todos os palpites é recalculada."
      />

      <div className="grid gap-4">
        {matches?.map((match) => (
          <AdminMatchForm key={match.id} match={match} />
        ))}
      </div>
    </div>
  );
}
