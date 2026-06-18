-- Row Level Security

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Perfis visíveis para autenticados"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Usuário cria o próprio perfil"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Usuário edita o próprio perfil"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Configurações visíveis para autenticados"
ON public.settings
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Jogos visíveis para autenticados"
ON public.matches
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admin gerencia jogos"
ON public.matches
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND is_admin = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND is_admin = true
  )
);

CREATE POLICY "Palpites visíveis para autenticados"
ON public.predictions
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Usuário gerencia os próprios palpites"
ON public.predictions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuário atualiza os próprios palpites"
ON public.predictions
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
