import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Calendar, TrendingUp, Brain, Lock } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { TierGate, tierAllows } from "@/components/TierGate";

export const Route = createFileRoute("/matches")({
  head: () => ({ meta: [{ title: "Matches — VisionPlay" }] }),
  component: MatchesPage,
});

type Match = {
  id: string;
  sport: string;
  league: string | null;
  home_team: string;
  away_team: string;
  kickoff_at: string;
  predictions?: Array<{ home_win_prob: number; draw_prob: number; away_win_prob: number; predicted_outcome: string; confidence: number; reasoning: string | null; premium: boolean }>;
};

const sports = ["all", "soccer", "basketball", "formula1", "baseball", "tennis"];
const sportEmoji: Record<string, string> = { soccer: "⚽", basketball: "🏀", formula1: "🏎️", baseball: "⚾", tennis: "🎾" };

function MatchesPage() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [filter, setFilter] = useState("all");
  const [plan, setPlan] = useState<string>("free");

  useEffect(() => {
    supabase
      .from("matches")
      .select("*, predictions(*)")
      .order("kickoff_at", { ascending: true })
      .then(({ data }) => setMatches((data as Match[]) ?? []));
  }, []);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("subscription_plan").eq("id", user.id).maybeSingle()
      .then(({ data }) => setPlan(data?.subscription_plan ?? "free"));
  }, [user]);


  const filtered = filter === "all" ? matches : matches.filter((m) => m.sport === filter);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-4xl font-semibold">All matches</h1>
          <p className="text-muted-foreground mt-1">AI-powered forecasts across every sport we cover.</p>
        </motion.div>

        <div className="mt-6 flex flex-wrap gap-2">
          {sports.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-full text-sm capitalize transition ${
                filter === s ? "bg-gradient-to-r from-primary to-accent text-white" : "glass hover:bg-surface-2"
              }`}
            >
              {s === "all" ? "All" : `${sportEmoji[s] ?? ""} ${s}`}
            </button>
          ))}
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-5">
          {filtered.map((m, i) => {
            const p = m.predictions?.[0];
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ y: -4 }}
                className="glass rounded-2xl p-6"
              >
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="uppercase tracking-wider">
                    {sportEmoji[m.sport]} {m.sport}
                  </span>
                  <span>{m.league}</span>
                </div>
                <div className="mt-3 font-display text-xl font-semibold">
                  {m.home_team} <span className="text-muted-foreground">vs</span> {m.away_team}
                </div>
                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" /> {new Date(m.kickoff_at).toLocaleString()}
                </div>

                {p ? (
                  <div className="mt-5">
                    <div className="flex h-2 overflow-hidden rounded-full bg-surface-2">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${p.home_win_prob}%` }} className="bg-accent" />
                      <motion.div initial={{ width: 0 }} animate={{ width: `${p.draw_prob}%` }} className="bg-muted" />
                      <motion.div initial={{ width: 0 }} animate={{ width: `${p.away_win_prob}%` }} className="bg-primary" />
                    </div>
                    <div className="mt-2 grid grid-cols-3 text-xs">
                      <div className="text-accent">Home {p.home_win_prob}%</div>
                      <div className="text-center text-muted-foreground">Draw {p.draw_prob}%</div>
                      <div className="text-right text-primary">Away {p.away_win_prob}%</div>
                    </div>
                    <div className="mt-4 flex items-start gap-2 rounded-xl bg-surface-2/60 p-3">
                      <Brain className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <div className="font-semibold flex items-center gap-2">
                          {p.predicted_outcome === "home" ? m.home_team : p.predicted_outcome === "away" ? m.away_team : "Draw"}
                          <span className="text-xs text-muted-foreground font-normal">{p.confidence}% confidence</span>
                        </div>
                        {p.reasoning && <p className="mt-1 text-muted-foreground text-xs">{p.reasoning}</p>}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                    <TrendingUp className="h-4 w-4 mx-auto mb-1" />
                    Prediction generating…
                  </div>
                )}

                <Button variant="outline" size="sm" className="mt-4 w-full">Make your forecast</Button>
              </motion.div>
            );
          })}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
