"use client";

import { useActionState } from "react";

import {
  type PredictionActionState,
  savePrediction,
} from "@/lib/actions/predictions";

const initialState: PredictionActionState = {};

type PredictionFormProps = {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  defaultHome?: number;
  defaultAway?: number;
  disabled?: boolean;
  disabledMessage?: string;
};

export function PredictionForm({
  matchId,
  homeTeam,
  awayTeam,
  defaultHome = 0,
  defaultAway = 0,
  disabled = false,
  disabledMessage,
}: PredictionFormProps) {
  const [state, action, pending] = useActionState(savePrediction, initialState);

  if (disabled) {
    return (
      <div className="card-surface p-5">
        <p className="text-sm font-medium text-boludo-muted">
          {disabledMessage ?? "Palpites fechados para este jogo."}
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="card-surface space-y-4 p-5">
      <div>
        <h3 className="font-semibold text-boludo-text">Seu palpite</h3>
        <p className="mt-1 text-sm text-boludo-muted">
          Placar exato = 5 pts · Vencedor/empate = 3 pts
        </p>
      </div>

      {state.error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      {state.success ? (
        <p className="rounded-lg border border-boludo-primary/20 bg-boludo-primary-light px-3 py-2 text-sm text-boludo-primary-dark">
          {state.success}
        </p>
      ) : null}

      <input type="hidden" name="matchId" value={matchId} />

      <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-boludo-text">{homeTeam}</span>
          <input
            className="input-field w-full text-center text-lg font-bold"
            name="homeScore"
            type="number"
            min={0}
            max={99}
            defaultValue={defaultHome}
            required
          />
        </label>

        <span className="pb-3 text-xl font-bold text-boludo-muted">×</span>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-boludo-text">{awayTeam}</span>
          <input
            className="input-field w-full text-center text-lg font-bold"
            name="awayScore"
            type="number"
            min={0}
            max={99}
            defaultValue={defaultAway}
            required
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full px-4 py-2.5 text-sm"
      >
        {pending ? "Salvando..." : "Salvar palpite"}
      </button>
    </form>
  );
}
