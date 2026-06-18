-- Cria perfil automaticamente quando usuário se cadastra com convite validado no app.
-- O app grava invite_validated: true em raw_user_meta_data no signUp.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  invite_ok BOOLEAN;
  profile_name TEXT;
BEGIN
  invite_ok := COALESCE((NEW.raw_user_meta_data ->> 'invite_validated')::BOOLEAN, false);

  IF NOT invite_ok THEN
    RETURN NEW;
  END IF;

  profile_name := COALESCE(
    NULLIF(trim(NEW.raw_user_meta_data ->> 'display_name'), ''),
    split_part(NEW.email, '@', 1),
    'Jogador'
  );

  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, profile_name)
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
