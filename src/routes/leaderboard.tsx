import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Crown, Trophy, Award, Target } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({ meta: [{ title: "Leaderboard — VisionPlay" }] }),
  component: LeaderboardPage,
});

type Row = { id: string; display_name: string | null; tier: string; accuracy: number; forecasts_count: number };

const tierIcon: Record<string, { Icon: typeof Crown; color: string }> = {
  oracle: { Icon: Crown, color: "text-violet-400" },
  gold: { Icon: Trophy, color: "text-yellow-400" },
  silver: { Icon: Award, color: "text-slate-300" },
  bronze: { Icon: Target, color: "text-amber-600" },
};

function LeaderboardPage() {
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    supabase
      .from("profiles")
      .select("id, display_name, tier, accuracy, forecasts_count")
      .order("accuracy", { ascending: false })
      .limit(50)
      .then(({ data }) => setRows((data as Row[]) ?? []));
  }, []);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-4xl font-semibold">Global leaderboard</h1>
          <p className="text-muted-foreground mt-1">The sharpest forecasters on VisionPlay.</p>
        </motion.div>

        <div className="mt-8 glass rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 gap-2 px-5 py-3 border-b border-border/40 text-xs uppercase tracking-wider text-muted-foreground">
            <div className="col-span-1">#</div>
            <div className="col-span-5">Analyst</div>
            <div className="col-span-3">Tier</div>
            <div className="col-span-2 text-right">Accuracy</div>
            <div className="col-span-1 text-right">#</div>
          </div>
          {rows.length === 0 && (
            <div className="p-10 text-center text-muted-foreground text-sm">No forecasters yet — be the first!</div>
          )}
          {rows.map((r, i) => {
            const t = tierIcon[r.tier] ?? tierIcon.bronze;
            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="grid grid-cols-12 gap-2 px-5 py-4 border-b border-border/20 items-center hover:bg-surface-2/40 transition"
              >
                <div className="col-span-1 font-display font-semibold">{i + 1}</div>
                <div className="col-span-5 font-medium">{r.display_name ?? "Anonymous"}</div>
                <div className="col-span-3 flex items-center gap-2 capitalize">
                  <t.Icon className={`h-4 w-4 ${t.color}`} /> {r.tier}
                </div>
                <div className="col-span-2 text-right text-accent font-semibold">{r.accuracy}%</div>
                <div className="col-span-1 text-right text-muted-foreground text-sm">{r.forecasts_count}</div>
              </motion.div>
            );
          })}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
