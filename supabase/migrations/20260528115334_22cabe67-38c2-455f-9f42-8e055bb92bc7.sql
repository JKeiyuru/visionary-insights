
-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  tier TEXT NOT NULL DEFAULT 'bronze',
  accuracy NUMERIC(5,2) NOT NULL DEFAULT 0,
  forecasts_count INT NOT NULL DEFAULT 0,
  correct_count INT NOT NULL DEFAULT 0,
  subscription_plan TEXT NOT NULL DEFAULT 'free',
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Matches
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sport TEXT NOT NULL,
  league TEXT,
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  kickoff_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled',
  home_score INT,
  away_score INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.matches TO anon, authenticated;
GRANT ALL ON public.matches TO service_role;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Matches public read" ON public.matches FOR SELECT USING (true);

-- AI Predictions
CREATE TABLE public.predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  home_win_prob NUMERIC(5,2) NOT NULL,
  draw_prob NUMERIC(5,2) NOT NULL,
  away_win_prob NUMERIC(5,2) NOT NULL,
  predicted_outcome TEXT NOT NULL,
  confidence NUMERIC(5,2) NOT NULL,
  reasoning TEXT,
  premium BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.predictions TO anon, authenticated;
GRANT ALL ON public.predictions TO service_role;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Predictions public read" ON public.predictions FOR SELECT USING (true);

-- User forecasts (community)
CREATE TABLE public.user_forecasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  predicted_outcome TEXT NOT NULL,
  confidence NUMERIC(5,2),
  correct BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, match_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_forecasts TO authenticated;
GRANT SELECT ON public.user_forecasts TO anon;
GRANT ALL ON public.user_forecasts TO service_role;
ALTER TABLE public.user_forecasts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Forecasts public read" ON public.user_forecasts FOR SELECT USING (true);
CREATE POLICY "Users insert own forecast" ON public.user_forecasts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own forecast" ON public.user_forecasts FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete own forecast" ON public.user_forecasts FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Auto-create profile trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed sample matches
INSERT INTO public.matches (sport, league, home_team, away_team, kickoff_at, status) VALUES
('soccer', 'Premier League', 'Arsenal', 'Chelsea', now() + interval '6 hours', 'scheduled'),
('soccer', 'La Liga', 'Real Madrid', 'Barcelona', now() + interval '1 day', 'scheduled'),
('basketball', 'NBA', 'Lakers', 'Celtics', now() + interval '8 hours', 'scheduled'),
('basketball', 'NBA', 'Warriors', 'Nuggets', now() + interval '2 days', 'scheduled'),
('formula1', 'F1', 'Monaco GP', 'Race', now() + interval '3 days', 'scheduled'),
('baseball', 'MLB', 'Yankees', 'Red Sox', now() + interval '12 hours', 'scheduled'),
('tennis', 'ATP', 'Alcaraz', 'Sinner', now() + interval '5 hours', 'scheduled'),
('soccer', 'Serie A', 'Inter', 'Juventus', now() + interval '1 day 6 hours', 'scheduled');

INSERT INTO public.predictions (match_id, home_win_prob, draw_prob, away_win_prob, predicted_outcome, confidence, reasoning, premium)
SELECT id, 52.3, 24.1, 23.6, 'home', 78.5,
  'Home form (W-W-D-W-W), xG advantage +0.7, key striker available. Opposition missing 2 starters.',
  false
FROM public.matches WHERE home_team = 'Arsenal';

INSERT INTO public.predictions (match_id, home_win_prob, draw_prob, away_win_prob, predicted_outcome, confidence, reasoning, premium)
SELECT id, 41.2, 22.0, 36.8, 'home', 65.0,
  'El Clasico: tight historical record, slight home advantage. Both teams in peak form.',
  true
FROM public.matches WHERE home_team = 'Real Madrid';
