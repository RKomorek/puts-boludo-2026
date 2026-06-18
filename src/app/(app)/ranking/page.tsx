import { PageHeader } from "@/components/ui/page-header";
import { createClient } from "@/lib/supabase/server";

type RankingRow = {
  id: string;
  display_name: string;
  total_points: number;
  exact_scores: number;
  predictions_count: number;
};

function getRankRowClass(index: number): string {
  if (index === 0) return "rank-gold";
  if (index === 1) return "rank-silver";
  if (index === 2) return "rank-bronze";
  return "";
}

function getRankMedal(index: number): string | null {
  if (index === 0) return "🥇";
  if (index === 1) return "🥈";
  if (index === 2) return "🥉";
  return null;
}

export default async function RankingPage() {
  const supabase = await createClient();

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, display_name")
    .order("display_name");

  const { data: predictions, error: predictionsError } = await supabase
    .from("predictions")
    .select("user_id, points");

  if (profilesError || predictionsError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
        <h1 className="text-lg font-semibold">Erro ao carregar ranking</h1>
        <p className="mt-2 text-sm">
          Verifique se as migrations foram aplicadas no Supabase.
        </p>
      </div>
    );
  }

  const rankingMap = new Map<string, RankingRow>();

  for (const profile of profiles ?? []) {
    rankingMap.set(profile.id, {
      id: profile.id,
      display_name: profile.display_name,
      total_points: 0,
      exact_scores: 0,
      predictions_count: 0,
    });
  }

  for (const prediction of predictions ?? []) {
    const row = rankingMap.get(prediction.user_id);
    if (!row) continue;

    row.predictions_count += 1;
    row.total_points += prediction.points ?? 0;
    if (prediction.points === 5) {
      row.exact_scores += 1;
    }
  }

  const ranking = [...rankingMap.values()].sort((a, b) => {
    if (b.total_points !== a.total_points) {
      return b.total_points - a.total_points;
    }
    if (b.exact_scores !== a.exact_scores) {
      return b.exact_scores - a.exact_scores;
    }
    return a.display_name.localeCompare(b.display_name, "pt-BR");
  });

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Classificação"
        title="Ranking"
        description="Ordenado por pontos totais. Desempate: quem tem mais placares exatos (5 pts)."
      />

      <div className="card-surface overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="pitch-gradient text-left text-white">
            <tr>
              <th className="px-4 py-3 font-semibold">#</th>
              <th className="px-4 py-3 font-semibold">Jogador</th>
              <th className="px-4 py-3 font-semibold">Pontos</th>
              <th className="px-4 py-3 font-semibold">Exatos</th>
              <th className="px-4 py-3 font-semibold">Palpites</th>
            </tr>
          </thead>
          <tbody>
            {ranking.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-boludo-muted"
                >
                  Ninguém no ranking ainda. Comece palpitando nos jogos!
                </td>
              </tr>
            ) : (
              ranking.map((row, index) => (
                <tr
                  key={row.id}
                  className={`border-b border-boludo-border/60 last:border-0 ${getRankRowClass(index)}`}
                >
                  <td className="px-4 py-3 font-medium text-boludo-muted">
                    {getRankMedal(index) ?? index + 1}
                  </td>
                  <td className="px-4 py-3 font-semibold text-boludo-text">
                    {row.display_name}
                  </td>
                  <td className="px-4 py-3 text-lg font-bold text-boludo-primary">
                    {row.total_points}
                  </td>
                  <td className="px-4 py-3 text-boludo-text">
                    {row.exact_scores}
                  </td>
                  <td className="px-4 py-3 text-boludo-text">
                    {row.predictions_count}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
