import { formatInTimeZone } from "date-fns-tz";
import { ptBR } from "date-fns/locale/pt-BR";

import { DISPLAY_TIMEZONE } from "@/lib/constants";

export function formatMatchKickoff(isoDate: string): string {
  return formatInTimeZone(
    new Date(isoDate),
    DISPLAY_TIMEZONE,
    "EEE, dd MMM · HH:mm",
    { locale: ptBR },
  );
}

export function formatMatchKickoffLong(isoDate: string): string {
  return formatInTimeZone(
    new Date(isoDate),
    DISPLAY_TIMEZONE,
    "dd 'de' MMMM 'de' yyyy 'às' HH:mm",
    { locale: ptBR },
  );
}
