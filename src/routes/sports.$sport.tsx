import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ClientImmersive } from "@/components/scenes/ClientImmersive";
import { SPORTS, type SportSlug } from "@/components/scenes/sportConfig";

export const Route = createFileRoute("/sports/$sport")({
  head: ({ params }) => {
    const s = SPORTS[params.sport as SportSlug];
    return {
      meta: [
        { title: s ? `${s.name} — VisionPlay` : "Sport — VisionPlay" },
        { name: "description", content: s?.tagline ?? "" },
      ],
    };
  },
  loader: ({ params }) => {
    const sport = SPORTS[params.sport as SportSlug];
    if (!sport) throw notFound();
    return { sport };
  },
  component: SportPage,
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center">
      <div className="text-center">
        <h1 className="font-display text-3xl">Sport not found</h1>
        <Link to="/sports" className="mt-4 inline-block text-accent">Back to sports universe</Link>
      </div>
    </div>
  ),
});

function SportPage() {
  const { sport } = Route.useLoaderData();

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Sport hero strip */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-8 pb-4">
        <Link to="/sports" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3 w-3" /> All sports
        </Link>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex items-end justify-between gap-6 flex-wrap">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">{sport.environment}</div>
            <h1 className="mt-2 font-display text-4xl sm:text-5xl font-semibold">
              <span className="mr-2">{sport.emoji}</span>{sport.name}
            </h1>
            <p className="mt-2 max-w-lg text-muted-foreground">{sport.tagline}</p>
          </div>
          <div className="text-xs text-muted-foreground">↓ scroll to enter the scene</div>
        </motion.div>
      </section>

      {/* The immersive scroll story */}
      <ClientImmersive sport={sport} />

      {/* Outro CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20 text-center">
        <h2 className="font-display text-4xl sm:text-5xl font-semibold">
          Ready for the <span style={{ color: sport.accent }}>{sport.name}</span> forecast?
        </h2>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          See live matches, AI reasoning, and the win-probability bands — updated every 30 seconds.
        </p>
        <Link to="/matches" className="mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-primary-foreground"
              style={{ background: `linear-gradient(90deg, ${sport.primary}, ${sport.accent})` }}>
          See {sport.name} matches <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <SiteFooter />
    </div>
  );
}
