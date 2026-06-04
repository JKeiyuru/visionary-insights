
-- 1) Recreate profiles_public with security_invoker = on
DROP VIEW IF EXISTS public.profiles_public;
CREATE VIEW public.profiles_public
WITH (security_invoker = on) AS
SELECT id, display_name, username, avatar_url, tier, accuracy, forecasts_count, created_at
FROM public.profiles
WHERE forecasts_count > 0;

GRANT SELECT ON public.profiles_public TO anon, authenticated;

-- 2) Add a narrow public SELECT policy on profiles so leaderboard works via security_invoker view
DROP POLICY IF EXISTS "Public leaderboard profile read" ON public.profiles;
CREATE POLICY "Public leaderboard profile read"
ON public.profiles
FOR SELECT
TO anon, authenticated
USING (forecasts_count > 0);

-- 3) Payments: constrain status and force initial value
ALTER TABLE public.payments
  ALTER COLUMN status SET DEFAULT 'pending';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'payments_status_check'
  ) THEN
    ALTER TABLE public.payments
      ADD CONSTRAINT payments_status_check
      CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded'));
  END IF;
END $$;

-- Trigger to force inserts to 'pending' and prevent client-side status changes
CREATE OR REPLACE FUNCTION public.enforce_payment_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.status := 'pending';
  ELSIF TG_OP = 'UPDATE' THEN
    -- Only service_role (e.g. webhook / edge function) may change status
    IF NEW.status IS DISTINCT FROM OLD.status
       AND current_setting('request.jwt.claims', true)::jsonb->>'role' <> 'service_role' THEN
      NEW.status := OLD.status;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_payment_status_trg ON public.payments;
CREATE TRIGGER enforce_payment_status_trg
BEFORE INSERT OR UPDATE ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.enforce_payment_status();
