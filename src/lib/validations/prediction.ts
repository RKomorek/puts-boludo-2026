import { z } from "zod";

export const predictionSchema = z.object({
  matchId: z.uuid("Jogo inválido"),
  homeScore: z.coerce
    .number()
    .int("Use números inteiros")
    .min(0, "Mínimo 0")
    .max(99, "Máximo 99"),
  awayScore: z.coerce
    .number()
    .int("Use números inteiros")
    .min(0, "Mínimo 0")
    .max(99, "Máximo 99"),
});

export type PredictionInput = z.infer<typeof predictionSchema>;
