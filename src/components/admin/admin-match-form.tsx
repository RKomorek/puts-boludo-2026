"use client";

import { useActionState } from "react";

import {
  type AdminActionState,
  updateMatchResult,
} from "@/lib/actions/admin";
import { getMatchStatusLabel } from "@/lib/match-status";
import type { Database } from "@/types/database";

const initialState: AdminActionState = {};

type Match = Database["public"]["Tables"]["matches"]["Row"];

type AdminMatchFormProps = {
  match: Match;
};

export function AdminMatchForm({ match }: AdminMatchFormProps) {
  const [state, action, pending] = useActionState(updateMatchResult, initialState);

  return (
    <form
      action={action}
      className="card-surface space-y-4 p-5"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-boludo-primary">
          {match.stage}
        </p>
        <h3 className="mt-1 text-lg font-bold text-boludo-text">
          {match.home_team} × {match.away_team}
        </h3>
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

      <input type="hidden" name="matchId" value={match.id} />

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-boludo-text">Placar casa</span>
          <input
            className="input-field"
            name="homeScore"
            type="number"
            min={0}
            max={99}
            defaultValue={match.home_score ?? ""}
            placeholder="—"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-boludo-text">Placar fora</span>
          <input
            className="input-field"
            name="awayScore"
            type="number"
            min={0}
            max={99}
            defaultValue={match.away_score ?? ""}
            placeholder="—"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-boludo-text">Status</span>
          <select
            className="input-field"
            name="status"
            defaultValue={match.status}
          >
            {(["scheduled", "live", "finished", "postponed"] as const).map(
              (status) => (
                <option key={status} value={status}>
                  {getMatchStatusLabel(status)}
                </option>
              ),
            )}
          </select>
        </label>
      </div>

      <p className="text-xs text-boludo-muted">
        Ao marcar como <strong>Finalizado</strong>, informe os dois placares.
        Os pontos do bolão são recalculados automaticamente.
      </p>

      <button
        type="submit"
        disabled={pending}
        className="btn-primary px-4 py-2.5 text-sm"
      >
        {pending ? "Salvando..." : "Salvar jogo"}
      </button>
    </form>
  );
}
