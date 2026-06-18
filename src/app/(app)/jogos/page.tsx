import { MatchCard } from "@/components/matches/match-card";
import { PageHeader } from "@/components/ui/page-header";
import { createClient } from "@/lib/supabase/server";

export default async function JogosPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: matches, error } = await supabase
    .from("matches")
    .select("*")
    .order("kickoff_at", { ascending: true });

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
        <h1 className="text-lg font-semibold">Erro ao carregar jogos</h1>
        <p className="mt-2 text-sm">
          Verifique se as migrations foram aplicadas no Supabase.
        </p>
      </div>
    );
  }

  const { data: myPredictions } = user
    ? await supabase
        .from("predictions")
        .select("match_id, home_score, away_score")
        .eq("user_id", user.id)
    : { data: [] };

  const predictionsByMatch = new Map(
    (myPredictions ?? []).map((prediction) => [
      prediction.match_id,
      {
        home_score: prediction.home_score,
        away_score: prediction.away_score,
      },
    ]),
  );

  const upcoming = matches?.filter((match) => match.status !== "finished") ?? [];
  const finished = matches?.filter((match) => match.status === "finished") ?? [];

  return (
    <div className="space-y-8">
      <PageHeader
        badge="Copa 2026"
        title="Jogos"
        description="Clique em um jogo para palpitar ou ver os palpites do grupo. Placar exato vale 5 pontos, acertar o vencedor vale 3."
      />

      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-boludo-text">
          <span className="inline-block h-3 w-3 rounded-full bg-boludo-primary" />
          Próximos e em andamento
        </h2>
        {upcoming.length === 0 ? (
          <p className="card-surface p-6 text-center text-sm text-boludo-muted">
            Nenhum jogo pendente.
          </p>
        ) : (
          <div className="grid gap-3">
            {upcoming.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                myPrediction={predictionsByMatch.get(match.id)}
              />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-boludo-text">
          <span className="inline-block h-3 w-3 rounded-full bg-boludo-accent" />
          Finalizados
        </h2>
        {finished.length === 0 ? (
          <p className="card-surface p-6 text-center text-sm text-boludo-muted">
            Nenhum jogo finalizado ainda.
          </p>
        ) : (
          <div className="grid gap-3">
            {finished.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                myPrediction={predictionsByMatch.get(match.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
