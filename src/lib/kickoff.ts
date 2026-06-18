import {
  differenceInMinutes,
  differenceInSeconds,
  isBefore,
} from "date-fns";

export type KickoffStatus =
  | { kind: "open"; label: string; urgent: boolean }
  | { kind: "closed"; label: string }
  | { kind: "postponed"; label: string };

export function getKickoffStatus(
  kickoffAt: string,
  matchStatus: string,
  now: Date = new Date(),
): KickoffStatus {
  if (matchStatus === "postponed") {
    return { kind: "postponed", label: "Jogo adiado — palpites reabertos" };
  }

  if (matchStatus !== "scheduled") {
    return { kind: "closed", label: "Palpites encerrados" };
  }

  const kickoff = new Date(kickoffAt);

  if (!isBefore(now, kickoff)) {
    return { kind: "closed", label: "Palpites encerrados" };
  }

  const totalMinutes = differenceInMinutes(kickoff, now);

  if (totalMinutes < 60) {
    const seconds = differenceInSeconds(kickoff, now) % 60;
    return {
      kind: "open",
      label: `Fecha em ${totalMinutes}min ${seconds}s`,
      urgent: totalMinutes < 30,
    };
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return {
    kind: "open",
    label: `Fecha em ${hours}h ${minutes}min`,
    urgent: totalMinutes < 120,
  };
}
