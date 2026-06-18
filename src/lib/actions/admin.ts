"use server";

import { revalidatePath } from "next/cache";

import { getCurrentProfile } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { updateMatchSchema } from "@/lib/validations/admin";

export type AdminActionState = {
  error?: string;
  success?: string;
};

export async function updateMatchResult(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const { isAdmin } = await getCurrentProfile();

  if (!isAdmin) {
    return { error: "Acesso negado." };
  }

  const homeScoreRaw = formData.get("homeScore");
  const awayScoreRaw = formData.get("awayScore");

  const parsed = updateMatchSchema.safeParse({
    matchId: formData.get("matchId"),
    homeScore: homeScoreRaw === "" ? undefined : homeScoreRaw,
    awayScore: awayScoreRaw === "" ? undefined : awayScoreRaw,
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();

  const updatePayload =
    parsed.data.status === "finished"
      ? {
          home_score: parsed.data.homeScore!,
          away_score: parsed.data.awayScore!,
          status: parsed.data.status,
        }
      : {
          home_score: null,
          away_score: null,
          status: parsed.data.status,
        };

  const { error } = await supabase
    .from("matches")
    .update(updatePayload)
    .eq("id", parsed.data.matchId);

  if (error) {
    return { error: "Não foi possível atualizar o jogo." };
  }

  revalidatePath("/jogos");
  revalidatePath(`/jogos/${parsed.data.matchId}`);
  revalidatePath("/ranking");
  revalidatePath("/admin");

  return { success: "Jogo atualizado! Pontos recalculados automaticamente." };
}
