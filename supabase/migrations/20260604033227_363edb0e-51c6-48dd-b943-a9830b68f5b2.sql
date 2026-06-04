
-- 1. PROFILES: restrict base SELECT, expose safe view
DROP POLICY IF EXISTS "Profiles viewable by everyone" ON public.profiles;

CREATE POLICY "Users view own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins view all profiles"
  ON public.profiles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Public-safe view (no phone, subscription, ban flags)
DROP VIEW IF EXISTS public.profiles_public;
CREATE VIEW public.profiles_public
WITH (security_invoker = off) AS
  SELECT id, display_name, username, avatar_url, tier,
         accuracy, forecasts_count, correct_count, created_at
  FROM public.profiles;

GRANT SELECT ON public.profiles_public TO anon, authenticated;

-- 2. USER_FORECASTS: drop public read, restrict to owner + admin
DROP POLICY IF EXISTS "Forecasts public read" ON public.user_forecasts;

CREATE POLICY "Users view own forecasts"
  ON public.user_forecasts FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::public.app_role));

-- 3. PREDICTIONS: split free vs premium
DROP POLICY IF EXISTS "Predictions public read" ON public.predictions;

CREATE POLICY "Free predictions public read"
  ON public.predictions FOR SELECT TO anon, authenticated
  USING (premium = false);

CREATE POLICY "Premium predictions for subscribers"
  ON public.predictions FOR SELECT TO authenticated
  USING (
    premium = true AND (
      public.has_role(auth.uid(), 'admin'::public.app_role)
      OR EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid()
          AND p.subscription_plan IS DISTINCT FROM 'free'
          AND (p.subscription_expires_at IS NULL OR p.subscription_expires_at > now())
      )
    )
  );

-- 4. USER_ROLES: tighten SELECT (remove broad admin visibility; super-admins still see all)
DROP POLICY IF EXISTS "Users view own roles" ON public.user_roles;

CREATE POLICY "Users view own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_super_admin(auth.uid()));

-- 5. Revoke SECURITY DEFINER helpers from anon/public
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_super_admin(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_super_admin(uuid) TO authenticated;
