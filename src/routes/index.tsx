import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Brain, Activity, Trophy, Sparkles, Target, Crown, Award, Check, Zap, Shield, TrendingUp } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SportsScene } from "@/components/SportsScene";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VisionPlay — AI Sports Intelligence & Forecasting" },
      { name: "description", content: "Explainable AI predictions across soccer, basketball, F1, baseball and tennis. Join the smartest sports analytics community." },
      { property: "og:title", content: "VisionPlay — AI Sports Intelligence" },
      { property: "og:description", content: "Explainable forecasts. Live momentum. Reputation-driven community." },
    ],
  }),
  component: Landing,
});

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

function Landing() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-12 pb-16 lg:pt-20 lg:pb-24 grid lg:grid-cols-2 gap-10 items-center">
          <motion.div initial="hidden" animate="show" variants={fadeUp}>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs">
              <Sparkles className="h-3.5 w-3.5 text-accent" /> Powered by explainable AI
            </div>
            <h1 className="mt-5 font-display text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight">
              See the game <span className="text-gradient">before</span> it happens.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              VisionPlay turns live data, form, weather and momentum into transparent forecasts you can actually trust — across soccer, basketball, F1, baseball, tennis and more.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/signup">
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-white border-0 shadow-lg">
                  Start free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/matches">
                <Button size="lg" variant="outline">Explore matches</Button>
              </Link>
            </div>
            <div className="mt-8 flex gap-6 text-sm text-muted-foreground">
              <div><span className="text-foreground font-semibold">72%</span> avg accuracy</div>
              <div><span className="text-foreground font-semibold">14k+</span> analysts</div>
              <div><span className="text-foreground font-semibold">6</span> sports</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[420px] sm:h-[520px] rounded-3xl glass overflow-hidden"
          >
            <SportsScene className="absolute inset-0" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="text-center max-w-2xl mx-auto">
          <h2 className="font-display text-4xl font-semibold">Built for the modern analyst</h2>
          <p className="mt-3 text-muted-foreground">Four pillars that make VisionPlay unlike anything you've used before.</p>
        </motion.div>
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: Brain, t: "Explainable AI", d: "Every prediction shows xG, form, injuries and weather. No black boxes." },
            { icon: Activity, t: "Live momentum", d: "Real-time probability shifts as matches unfold. Stay one step ahead." },
            { icon: Trophy, t: "Reputation system", d: "Climb from Bronze to Oracle as your forecasts prove accurate." },
            { icon: Shield, t: "Responsible by design", d: "Analytics first. We're not a betting operator." },
          ].map((f, i) => (
            <motion.div
              key={f.t}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="glass rounded-2xl p-5"
            >
              <f.icon className="h-6 w-6 text-accent" />
              <h3 className="mt-4 font-display text-lg font-semibold">{f.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TIERS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-display text-4xl font-semibold">Earn your reputation</h2>
          <p className="mt-3 text-muted-foreground">Forecast accurately and climb the ranks. Top analysts unlock revenue share.</p>
        </div>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Target, name: "Bronze", min: "0%", color: "from-amber-700 to-amber-500" },
            { icon: Award, name: "Silver", min: "55%", color: "from-slate-400 to-slate-200" },
            { icon: Trophy, name: "Gold", min: "65%", color: "from-yellow-500 to-yellow-300" },
            { icon: Crown, name: "Oracle", min: "75%", color: "from-violet-500 to-fuchsia-400" },
          ].map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 text-center"
            >
              <div className={`mx-auto h-14 w-14 rounded-2xl bg-gradient-to-br ${t.color} grid place-items-center shadow-lg`}>
                <t.icon className="h-7 w-7 text-background" />
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold">{t.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{t.min} accuracy</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-display text-4xl font-semibold">Simple, fair pricing</h2>
          <p className="mt-3 text-muted-foreground">Pay in KES via M-Pesa or card. Cancel anytime.</p>
        </div>
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: "Free", price: "KES 0", period: "forever", features: ["5 picks / day", "Basic insights", "Community access"] },
            { name: "Weekly", price: "KES 149", period: "/week", features: ["Unlimited picks", "Live momentum", "Email alerts"] },
            { name: "Monthly", price: "KES 399", period: "/month", featured: true, features: ["Everything in Weekly", "Premium leagues", "Priority support", "Revenue share access"] },
            { name: "Elite Season", price: "KES 2,999", period: "/season", features: ["All sports unlocked", "1-on-1 analyst time", "Private discord", "Early features"] },
          ].map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`relative rounded-2xl p-6 ${p.featured ? "bg-gradient-to-b from-primary/15 to-accent/10 border-2 border-primary glow-ring" : "glass"}`}
            >
              {p.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-accent px-3 py-1 text-xs font-semibold text-white">
                  Most popular
                </div>
              )}
              <h3 className="font-display text-xl font-semibold">{p.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-display text-3xl font-bold">{p.price}</span>
                <span className="text-sm text-muted-foreground">{p.period}</span>
              </div>
              <ul className="mt-5 space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm">
                    <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="block mt-6">
                <Button className={`w-full ${p.featured ? "bg-gradient-to-r from-primary to-accent text-white border-0" : ""}`} variant={p.featured ? "default" : "outline"}>
                  Get started
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/15 border border-border p-10 lg:p-16 text-center"
        >
          <Zap className="mx-auto h-10 w-10 text-warning" />
          <h2 className="mt-4 font-display text-4xl sm:text-5xl font-semibold">Join VisionPlay today</h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Smarter sports, transparent forecasts, a community that rewards accuracy. Start free in 30 seconds.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-white border-0">
                Create your account <TrendingUp className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/matches">
              <Button size="lg" variant="outline">Browse matches</Button>
            </Link>
          </div>
        </motion.div>
      </section>

      <SiteFooter />
    </div>
  );
}
