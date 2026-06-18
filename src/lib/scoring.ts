import { SCORING } from "@/lib/constants";

type MatchOutcome = "home" | "away" | "draw";

function getOutcome(homeScore: number, awayScore: number): MatchOutcome {
  if (homeScore > awayScore) return "home";
  if (homeScore < awayScore) return "away";
  return "draw";
}

/**
 * Calcula pontos de um palpite com base no placar final (90 min).
 * Placar exato = 5 pts. Acertou vencedor/empate = 3 pts. Errou = 0.
 */
export function calculatePoints(
  predictedHome: number,
  predictedAway: number,
  actualHome: number,
  actualAway: number,
): number {
  if (predictedHome === actualHome && predictedAway === actualAway) {
    return SCORING.exactScore;
  }

  if (
    getOutcome(predictedHome, predictedAway) ===
    getOutcome(actualHome, actualAway)
  ) {
    return SCORING.correctWinner;
  }

  return SCORING.wrong;
}

export function canEditPrediction(
  kickoffAt: Date,
  matchStatus: string,
  now: Date = new Date(),
): boolean {
  if (matchStatus === "postponed") return true;
  if (matchStatus !== "scheduled") return false;
  return now < kickoffAt;
}
