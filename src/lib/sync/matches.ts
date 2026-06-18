import { createClient } from "@supabase/supabase-js";

export type SyncResult = {
  ok: boolean;
  updated: number;
  message: string;
};

function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return null;
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Sincroniza jogos com API externa (API-Football).
 * Configure API_FOOTBALL_KEY e SUPABASE_SERVICE_ROLE_KEY para ativar.
 * Implementação completa: docs/API_SYNC.md
 */
export async function syncMatchesFromApi(): Promise<SyncResult> {
  const apiKey = process.env.API_FOOTBALL_KEY;

  if (!apiKey) {
    return {
      ok: true,
      updated: 0,
      message:
        "API_FOOTBALL_KEY não configurada. Sync manual via /admin continua disponível.",
    };
  }

  const supabase = createServiceClient();

  if (!supabase) {
    return {
      ok: false,
      updated: 0,
      message:
        "SUPABASE_SERVICE_ROLE_KEY não configurada (necessária apenas para sync automático).",
    };
  }

  // Ponto de extensão: buscar fixtures da Copa 2026 e atualizar `matches`.
  // Veja docs/API_SYNC.md para implementação com api-football.com
  void supabase;

  return {
    ok: true,
    updated: 0,
    message:
      "API key detectada. Integração de sync ainda não implementada — use o painel /admin.",
  };
}
