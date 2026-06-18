import { PointsBadge } from "@/components/ui/points-badge";

type PredictionRow = {
  id: string;
  home_score: number;
  away_score: number;
  points: number | null;
  display_name: string;
  isCurrentUser?: boolean;
};

type MatchPredictionsTableProps = {
  predictions: PredictionRow[];
  homeTeam: string;
  awayTeam: string;
  showPoints: boolean;
};

export function MatchPredictionsTable({
  predictions,
  homeTeam,
  awayTeam,
  showPoints,
}: MatchPredictionsTableProps) {
  if (predictions.length === 0) {
    return (
      <div className="card-surface p-6 text-center text-sm text-boludo-muted">
        Ninguém palpitou neste jogo ainda. Seja o primeiro!
      </div>
    );
  }

  const sorted = [...predictions].sort((a, b) => {
    if (showPoints) {
      return (b.points ?? -1) - (a.points ?? -1);
    }
    return a.display_name.localeCompare(b.display_name, "pt-BR");
  });

  return (
    <div className="card-surface overflow-hidden">
      <div className="border-b border-boludo-border bg-boludo-primary-light px-4 py-3">
        <h3 className="font-semibold text-boludo-primary-dark">
          Palpites do bolão
        </h3>
        <p className="text-xs text-boludo-muted">
          {homeTeam} × {awayTeam} — todos os palpites visíveis
        </p>
      </div>

      <table className="min-w-full text-sm">
        <thead className="border-b border-boludo-border bg-boludo-card-muted text-left text-boludo-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Jogador</th>
            <th className="px-4 py-3 font-medium">Palpite</th>
            {showPoints ? (
              <th className="px-4 py-3 font-medium">Pontos</th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr
              key={row.id}
              className={`border-b border-boludo-border/60 last:border-0 ${
                row.isCurrentUser ? "bg-boludo-accent-light/50" : ""
              }`}
            >
              <td className="px-4 py-3 font-semibold text-boludo-text">
                {row.display_name}
                {row.isCurrentUser ? (
                  <span className="ml-2 text-xs font-normal text-boludo-primary">
                    (você)
                  </span>
                ) : null}
              </td>
              <td className="px-4 py-3 font-mono font-semibold text-boludo-text">
                {row.home_score} × {row.away_score}
              </td>
              {showPoints ? (
                <td className="px-4 py-3">
                  <PointsBadge points={row.points} size="sm" />
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
