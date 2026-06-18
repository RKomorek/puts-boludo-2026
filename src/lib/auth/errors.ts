export function formatAuthError(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("rate limit") || lower.includes("429")) {
    return (
      "Limite de envio de e-mails do Supabase atingido. " +
      "Peça ao admin para desativar a confirmação de e-mail (Authentication → Email → Confirm email OFF) " +
      "ou aguarde cerca de 1 hora. Não use “Invite user” no dashboard — cadastre-se pelo site com o código de convite."
    );
  }

  if (
    lower.includes("already registered") ||
    lower.includes("user already registered")
  ) {
    return "Este e-mail já está cadastrado. Use a aba Entrar.";
  }

  if (lower.includes("invalid login credentials")) {
    return "E-mail ou senha incorretos.";
  }

  if (lower.includes("email not confirmed")) {
    return (
      "E-mail ainda não confirmado. Verifique sua caixa de entrada ou peça ao admin " +
      "para desativar confirmação de e-mail no Supabase."
    );
  }

  return message;
}
