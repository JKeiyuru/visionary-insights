import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SPORTS_LIST } from "@/components/scenes/sportConfig";

export const Route = createFileRoute("/sports/")({
  head: () => ({
    meta: [
      { title: "Sports Universe — VisionPlay" },
      { name: "description", content: "Step into immersive 3D experiences for every sport we cover." },
    ],
  }),
  component: SportsHub,
});

function SportsHub() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Sports universe</div>
          <h1 className="mt-3 font-display text-5xl sm:text-6xl font-semibold leading-[1.05]">
            Pick a sport.<br />
            <span className="text-gradient">Step inside it.</span>
          </h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Every sport has its own scene, its own physics, its own story. Scroll inside one and the data unfolds around you.
          </p>
        </motion.div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SPORTS_LIST.map((s, i) => (
            <motion.div
              key={s.slug}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              whileHover={{ y: -6 }}
            >
              <Link
                to="/sports/$sport"
                params={{ sport: s.slug }}
                className="group relative block overflow-hidden rounded-3xl border border-border bg-card/60 backdrop-blur p-6 h-64"
              >
                <div className="absolute inset-0 opacity-30 group-hover:opacity-60 transition-opacity"
                     style={{ background: `radial-gradient(circle at 70% 20%, ${s.primary}, transparent 60%), radial-gradient(circle at 20% 90%, ${s.accent}, transparent 55%)` }} />
                <div className="relative flex h-full flex-col justify-between">
                  <div className="text-6xl">{s.emoji}</div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.environment}</div>
                    <h3 className="mt-1 font-display text-2xl font-semibold">{s.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{s.tagline}</p>
                    <div className="mt-3 inline-flex items-center gap-1 text-sm font-medium" style={{ color: s.accent }}>
                      Enter scene <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
