import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Trophy, Target, TrendingUp, Sparkles, Calendar, ArrowRight, Activity } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { PhoneOnboarding } from "@/components/PhoneOnboarding";
import { TierGate } from "@/components/TierGate";
import { HeroShowcase } from "@/components/HeroShowcase";


export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — VisionPlay" }] }),
  component: DashboardPage,
});

type Match = { id: string; sport: string; league: string | null; home_team: string; away_team: string; kickoff_at: string };
type Profile = { display_name: string | null; tier: string; accuracy: number; forecasts_count: number; correct_count: number; subscription_plan: string };

const sportEmoji: Record<string, string> = { soccer: "⚽", basketball: "🏀", formula1: "🏎️", baseball: "⚾", tennis: "🎾" };

function DashboardPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase.from("matches").select("*").order("kickoff_at", { ascending: true }).limit(6).then(({ data }) => setMatches(data ?? []));
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle().then(({ data }) => setProfile(data as Profile | null));
  }, [user]);

  if (loading || !user) return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading…</div>;

  const plan = profile?.subscription_plan ?? "free";

  return (
    <div className="min-h-screen">
      <PhoneOnboarding />
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-semibold">
              Welcome back{profile?.display_name ? `, ${profile.display_name}` : ""} 👋
            </h1>
            <p className="text-muted-foreground mt-1">Here's what's happening today.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs">
            <span className="h-2 w-2 rounded-full bg-success live-dot" /> LIVE · {matches.length} fixtures tracked
          </div>
        </motion.div>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Trophy, label: "Tier", value: profile?.tier ?? "bronze", color: "text-warning" },
            { icon: Target, label: "Accuracy", value: `${profile?.accuracy ?? 0}%`, color: "text-accent" },
            { icon: TrendingUp, label: "Forecasts", value: profile?.forecasts_count ?? 0, color: "text-secondary" },
            { icon: Sparkles, label: "Plan", value: plan, color: "text-primary" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="glass rounded-2xl p-5 relative overflow-hidden"
            >
              <div className="absolute inset-0 grid-bg opacity-20" aria-hidden />
              <div className="relative">
                <s.icon className={`h-5 w-5 ${s.color}`} />
                <div className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
                <div className="mt-1 font-display text-2xl font-semibold capitalize">{s.value}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10">
          <div className="flex items-end justify-between mb-4">
            <h2 className="font-display text-2xl font-semibold">Upcoming matches</h2>
            <Link to="/matches" className="text-sm text-accent hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="glass rounded-2xl p-5"
              >
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="uppercase tracking-wider">{sportEmoji[m.sport]} {m.sport}</span>
                  <span>{m.league}</span>
                </div>
                <div className="mt-3 font-display text-lg font-semibold">{m.home_team} vs {m.away_team}</div>
                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {new Date(m.kickoff_at).toLocaleString()}
                </div>
                <Link to="/matches">
                  <Button size="sm" variant="outline" className="mt-4 w-full">View prediction</Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Premium tier-gated section */}
        <div className="mt-10">
          <h2 className="font-display text-2xl font-semibold mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-accent" /> Live momentum (premium)
          </h2>
          <TierGate
            current={plan}
            required="monthly"
            feature="Real-time win-probability shifts"
          >
            <div className="glass rounded-2xl p-6">
              <p className="text-sm text-muted-foreground">Your live momentum charts will appear here.</p>
            </div>
          </TierGate>
        </div>

        <div className="mt-10 grid md:grid-cols-2 gap-4">
          <div className="glass rounded-2xl p-6">
            <h3 className="font-display text-lg font-semibold">Upgrade your plan</h3>
            <p className="mt-1 text-sm text-muted-foreground">Unlock premium leagues, live momentum and revenue share.</p>
            <Link to="/pricing"><Button className="mt-4 bg-gradient-to-r from-primary to-accent text-white border-0">See plans</Button></Link>
          </div>
          <div className="glass rounded-2xl p-6">
            <h3 className="font-display text-lg font-semibold">Climb the leaderboard</h3>
            <p className="mt-1 text-sm text-muted-foreground">See where the world's sharpest forecasters stand.</p>
            <Link to="/leaderboard"><Button variant="outline" className="mt-4">View leaderboard</Button></Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
