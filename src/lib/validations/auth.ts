import { z } from "zod";

export const signInSchema = z.object({
  email: z.email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export const signUpSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(40, "Nome muito longo"),
  email: z.email("E-mail inválido"),
  password: z
    .string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .max(72, "Senha muito longa"),
  inviteCode: z.string().trim().min(1, "Informe o código de convite"),
});

export const googleAuthSchema = z.object({
  inviteCode: z.string().trim().optional(),
  mode: z.enum(["signin", "signup"]),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
