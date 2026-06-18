import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { INVITE_COOKIE } from "@/lib/auth/invite";
import { ensureUserProfile } from "@/lib/auth/profile";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/jogos";
  const oauthError = searchParams.get("error");
  const oauthDescription = searchParams.get("error_description");

  if (oauthError) {
    const detail = oauthDescription ? encodeURIComponent(oauthDescription) : "";
    return NextResponse.redirect(
      `${origin}/login?error=oauth_failed${detail ? `&detail=${detail}` : ""}`,
    );
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  const cookieStore = await cookies();
  const inviteCookieVerified = cookieStore.get(INVITE_COOKIE)?.value === "1";

  const profileResult = await ensureUserProfile(supabase, user, {
    inviteCookieVerified,
  });

  if (!profileResult.ok) {
    await supabase.auth.signOut();

    if (profileResult.reason === "insert_failed") {
      return NextResponse.redirect(`${origin}/login?error=profile_failed`);
    }

    return NextResponse.redirect(`${origin}/login?error=invite_required`);
  }

  const response = NextResponse.redirect(`${origin}${next}`);
  response.cookies.delete(INVITE_COOKIE);
  return response;
}
