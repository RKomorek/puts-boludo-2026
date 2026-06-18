"use server";

import { revalidatePath } from "next/cache";

import { canEditPrediction } from "@/lib/scoring";
import { createClient } from "@/lib/supabase/server";
import { predictionSchema } from "@/lib/validations/prediction";

export type PredictionActionState = {
  error?: string;
  success?: string;
};

export async function savePrediction(
  _prev: PredictionActionState,
  formData: FormData,
): Promise<PredictionActionState> {
  const parsed = predictionSchema.safeParse({
    matchId: formData.get("matchId"),
    homeScore: formData.get("homeScore"),
    awayScore: formData.get("awayScore"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Palpite inválido." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Faça login para palpitar." };
  }

  const { data: match, error: matchError } = await supabase
    .from("matches")
    .select("id, kickoff_at, status")
    .eq("id", parsed.data.matchId)
    .single();

  if (matchError || !match) {
    return { error: "Jogo não encontrado." };
  }

  if (
    !canEditPrediction(new Date(match.kickoff_at), match.status)
  ) {
    return { error: "Palpites fechados para este jogo." };
  }

  const { data: existingPrediction } = await supabase
    .from("predictions")
    .select("id")
    .eq("match_id", parsed.data.matchId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingPrediction) {
    const { error } = await supabase
      .from("predictions")
      .update({
        home_score: parsed.data.homeScore,
        away_score: parsed.data.awayScore,
      })
      .eq("id", existingPrediction.id);

    if (error) {
      return { error: "Não foi possível atualizar seu palpite." };
    }
  } else {
    const { error } = await supabase.from("predictions").insert({
      match_id: parsed.data.matchId,
      user_id: user.id,
      home_score: parsed.data.homeScore,
      away_score: parsed.data.awayScore,
    });

    if (error) {
      return { error: "Não foi possível salvar seu palpite." };
    }
  }

  revalidatePath("/jogos");
  revalidatePath(`/jogos/${parsed.data.matchId}`);
  revalidatePath("/ranking");

  return { success: "Palpite salvo!" };
}
