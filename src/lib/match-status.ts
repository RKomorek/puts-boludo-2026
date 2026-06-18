const statusLabels: Record<string, string> = {
  scheduled: "Agendado",
  live: "Ao vivo",
  finished: "Finalizado",
  postponed: "Adiado",
};

const statusStyles: Record<string, string> = {
  scheduled: "badge-scheduled",
  live: "badge-live",
  finished: "badge-finished",
  postponed: "badge-postponed",
};

export function getMatchStatusLabel(status: string): string {
  return statusLabels[status] ?? status;
}

export function getMatchStatusClass(status: string): string {
  return statusStyles[status] ?? "badge-finished";
}
