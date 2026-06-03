/**
 * /sports — Sports hub page
 *
 * PLACEHOLDERS:
 * ─────────────────────────────────────────────────────────────────────
 * Each sport card has a [SPLINE-CARD] slot. When you have your Spline
 * scenes ready, replace the gradient <div> inside each card with:
 *
 *   import Spline from "@splinetool/react-spline";
 *   <Spline
 *     scene="https://prod.spline.design/YOUR-SPORT-SCENE-ID/scene.splinecode"
 *     style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }}
 *   />
 *
 * Each sport needs its own Spline scene ID. Build/fork them one at a time
 * at spline.design — start with soccer and formula1, they're most impactful.
 * ─────────────────────────────────────────────────────────────────────
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { FloatingNav } from "@/components/FloatingNav";
import { SiteFooter } from "@/components/SiteFooter";
import { SPORTS_LIST } from "@/components/scenes/sportConfig";

export const Route = createFileRoute("/sports/")({
  head: () => ({
    meta: [
      { title: "Sports Universe — VisionPlay" },
      { name: "description", content: "Six sports. One intelligence platform. Step inside each one." },
    ],
  }),
  component: SportsHub,
});

function SportsHub() {
  return (
    <div style={{ background: "#06060a", color: "#fff", minHeight: "100vh", fontFamily: '"Inter", sans-serif' }}>
      <FloatingNav />

      {/* ── HEADER ────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "100px 64px 56px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 14 }}>
          Sports universe
        </p>
        <h1
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: "clamp(36px, 5vw, 68px)",
            fontWeight: 300,
            letterSpacing: "-0.035em",
            lineHeight: 1.05,
            marginBottom: 16,
          }}
        >
          Six sports.
          <br />
          <span style={{ color: "rgba(255,255,255,0.35)" }}>One intelligence platform.</span>
        </h1>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.4)", maxWidth: 480, lineHeight: 1.65 }}>
          Scroll inside any sport and the data unfolds around you — statistics, forecasts, and AI reasoning woven into a cinematic experience.
        </p>
      </div>

      {/* ── SPORT GRID ────────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 64px 100px",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 1,
        }}
      >
        {SPORTS_LIST.map((s, i) => (
          <SportCard key={s.slug} sport={s} large={i === 0} />
        ))}
      </div>

      <SiteFooter />
    </div>
  );
}

function SportCard({
  sport: s,
  large,
}: {
  sport: (typeof SPORTS_LIST)[0];
  large?: boolean;
}) {
  return (
    <Link
      to="/sports/$sport"
      params={{ sport: s.slug }}
      style={{
        display: "block",
        position: "relative",
        height: large ? 420 : 300,
        overflow: "hidden",
        border: "0.5px solid rgba(255,255,255,0.06)",
        borderRadius: 12,
        textDecoration: "none",
        color: "#fff",
        gridColumn: large ? "span 2" : "span 1",
      }}
      onMouseEnter={(e) => {
        const overlay = e.currentTarget.querySelector(".sport-overlay") as HTMLElement | null;
        if (overlay) overlay.style.opacity = "0.7";
        const arrow = e.currentTarget.querySelector(".sport-arrow") as HTMLElement | null;
        if (arrow) arrow.style.transform = "translateX(4px)";
      }}
      onMouseLeave={(e) => {
        const overlay = e.currentTarget.querySelector(".sport-overlay") as HTMLElement | null;
        if (overlay) overlay.style.opacity = "0.35";
        const arrow = e.currentTarget.querySelector(".sport-arrow") as HTMLElement | null;
        if (arrow) arrow.style.transform = "translateX(0)";
      }}
    >
      {/*
        [SPLINE-CARD] — Replace this gradient with a Spline scene:
        <Spline
          scene="https://prod.spline.design/YOUR-ID/scene.splinecode"
          style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }}
        />

        Spline search terms per sport:
          soccer       → "soccer ball field"
          formula1     → "formula 1 car"
          basketball   → "basketball court"
          tennis       → "tennis racket ball"
          baseball     → "baseball bat"
          cricket      → "cricket bat ball"

        While you build those, this gradient placeholder looks clean.
      */}

      <video
        src={`/videos/${s.slug}.mp4`}
        autoPlay
        muted
        loop
        playsInline
        className="sport-overlay"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.45 }}
      />


      {/* Dark gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, transparent 30%, rgba(6,6,10,0.85) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to right, rgba(6,6,10,0.5) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: large ? "32px 32px" : "22px 22px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.accent }} />
          <span style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>
            {s.environment}
          </span>
        </div>
        <h2
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: large ? 32 : 22,
            fontWeight: 400,
            letterSpacing: "-0.025em",
            marginBottom: 6,
          }}
        >
          {s.name}
        </h2>
        <p
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.4)",
            lineHeight: 1.5,
            marginBottom: 14,
            maxWidth: large ? 440 : 260,
          }}
        >
          {s.tagline}
        </p>
        <div
          className="sport-arrow"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            color: s.accent,
            transition: "transform 0.25s ease",
          }}
        >
          Enter scene <span>→</span>
        </div>
      </div>
    </Link>
  );
}
