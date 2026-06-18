-- Corrige SUA conta (criada antes da correção do perfil automático).
-- 1. Troque o e-mail abaixo pelo seu.
-- 2. Execute no SQL Editor do Supabase.

UPDATE auth.users
SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb)
  || jsonb_build_object('invite_validated', true)
WHERE email = 'seu@email.com';

INSERT INTO public.profiles (id, display_name)
SELECT
  u.id,
  COALESCE(
    NULLIF(trim(u.raw_user_meta_data ->> 'display_name'), ''),
    split_part(u.email, '@', 1),
    'Jogador'
  )
FROM auth.users AS u
LEFT JOIN public.profiles AS p ON p.id = u.id
WHERE p.id IS NULL
  AND u.email = 'seu@email.com';
