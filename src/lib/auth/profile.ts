import type { SupabaseClient, User } from "@supabase/supabase-js";

export function getDisplayName(user: User): string {
  const name =
    (user.user_metadata?.display_name as string | undefined) ??
    (user.user_metadata?.full_name as string | undefined) ??
    user.email?.split("@")[0] ??
    "Jogador";

  return name.trim() || "Jogador";
}

export function hasInviteAccess(
  user: User,
  inviteCookieVerified = false,
): boolean {
  if (inviteCookieVerified) {
    return true;
  }

  return user.user_metadata?.invite_validated === true;
}

export async function ensureUserProfile(
  supabase: SupabaseClient,
  user: User,
  options: { inviteCookieVerified?: boolean } = {},
): Promise<
  { ok: true } | { ok: false; reason: "no_invite" | "insert_failed" }
> {
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (existingProfile) {
    return { ok: true };
  }

  if (!hasInviteAccess(user, options.inviteCookieVerified)) {
    return { ok: false, reason: "no_invite" };
  }

  const { error } = await supabase.from("profiles").insert({
    id: user.id,
    display_name: getDisplayName(user),
  });

  if (error) {
    return { ok: false, reason: "insert_failed" };
  }

  return { ok: true };
}
