import Link from "next/link";

import { KickoffCountdown } from "@/components/matches/kickoff-countdown";
import { formatMatchKickoff } from "@/lib/dates";
import {
  getMatchStatusClass,
  getMatchStatusLabel,
} from "@/lib/match-status";
import type { Database } from "@/types/database";

type Match = Database["public"]["Tables"]["matches"]["Row"];

type MatchCardProps = {
  match: Match;
  myPrediction?: { home_score: number; away_score: number } | null;
};

export function MatchCard({ match, myPrediction }: MatchCardProps) {
  const isFinished = match.status === "finished";

  return (
    <Link
      href={`/jogos/${match.id}`}
      className="card-surface-accent block p-5 transition hover:border-[#0a7a4b] hover:shadow-lg"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-wide text-boludo-primary">
            {match.stage}
          </p>

          {isFinished ? (
            <p className="mt-2 text-lg font-bold text-boludo-text">
              {match.home_team}{" "}
              <span className="text-boludo-primary">{match.home_score}</span>
              <span className="mx-1 text-boludo-muted">×</span>
              <span className="text-boludo-primary">{match.away_score}</span>{" "}
              {match.away_team}
            </p>
          ) : (
            <p className="mt-2 text-lg font-bold text-boludo-text">
              {match.home_team}{" "}
              <span className="font-normal text-boludo-muted">×</span>{" "}
              {match.away_team}
            </p>
          )}

          <p className="mt-1 text-sm text-boludo-muted">
            {formatMatchKickoff(match.kickoff_at)}
          </p>

          {!isFinished ? (
            <div className="mt-2">
              <KickoffCountdown
                kickoffAt={match.kickoff_at}
                matchStatus={match.status}
                compact
              />
            </div>
          ) : null}

          {myPrediction ? (
            <p className="mt-3 inline-flex items-center gap-2 rounded-lg bg-boludo-primary-light px-3 py-1.5 text-sm font-semibold text-boludo-primary-dark">
              Seu palpite: {myPrediction.home_score} × {myPrediction.away_score}
            </p>
          ) : !isFinished ? (
            <p className="mt-3 text-sm font-semibold text-boludo-accent-dark">
              Clique para palpitar →
            </p>
          ) : null}
        </div>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${getMatchStatusClass(match.status)}`}
        >
          {getMatchStatusLabel(match.status)}
        </span>
      </div>
    </Link>
  );
}
