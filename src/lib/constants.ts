export const SCORING = {
  exactScore: 5,
  correctWinner: 3,
  wrong: 0,
} as const;

export const MATCH_STATUS = {
  scheduled: "scheduled",
  live: "live",
  finished: "finished",
  postponed: "postponed",
} as const;

export type MatchStatus = (typeof MATCH_STATUS)[keyof typeof MATCH_STATUS];

export const PREDICTION_VISIBILITY = {
  always: "always",
  afterKickoff: "after_kickoff",
} as const;

/** Fuso horário padrão para exibição de horários dos jogos */
export const DISPLAY_TIMEZONE = "America/Sao_Paulo";
