import { z } from "zod";

import type { MatchStatus } from "@/types/database";

const matchStatusSchema = z.enum([
  "scheduled",
  "live",
  "finished",
  "postponed",
]);

export const updateMatchSchema = z
  .object({
    matchId: z.uuid("Jogo inválido"),
    homeScore: z.coerce.number().int().min(0).max(99).optional(),
    awayScore: z.coerce.number().int().min(0).max(99).optional(),
    status: matchStatusSchema,
  })
  .superRefine((data, ctx) => {
    if (data.status === "finished") {
      if (data.homeScore === undefined) {
        ctx.addIssue({
          code: "custom",
          message: "Informe o placar da casa",
          path: ["homeScore"],
        });
      }
      if (data.awayScore === undefined) {
        ctx.addIssue({
          code: "custom",
          message: "Informe o placar visitante",
          path: ["awayScore"],
        });
      }
    }
  });

export type UpdateMatchInput = z.infer<typeof updateMatchSchema> & {
  status: MatchStatus;
};
