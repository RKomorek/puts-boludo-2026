import Link from "next/link";
import { notFound } from "next/navigation";

import { MatchPredictionsTable } from "@/components/predictions/match-predictions-table";
import { PredictionForm } from "@/components/predictions/prediction-form";
import { KickoffCountdown } from "@/components/matches/kickoff-countdown";
import { PageHeader } from "@/components/ui/page-header";
import { formatMatchKickoffLong } from "@/lib/dates";
import {
  getMatchStatusClass,
  getMatchStatusLabel,
} from "@/lib/match-status";
import { canEditPrediction } from "@/lib/scoring";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function MatchDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: match, error } = await supabase
    .from("matches")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !match) {
    notFound();
  }

  const { data: predictionsData } = await supabase
    .from("predictions")
    .select("id, home_score, away_score, points, user_id")
    .eq("match_id", id);

  const profileIds = [...new Set(predictionsData?.map((p) => p.user_id) ?? [])];

  const { data: profilesData } =
    profileIds.length > 0
      ? await supabase
          .from("profiles")
          .select("id, display_name")
          .in("id", profileIds)
      : { data: [] };

  const profileNames = new Map(
    (profilesData ?? []).map((profile) => [profile.id, profile.display_name]),
  );

  const myPrediction = predictionsData?.find((p) => p.user_id === user?.id);

  const predictions =
    predictionsData?.map((prediction) => ({
      id: prediction.id,
      home_score: prediction.home_score,
      away_score: prediction.away_score,
      points: prediction.points,
      display_name: profileNames.get(prediction.user_id) ?? "Jogador",
      isCurrentUser: prediction.user_id === user?.id,
    })) ?? [];

  const editable = canEditPrediction(
    new Date(match.kickoff_at),
    match.status,
  );

  const showPoints =
    match.status === "finished" &&
    match.home_score !== null &&
    match.away_score !== null;

  return (
    <div className="space-y-8">
      <Link
        href="/jogos"
        className="inline-flex text-sm font-semibold text-boludo-primary hover:text-boludo-primary-dark"
      >
        ← Voltar aos jogos
      </Link>

      <div className="card-surface overflow-hidden">
        <div className="pitch-gradient px-6 py-5 text-white">
          <p className="text-xs font-bold uppercase tracking-wider text-[#f0b429]">
            {match.stage}
          </p>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
            {match.home_team}{" "}
            {showPoints ? (
              <>
                <span className="text-[#f0b429]">{match.home_score}</span>
                <span className="mx-2 text-white/70">×</span>
                <span className="text-[#f0b429]">{match.away_score}</span>
              </>
            ) : (
              <span className="text-white/70">×</span>
            )}{" "}
            {match.away_team}
          </h1>
          <p className="mt-2 text-sm text-white/85">
            {formatMatchKickoffLong(match.kickoff_at)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-boludo-border bg-boludo-card-muted px-6 py-4">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${getMatchStatusClass(match.status)}`}
          >
            {getMatchStatusLabel(match.status)}
          </span>
          {editable ? (
            <KickoffCountdown
              kickoffAt={match.kickoff_at}
              matchStatus={match.status}
            />
          ) : match.status === "postponed" ? (
            <span className="text-sm font-semibold text-boludo-accent-dark">
              Jogo adiado — palpites reabertos
            </span>
          ) : (
            <span className="text-sm text-boludo-muted">Palpites encerrados</span>
          )}
        </div>
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <PageHeader
            title="Fazer palpite"
            description="Informe o placar do tempo regulamentar (90 min)."
          />
          <div className="mt-4">
            <PredictionForm
              matchId={match.id}
              homeTeam={match.home_team}
              awayTeam={match.away_team}
              defaultHome={myPrediction?.home_score ?? 0}
              defaultAway={myPrediction?.away_score ?? 0}
              disabled={!editable}
              disabledMessage={
                match.status === "finished"
                  ? "Este jogo já terminou."
                  : "O prazo para palpitar neste jogo encerrou."
              }
            />
          </div>
        </div>

        <div>
          <PageHeader
            title="Palpites do grupo"
            description={
              showPoints
                ? "Resultado oficial e pontuação de cada participante."
                : "Veja o que cada amigo palpitou antes do jogo."
            }
          />
          <div className="mt-4">
            <MatchPredictionsTable
              predictions={predictions}
              homeTeam={match.home_team}
              awayTeam={match.away_team}
              showPoints={showPoints}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
