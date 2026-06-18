import { syncMatchesFromApi } from "@/lib/sync/matches";

export const runtime = "nodejs";

function isAuthorized(request: Request): boolean {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return process.env.NODE_ENV === "development";
  }

  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${cronSecret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const result = await syncMatchesFromApi();
    return Response.json(result, { status: result.ok ? 200 : 500 });
  } catch {
    return Response.json(
      { ok: false, error: "Erro ao sincronizar jogos" },
      { status: 500 },
    );
  }
}
