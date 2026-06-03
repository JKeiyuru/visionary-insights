/**
 * VisionPlay — Cinematic Home Page
 *
 * PLACEHOLDERS IN THIS FILE:
 * ─────────────────────────────────────────────────────────────────────────────
 * [SPLINE-HERO]       Replace <SplinePlaceholder> with your Spline scene.
 *                     Search spline.design community for:
 *                       "soccer ball 3d" / "sports equipment"
 *                     Then: npm install @splinetool/react-spline
 *                     <Spline scene="https://prod.spline.design/YOUR-ID/scene.splinecode" />
 *
 * [VIDEO-HERO]        Optional: a 4-8 second looping stadium atmosphere video
 *                     works great as the background behind text (no 3D needed).
 *                     Source: Pexels.com → search "football stadium night" or "racing circuit"
 *                     → free for commercial use. Download 1080p, host in /public/videos/
 *                     Uncomment the <video> block below labeled [VIDEO-HERO].
 *
 * [VIDEO-FEATURE]     A short product walkthrough video showing the AI predictions UI.
 *                     Record your own screen with Loom or ScreenStudio.
 *                     Drop at /public/videos/product-demo.mp4
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { FloatingNav } from "@/components/FloatingNav";
import { SiteFooter } from "@/components/SiteFooter";
import { useViewport } from "@/hooks/use-viewport";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VisionPlay — AI Sports Intelligence" },
      {
        name: "description",
        content:
          "See the match before it happens. AI-powered explainable predictions across soccer, basketball, F1 and more.",
      },
    ],
  }),
  component: Home,
});

// ── Sport chapters ────────────────────────────────────────────────────────────
const CHAPTERS = [
  {
    sport: "soccer",
    splineSearch: "soccer ball stadium",
    videoSearch: "football stadium night crowd pexels",
    headline: "See the goal\nbefore it happens.",
    body: "Expected goals, momentum shifts, weather, form — synthesised into one confident prediction, explained step by step.",
    stat: { value: "71.4%", label: "Average accuracy" },
    accent: "#34d399",
    bg: "radial-gradient(ellipse 80% 100% at 60% 40%, #0d3320 0%, #06060a 70%)",
  },
  {
    sport: "formula1",
    splineSearch: "formula 1 car racing",
    videoSearch: "formula 1 race track night pexels",
    headline: "Every lap,\nevery strategy call.",
    body: "1,000 telemetry channels. Tyre degradation, fuel load, pit window probability. We model the race before lights out.",
    stat: { value: "1,024", label: "Strategy scenarios per race" },
    accent: "#f87171",
    bg: "radial-gradient(ellipse 80% 100% at 60% 40%, #3d0d0d 0%, #06060a 70%)",
  },
  {
    sport: "basketball",
    splineSearch: "basketball court 3d",
    videoSearch: "basketball arena court lights pexels",
    headline: "Every possession.\nLive.",
    body: "Shot quality, defensive rotation, pace. Win probability updated after every basket — not just at halftime.",
    stat: { value: "30s", label: "Live update interval" },
    accent: "#fb923c",
    bg: "radial-gradient(ellipse 80% 100% at 60% 40%, #3d1e0d 0%, #06060a 70%)",
  },
  {
    sport: "tennis",
    splineSearch: "tennis ball racket 3d",
    videoSearch: "tennis court aerial overhead pexels",
    headline: "Surface.\nSpin. Stamina.",
    body: "Grass, clay, hard — each surface reshapes every forecast. We track the variables broadcasters miss.",
    stat: { value: "120+", label: "Tournaments modelled" },
    accent: "#a3e635",
    bg: "radial-gradient(ellipse 80% 100% at 60% 40%, #1a2e0a 0%, #06060a 70%)",
  },
  {
    sport: "baseball",
    splineSearch: "baseball bat ball stadium",
    videoSearch: "baseball stadium night lights pexels",
    headline: "Every pitch\nis probability.",
    body: "Spin rate, exit velocity, launch angle. Statcast-aware forecasts updated pitch by pitch, batter by batter.",
    stat: { value: "300+", label: "Pitches analysed per game" },
    accent: "#60a5fa",
    bg: "radial-gradient(ellipse 80% 100% at 60% 40%, #0d1a3d 0%, #06060a 70%)",
  },
  {
    sport: "cricket",
    splineSearch: "cricket ball bat pitch",
    videoSearch: "cricket stadium match day aerial pexels",
    headline: "DLS. Dew.\nPitch wear.",
    body: "Test, ODI, T20. Every variable that determines an innings, modelled across every format and condition.",
    stat: { value: "3", label: "Formats. Every match covered." },
    accent: "#fbbf24",
    bg: "radial-gradient(ellipse 80% 100% at 60% 40%, #2e220d 0%, #06060a 70%)",
  },
];


// ── Placeholder components ────────────────────────────────────────────────────

/** Drop-in placeholder for a Spline 3D scene */
function SplinePlaceholder({
  search,
  accent,
  bg,
}: {
  search: string;
  accent: string;
  bg: string;
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        justifyContent: "flex-start",
        padding: "72px 48px",
        transition: "background 0.9s ease",
      }}
    >
      {/* Instructional overlay — remove when you add real 3D */}
      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "0.5px solid rgba(255,255,255,0.1)",
          borderRadius: 12,
          padding: "14px 18px",
          maxWidth: 280,
          textAlign: "right",
        }}
      >
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: accent,
            marginBottom: 6,
          }}
        >
          3D Placeholder
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>
          Search spline.design for{" "}
          <span style={{ color: "rgba(255,255,255,0.7)" }}>"{search}"</span>
          {" → "}fork a scene → publish → paste URL here
        </div>
      </div>
    </div>
  );
}

/** Drop-in placeholder for a background video */
function VideoPlaceholder({
  search,
  accent,
  label,
  hint,
}: {
  search: string;
  accent: string;
  label?: string;
  hint?: string;
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(255,255,255,0.02)",
        border: "0.5px dashed rgba(255,255,255,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 320, padding: 24 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: `1.5px solid ${accent}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              borderTop: "8px solid transparent",
              borderBottom: "8px solid transparent",
              borderLeft: `14px solid ${accent}`,
              marginLeft: 3,
            }}
          />
        </div>
        <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 6 }}>Video placeholder</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>
          Search pexels.com for{" "}
          <span style={{ color: "rgba(255,255,255,0.6)" }}>"{search}"</span>
          <br />
          Download 1080p MP4 → /public/videos/
          <br />
          Uncomment the &lt;video&gt; block in index.tsx
        </div>
      </div>
    </div>
  );
}

// ── Home component ────────────────────────────────────────────────────────────
function Home() {
  const [activeChapter, setActiveChapter] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const chapter = CHAPTERS[activeChapter];

  useEffect(() => {
    function onScroll() {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalHeight = containerRef.current.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, -rect.top / totalHeight));
      setScrollProgress(progress);
      const idx = Math.min(CHAPTERS.length - 1, Math.floor(progress * CHAPTERS.length));
      setActiveChapter(idx);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      style={{
        background: "#06060a",
        color: "#fff",
        minHeight: "100vh",
        fontFamily: '"Inter", ui-sans-serif, sans-serif',
      }}
    >
      <FloatingNav />

      {/* ── CINEMATIC SCROLL SECTION ─────────────────────────────────────── */}
      <div
        ref={containerRef}
        style={{ height: `${CHAPTERS.length * 100}vh`, position: "relative" }}
      >
        {/* Sticky canvas */}
        <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>

          {/* ── BACKGROUND LAYER (3D / Video) ──────────────────────────── */}
          {CHAPTERS.map((c, i) => (
            <div
              key={c.sport}
              style={{
                position: "absolute",
                inset: 0,
                opacity: i === activeChapter ? 1 : 0,
                transition: "opacity 1s cubic-bezier(0.25,0.1,0.25,1)",
                pointerEvents: i === activeChapter ? "auto" : "none",
              }}
            >
              {/*
               * ──────────────────────────────────────────────────────────
               * OPTION A: Replace SplinePlaceholder with your Spline scene:
               *
               *   import Spline from "@splinetool/react-spline";
               *   <Spline
               *     scene="https://prod.spline.design/YOUR-SCENE-ID/scene.splinecode"
               *     style={{ width: "100%", height: "100%" }}
               *   />
               *
               * OPTION B: Replace with a background video:
               *
               *   <video
               *     src={`/videos/${c.sport.toLowerCase()}.mp4`}
               *     autoPlay muted loop playsInline
               *     style={{ width:"100%", height:"100%", objectFit:"cover" }}
               *   />
               *
               * For now: gradient placeholder + instruction card
               * ──────────────────────────────────────────────────────────
               */}
              <video
                src={`/videos/${c.sport}.mp4`}
                autoPlay
                muted
                loop
                playsInline
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
              />


              {/* Cinematic overlays — keep these regardless of 3D/video */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to bottom, rgba(6,6,10,0.05) 0%, rgba(6,6,10,0.4) 55%, rgba(6,6,10,0.95) 100%)",
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to right, rgba(6,6,10,0.8) 0%, rgba(6,6,10,0.2) 50%, transparent 100%)",
                  pointerEvents: "none",
                }}
              />
            </div>
          ))}

          {/* ── CHAPTER TEXT ─────────────────────────────────────────────── */}
          <div
            style={{
              position: "absolute",
              bottom: 100,
              left: 0,
              right: 0,
              padding: "0 64px",
              maxWidth: 700,
              pointerEvents: "none",
            }}
          >
            {/* Sport pill */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                marginBottom: 22,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: chapter.accent,
                  transition: "background 0.6s ease",
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: chapter.accent,
                  transition: "color 0.6s ease",
                }}
              >
                {chapter.sport}
              </span>
            </div>

            {/* Headline */}
            <h1
              style={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: "clamp(38px, 5.5vw, 76px)",
                fontWeight: 300,
                lineHeight: 1.05,
                letterSpacing: "-0.035em",
                whiteSpace: "pre-line",
                color: "#fff",
                marginBottom: 22,
              }}
            >
              {chapter.headline}
            </h1>

            {/* Body */}
            <p
              style={{
                fontSize: 17,
                lineHeight: 1.65,
                color: "rgba(255,255,255,0.55)",
                maxWidth: 480,
                marginBottom: 30,
              }}
            >
              {chapter.body}
            </p>

            {/* Stat */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "baseline",
                gap: 12,
                paddingTop: 18,
                borderTop: "0.5px solid rgba(255,255,255,0.1)",
              }}
            >
              <span
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: 36,
                  fontWeight: 500,
                  letterSpacing: "-0.04em",
                  color: chapter.accent,
                  transition: "color 0.6s ease",
                }}
              >
                {chapter.stat.value}
              </span>
              <span
                style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", letterSpacing: "0.04em" }}
              >
                {chapter.stat.label}
              </span>
            </div>
          </div>

          {/* ── CHAPTER RAIL (right side) ─────────────────────────────── */}
          <div
            style={{
              position: "absolute",
              right: 36,
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              pointerEvents: "none",
            }}
          >
            {CHAPTERS.map((c, i) => (
              <div
                key={c.sport}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: 8,
                  opacity: i === activeChapter ? 1 : 0.25,
                  transition: "opacity 0.4s ease",
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: i === activeChapter ? "#fff" : "rgba(255,255,255,0.4)",
                  }}
                >
                  {c.sport}
                </span>
                <div
                  style={{
                    height: 1,
                    width: i === activeChapter ? 28 : 10,
                    background: i === activeChapter ? chapter.accent : "rgba(255,255,255,0.2)",
                    transition: "all 0.4s ease",
                  }}
                />
              </div>
            ))}
          </div>

          {/* ── SCROLL PROGRESS BAR ─────────────────────────────────────── */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 1,
              background: "rgba(255,255,255,0.06)",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${scrollProgress * 100}%`,
                background: chapter.accent,
                transition: "width 0.1s linear, background 0.6s ease",
              }}
            />
          </div>

          {/* ── SCROLL CTA (first chapter only) ─────────────────────────── */}
          {activeChapter === 0 && scrollProgress < 0.03 && (
            <div
              style={{
                position: "absolute",
                bottom: 32,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                pointerEvents: "none",
                animation: "bob 2s ease-in-out infinite",
              }}
            >
              <span style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>
                Scroll
              </span>
              <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
                <path d="M8 0v16M2 10l6 6 6-6" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* ── INTRO CTA STRIP ──────────────────────────────────────────────── */}
      <div
        style={{
          borderTop: "0.5px solid rgba(255,255,255,0.06)",
          borderBottom: "0.5px solid rgba(255,255,255,0.06)",
          padding: "32px 64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", maxWidth: 500 }}>
          Explainable AI predictions across 6 sports. Free to start.
        </p>
        <Link
          to="/signup"
          style={{
            display: "inline-block",
            background: "#fff",
            color: "#000",
            textDecoration: "none",
            padding: "11px 26px",
            borderRadius: 100,
            fontSize: 14,
            fontWeight: 500,
            flexShrink: 0,
          }}
        >
          Start free →
        </Link>
      </div>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "120px 64px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 100,
            alignItems: "start",
          }}
        >
          <div>
            <p
              style={{
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)",
                marginBottom: 20,
              }}
            >
              How it works
            </p>
            <h2
              style={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: "clamp(28px, 3.2vw, 48px)",
                fontWeight: 300,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                marginBottom: 22,
              }}
            >
              No black boxes.
              <br />
              Every prediction
              <br />
              explains itself.
            </h2>
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.45)",
                marginBottom: 36,
                maxWidth: 380,
              }}
            >
              Form, injuries, weather, referee tendencies, expected goals — laid out in plain language. You see exactly why we made the call.
            </p>
            <Link
              to="/matches"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 14,
                color: "#fff",
                textDecoration: "none",
                borderBottom: "0.5px solid rgba(255,255,255,0.25)",
                paddingBottom: 3,
              }}
            >
              See live predictions <span>→</span>
            </Link>
          </div>

          {/* Product video placeholder */}
          <div>
            {/*
             * [VIDEO-FEATURE] — Product UI walkthrough video
             * Record: Screen-record the matches page with a few predictions open.
             * Tools: Loom (free), ScreenStudio (Mac), or OBS
             * Format: MP4, 1200×800, 15-30 seconds, looping
             * Save to: /public/videos/product-demo.mp4
             *
             * When ready, replace this VideoPlaceholder with:
             *   <video
             *     src="/videos/product-demo.mp4"
             *     autoPlay muted loop playsInline
             *     style={{ width:"100%", borderRadius:16, border:"0.5px solid rgba(255,255,255,0.08)" }}
             *   />
             */}
            <div
              style={{
                width: "100%",
                aspectRatio: "16/10",
                borderRadius: 16,
                border: "0.5px solid rgba(255,255,255,0.08)",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <VideoPlaceholder
                search="football stadium atmosphere night"
                accent="#34d399"
                label="Product demo video"
                hint="Screen-record the matches page with predictions open. Save as /public/videos/product-demo.mp4 (15–30s loop)."
              />
            </div>
          </div>
        </div>

        {/* Feature list */}
        <div
          style={{
            marginTop: 80,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            borderTop: "0.5px solid rgba(255,255,255,0.06)",
          }}
        >
          {[
            { n: "01", title: "Explainable AI", desc: "Every forecast links to the data that drove it. No magic numbers." },
            { n: "02", title: "Live momentum", desc: "Probability shifts as matches unfold. 30-second refresh rate." },
            { n: "03", title: "Reputation system", desc: "Forecast accurately and climb from Bronze to Oracle." },
            { n: "04", title: "6 sports", desc: "Soccer, F1, basketball, tennis, baseball, cricket." },
          ].map((f) => (
            <div
              key={f.n}
              style={{
                padding: "28px 0",
                paddingRight: 24,
                borderRight: "0.5px solid rgba(255,255,255,0.06)",
                paddingLeft: f.n === "01" ? 0 : 24,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.2)",
                  marginBottom: 16,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {f.n}
              </div>
              <div style={{ fontSize: 15, fontWeight: 500, letterSpacing: "-0.01em", marginBottom: 8 }}>
                {f.title}
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.55 }}>
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── LIVE MATCHES STRIP ───────────────────────────────────────────── */}
      <section
        style={{
          borderTop: "0.5px solid rgba(255,255,255,0.06)",
          borderBottom: "0.5px solid rgba(255,255,255,0.06)",
          padding: "80px 0",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 64px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 40,
            }}
          >
            <h2
              style={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: "clamp(24px, 2.8vw, 40px)",
                fontWeight: 300,
                letterSpacing: "-0.03em",
              }}
            >
              Live forecasts.
            </h2>
            <Link
              to="/matches"
              style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", textDecoration: "none" }}
            >
              All matches →
            </Link>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              border: "0.5px solid rgba(255,255,255,0.06)",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            {[
              { home: "Arsenal", away: "Chelsea", sport: "soccer", homeP: 58, drawP: 22, awayP: 20, conf: 78, verdict: "Arsenal to win", live: true, accent: "#34d399" },
              { home: "Lakers", away: "Celtics", sport: "basketball", homeP: 44, drawP: 0, awayP: 56, conf: 65, verdict: "Celtics to win", live: false, accent: "#fb923c" },
              { home: "Verstappen", away: "Hamilton", sport: "f1", homeP: 67, drawP: 0, awayP: 33, conf: 71, verdict: "Verstappen pole → win", live: false, accent: "#f87171" },
            ].map((m, i) => (
              <MatchCard key={m.home} {...m} last={i === 2} />
            ))}
          </div>
        </div>
      </section>

      {/* ── SPORTS GRID ──────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "120px 64px" }}>
        <p
          style={{
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)",
            marginBottom: 16,
          }}
        >
          Coverage
        </p>
        <h2
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: "clamp(28px, 3.2vw, 48px)",
            fontWeight: 300,
            letterSpacing: "-0.03em",
            marginBottom: 48,
          }}
        >
          Six sports.
          <br />
          One intelligence platform.
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1,
            background: "rgba(255,255,255,0.04)",
            borderRadius: 16,
            overflow: "hidden",
            border: "0.5px solid rgba(255,255,255,0.06)",
          }}
        >
          {CHAPTERS.map((c) => (
            <Link
              key={c.sport}
              to={`/sports/${c.sport.toLowerCase().replace(" ", "-")}`}
              style={{
                display: "block",
                padding: "36px 28px",
                background: "#06060a",
                textDecoration: "none",
                transition: "background 0.25s ease",
                borderBottom: "0.5px solid rgba(255,255,255,0.04)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#06060a")}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: c.accent,
                  marginBottom: 20,
                }}
              />
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                  color: "#fff",
                  marginBottom: 6,
                }}
              >
                {c.sport}
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", lineHeight: 1.5 }}>
                {c.stat.value} · {c.stat.label}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── TIERS ────────────────────────────────────────────────────────── */}
      <section
        style={{
          borderTop: "0.5px solid rgba(255,255,255,0.06)",
          padding: "120px 64px",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 100,
              alignItems: "start",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.3)",
                  marginBottom: 20,
                }}
              >
                Reputation
              </p>
              <h2
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: "clamp(28px, 3.2vw, 48px)",
                  fontWeight: 300,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.1,
                  marginBottom: 22,
                }}
              >
                Earn your place.
                <br />
                Then earn revenue.
              </h2>
              <p
                style={{
                  fontSize: 16,
                  lineHeight: 1.7,
                  color: "rgba(255,255,255,0.4)",
                  maxWidth: 360,
                  marginBottom: 36,
                }}
              >
                Forecast accurately and unlock higher tiers. Oracle analysts receive a share of platform revenue. Your record is your rank.
              </p>
              <Link
                to="/leaderboard"
                style={{
                  fontSize: 14,
                  color: "#fff",
                  textDecoration: "none",
                  borderBottom: "0.5px solid rgba(255,255,255,0.25)",
                  paddingBottom: 3,
                }}
              >
                View leaderboard →
              </Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {[
                { name: "Bronze", req: "Open to everyone", perk: "5 free picks per day", color: "#b45309" },
                { name: "Silver", req: "55% accuracy over 50 forecasts", perk: "Unlimited picks + email alerts", color: "#94a3b8" },
                { name: "Gold", req: "65% accuracy over 100 forecasts", perk: "Premium leagues + live momentum", color: "#eab308" },
                { name: "Oracle", req: "75% accuracy over 200 forecasts", perk: "Revenue share + private discord", color: "#a78bfa" },
              ].map((t, i) => (
                <div
                  key={t.name}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "120px 1fr",
                    gap: 24,
                    padding: "20px 0",
                    borderBottom: i < 3 ? "0.5px solid rgba(255,255,255,0.06)" : "none",
                    alignItems: "start",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 500,
                        color: t.color,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {t.name}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginBottom: 3 }}>
                      {t.req}
                    </div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>{t.perk}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING PREVIEW ──────────────────────────────────────────────── */}
      <section
        style={{
          borderTop: "0.5px solid rgba(255,255,255,0.06)",
          padding: "120px 64px",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
              marginBottom: 16,
            }}
          >
            Pricing
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 48,
            }}
          >
            <h2
              style={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: "clamp(28px, 3.2vw, 48px)",
                fontWeight: 300,
                letterSpacing: "-0.03em",
              }}
            >
              Start free.
              <br />
              Scale when you're ready.
            </h2>
            <Link
              to="/pricing"
              style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", textDecoration: "none", flexShrink: 0, marginLeft: 24 }}
            >
              All plans →
            </Link>
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1 }}
          >
            {[
              { name: "Free", price: "KES 0", period: "forever", features: ["5 picks / day", "Basic insights", "Community access"], accent: "rgba(255,255,255,0.2)" },
              { name: "Weekly", price: "KES 149", period: "/week", features: ["Unlimited picks", "Live momentum", "SMS alerts"], accent: "rgba(255,255,255,0.3)" },
              { name: "Monthly", price: "KES 399", period: "/month", features: ["Premium leagues", "Priority support", "Revenue share access"], accent: "#60a5fa", featured: true },
              { name: "Elite Season", price: "KES 2,999", period: "/season", features: ["All sports unlocked", "1-on-1 analyst time", "Private discord"], accent: "#a78bfa" },
            ].map((p) => (
              <div
                key={p.name}
                style={{
                  padding: "28px 24px",
                  background: p.featured ? "rgba(96,165,250,0.04)" : "rgba(255,255,255,0.01)",
                  border: p.featured ? "0.5px solid rgba(96,165,250,0.2)" : "0.5px solid rgba(255,255,255,0.05)",
                  borderRadius: 12,
                  position: "relative",
                }}
              >
                {p.featured && (
                  <div
                    style={{
                      position: "absolute",
                      top: -10,
                      left: 20,
                      background: "#60a5fa",
                      color: "#000",
                      fontSize: 10,
                      fontWeight: 500,
                      padding: "3px 10px",
                      borderRadius: 100,
                      letterSpacing: "0.06em",
                    }}
                  >
                    Most popular
                  </div>
                )}
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 14, color: p.accent }}>{p.name}</div>
                <div style={{ marginBottom: 20 }}>
                  <span
                    style={{
                      fontFamily: '"Space Grotesk", sans-serif',
                      fontSize: 26,
                      fontWeight: 400,
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {p.price}
                  </span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginLeft: 4 }}>
                    {p.period}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                  {p.features.map((f) => (
                    <div
                      key={f}
                      style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", display: "flex", gap: 8, alignItems: "flex-start" }}
                    >
                      <span style={{ color: p.accent, flexShrink: 0 }}>—</span>
                      {f}
                    </div>
                  ))}
                </div>
                <Link
                  to="/signup"
                  style={{
                    display: "block",
                    textAlign: "center",
                    fontSize: 13,
                    textDecoration: "none",
                    padding: "10px 0",
                    borderRadius: 8,
                    background: p.featured ? "#60a5fa" : "transparent",
                    color: p.featured ? "#000" : "rgba(255,255,255,0.45)",
                    border: p.featured ? "none" : "0.5px solid rgba(255,255,255,0.12)",
                    transition: "opacity 0.2s",
                  }}
                >
                  {p.name === "Free" ? "Start free" : `Choose ${p.name}`}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section
        style={{
          textAlign: "center",
          padding: "160px 64px",
          borderTop: "0.5px solid rgba(255,255,255,0.06)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 600,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(52,211,153,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <p
          style={{
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.25)",
            marginBottom: 28,
          }}
        >
          Ready?
        </p>
        <h2
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: "clamp(40px, 6vw, 88px)",
            fontWeight: 300,
            letterSpacing: "-0.04em",
            lineHeight: 1.0,
            marginBottom: 28,
          }}
        >
          See the match
          <br />
          before it happens.
        </h2>
        <p
          style={{
            fontSize: 16,
            color: "rgba(255,255,255,0.35)",
            marginBottom: 44,
          }}
        >
          Free to start. No credit card.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <Link
            to="/signup"
            style={{
              display: "inline-block",
              background: "#fff",
              color: "#000",
              textDecoration: "none",
              padding: "14px 32px",
              borderRadius: 100,
              fontSize: 15,
              fontWeight: 500,
              letterSpacing: "-0.01em",
            }}
          >
            Start free
          </Link>
          <Link
            to="/matches"
            style={{
              display: "inline-block",
              border: "0.5px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.7)",
              textDecoration: "none",
              padding: "14px 32px",
              borderRadius: 100,
              fontSize: 15,
            }}
          >
            Browse matches
          </Link>
        </div>
      </section>

      <SiteFooter />

      <style>{`
        @keyframes bob {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(6px); }
        }
      `}</style>
    </div>
  );
}

// ── Match card ────────────────────────────────────────────────────────────────
function MatchCard({
  home, away, sport, homeP, drawP, awayP, conf, verdict, live, accent, last,
}: {
  home: string; away: string; sport: string; homeP: number; drawP: number;
  awayP: number; conf: number; verdict: string; live: boolean; accent: string; last: boolean;
}) {
  return (
    <div
      style={{
        padding: "28px",
        borderRight: last ? "none" : "0.5px solid rgba(255,255,255,0.06)",
        transition: "background 0.2s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, alignItems: "center" }}>
        <span style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>
          {sport}
        </span>
        {live && (
          <span style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: accent, display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: accent, display: "inline-block", animation: "pulse 1.4s infinite" }} />
            Live
          </span>
        )}
      </div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 17, fontWeight: 500, letterSpacing: "-0.015em", marginBottom: 3 }}>{home}</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginBottom: 3 }}>vs</div>
        <div style={{ fontSize: 17, fontWeight: 500, letterSpacing: "-0.015em" }}>{away}</div>
      </div>
      <div style={{ height: 2, display: "flex", borderRadius: 2, overflow: "hidden", background: "rgba(255,255,255,0.06)", marginBottom: 8 }}>
        <div style={{ width: `${homeP}%`, background: accent }} />
        {drawP > 0 && <div style={{ width: `${drawP}%`, background: "rgba(255,255,255,0.15)" }} />}
        <div style={{ width: `${awayP}%`, background: "rgba(255,255,255,0.06)" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 16 }}>
        <span style={{ color: accent }}>{homeP}%</span>
        {drawP > 0 && <span>{drawP}%</span>}
        <span>{awayP}%</span>
      </div>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", borderTop: "0.5px solid rgba(255,255,255,0.05)", paddingTop: 14 }}>
        <span style={{ color: "#fff" }}>{verdict}</span>
        <span style={{ color: accent, marginLeft: 8 }}>{conf}% confidence</span>
      </div>
    </div>
  );
}

