
-- 1. Role enum + user_roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users view own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 2. site_content (terms, privacy, about, etc.)
CREATE TABLE public.site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID
);

GRANT SELECT ON public.site_content TO anon;
GRANT SELECT ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site content public read"
  ON public.site_content FOR SELECT
  USING (true);

CREATE POLICY "Admins write site content"
  ON public.site_content FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 3. plans (pricing tiers)
CREATE TABLE public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  price_label TEXT NOT NULL,
  amount_kes NUMERIC NOT NULL DEFAULT 0,
  period TEXT NOT NULL,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.plans TO anon;
GRANT SELECT ON public.plans TO authenticated;
GRANT ALL ON public.plans TO service_role;

ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Plans public read"
  ON public.plans FOR SELECT
  USING (true);

CREATE POLICY "Admins manage plans"
  ON public.plans FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 4. profiles: ban flag + allow admin to update any profile
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_banned BOOLEAN NOT NULL DEFAULT false;

CREATE POLICY "Admins update any profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 5. Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_content;
ALTER PUBLICATION supabase_realtime ADD TABLE public.plans;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;

-- 6. Seed plans
INSERT INTO public.plans (slug, name, price_label, amount_kes, period, features, featured, sort_order) VALUES
  ('free',    'Free',         'KES 0',     0,    'forever', '["5 picks / day","Basic insights","Community access"]'::jsonb, false, 1),
  ('weekly',  'Weekly',       'KES 149',   149,  '/week',   '["Unlimited picks","Live momentum","Email & SMS alerts"]'::jsonb, false, 2),
  ('monthly', 'Monthly',      'KES 399',   399,  '/month',  '["Everything in Weekly","Premium leagues","Priority support","Revenue share access"]'::jsonb, true, 3),
  ('elite',   'Elite Season', 'KES 2,999', 2999, '/season', '["All sports unlocked","1-on-1 analyst time","Private discord","Early features"]'::jsonb, false, 4);

-- 7. Seed site_content (Terms & Privacy starter copy)
INSERT INTO public.site_content (key, title, body) VALUES
  ('terms', 'Terms & Conditions',
'## 1. Acceptance of Terms
By accessing or using VisionPlay you agree to be bound by these Terms.

## 2. Nature of Service
VisionPlay is an analytics and entertainment platform. It is **not a gambling or betting operator**.

## 3. Eligibility
You must be at least 18 years old to create an account.

## 4. Accounts
You are responsible for the confidentiality of your login credentials.

## 5. Subscriptions & Payments
Paid plans are billed in advance and auto-renew unless cancelled.

## 6. No Guarantee of Outcomes
All predictions are informational only. Sports are inherently unpredictable.

## 7. Acceptable Use
Do not scrape, abuse, or attempt unauthorised access to the Platform.

## 8. Intellectual Property
All content and code on VisionPlay are owned by VisionPlay or its licensors.

## 9. Termination
We may suspend or terminate accounts that violate these Terms.

## 10. Limitation of Liability
VisionPlay is not liable for indirect or consequential damages.

## 11. Changes
We may update these Terms from time to time.

## 12. Contact
legal@visionplay.app'),
  ('privacy', 'Privacy Policy',
'## 1. What We Collect
Account info, usage data, and payment metadata (we never store card numbers).

## 2. How We Use Data
To operate the service, improve our models, prevent fraud and comply with law.

## 3. Sharing
We share data only with vetted processors. We never sell personal data.

## 4. Cookies
Used for authentication, preferences and analytics.

## 5. Data Retention
We retain data while your account is active. You can request deletion anytime.

## 6. Your Rights
Access, correction, deletion, portability — contact privacy@visionplay.app.

## 7. Security
Encryption in transit, row-level access control, regular audits.

## 8. Children
VisionPlay is not intended for users under 18.

## 9. Contact
privacy@visionplay.app');
