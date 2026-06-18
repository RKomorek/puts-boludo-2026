export function validateInviteCode(code: string): boolean {
  const expected = process.env.INVITE_CODE;

  if (!expected) {
    return false;
  }

  return code.trim().toLowerCase() === expected.trim().toLowerCase();
}

export const INVITE_COOKIE = "putsboludo_invite_verified";
