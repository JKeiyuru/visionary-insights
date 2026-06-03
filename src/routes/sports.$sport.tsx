/**
 * /sports/$sport — Individual sport cinematic scroll page
 *
 * PLACEHOLDERS:
 * ─────────────────────────────────────────────────────────────────────
 * [SPLINE-SCENE] This is THE page that needs a Spline scene most.
 *   The entire sticky hero background should be your 3D sport scene.
 *
 *   Steps:
 *   1. Go to spline.design → Community → search your sport
 *   2. Fork a scene you like, customise colours to match s.primary/s.accent
 *   3. File → Publish to Web → copy the scene URL
 *   4. npm install @splinetool/react-spline
 *   5. Replace the <SplinePlaceholder> component below with:
 *        import Spline from "@splinetool/react-spline";
 *        <Spline scene="https://prod.spline.design/YOUR-ID/scene.splinecode"
 *          style={{ position:"absolute", inset:0, width:"100%", height:"100%" }} />
 *
 * [VIDEO-SPORT] Alternative: a looping sport background video.
 *   Pexels.com search terms per sport:
 *     soccer     → "football stadium match aerial"
 *     formula1   → "formula 1 racing track circuit"
 *     basketball → "basketball arena court nba"
 *     tennis     → "tennis court match overhead"
 *     baseball   → "baseball stadium night game"
 *     cricket    → "cricket stadium match day"
 *   Download 1080p MP4 → /public/videos/{sport}.mp4
 *   Replace <SplinePlaceholder> with:
 *     <video src={`/videos/${sport.slug}.mp4`} autoPlay muted loop playsInline
 *       style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} />
 * ─────────────────────────────────────────────────────────────────────
 */

import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FloatingNav } from "@/components/FloatingNav";
import { SiteFooter } from "@/components/SiteFooter";
import { SPORTS, type SportSlug } from "@/components/scenes/sportConfig";

gsap.registerPlugin(ScrollTrigger);

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
    <div style={{ background: "#06060a", minHeight: "100vh", display: "grid", placeItems: "center", color: "#fff" }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 32, fontWeight: 300 }}>Sport not found</h1>
        <Link to="/sports" style={{ marginTop: 16, display: "inline-block", color: "rgba(255,255,255,0.4)", fontSize: 14, textDecoration: "none" }}>
          ← Back to sports
        </Link>
      </div>
    </div>
  ),
});

function SportPage() {
  const { sport: s } = Route.useLoaderData();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalHeight = containerRef.current.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, -rect.top / totalHeight));
      setScrollProgress(progress);
      const idx = Math.min(s.chapters.length - 1, Math.floor(progress * s.chapters.length));
      setActiveChapter(idx);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [s.chapters.length]);

  const chapter = s.chapters[activeChapter];

  return (
    <div style={{ background: "#06060a", color: "#fff", fontFamily: '"Inter", sans-serif' }}>
      <FloatingNav />

      {/* ── SCROLL STORY SECTION ──────────────────────────────────────── */}
      <div
        ref={containerRef}
        style={{ height: `${s.chapters.length * 100}vh`, position: "relative" }}
      >
        {/* Sticky scene */}
        <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>

          {/* ── BACKGROUND — swap with Spline or video ──────────────── */}
          {/*
            [SPLINE-SCENE] Replace this SplinePlaceholder with your real scene.
            See instructions at the top of this file.
          */}
          <video
            src={`/videos/${s.slug}.mp4`}
            autoPlay
            muted
            loop
            playsInline
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />


          {/* Cinematic overlays */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(6,6,10,0.1) 0%, rgba(6,6,10,0.45) 55%, rgba(6,6,10,0.95) 100%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(6,6,10,0.82) 0%, rgba(6,6,10,0.2) 50%, transparent 100%)", pointerEvents: "none" }} />

          {/* ── CHAPTER TEXT ─────────────────────────────────────────── */}
          <div
            style={{
              position: "absolute",
              bottom: 100,
              left: 0,
              padding: "0 64px",
              maxWidth: 680,
              pointerEvents: "none",
            }}
          >
            {/* Chapter label */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.accent }} />
              <span style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: s.accent }}>
                Chapter {activeChapter + 1} / {s.chapters.length}
              </span>
            </div>

            {/* Headline */}
            <h1
              key={activeChapter}
              style={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: "clamp(36px, 5.5vw, 72px)",
                fontWeight: 300,
                letterSpacing: "-0.035em",
                lineHeight: 1.05,
                color: "#fff",
                marginBottom: 20,
                animation: "fadeUp 0.5s cubic-bezier(0.25,0.1,0.25,1)",
              }}
            >
              {chapter.title}
            </h1>

            {/* Body */}
            <p
              key={`b-${activeChapter}`}
              style={{
                fontSize: 17,
                lineHeight: 1.65,
                color: "rgba(255,255,255,0.52)",
                maxWidth: 480,
                marginBottom: 28,
                animation: "fadeUp 0.5s 0.08s cubic-bezier(0.25,0.1,0.25,1) both",
              }}
            >
              {chapter.body}
            </p>

            {/* Metric */}
            {chapter.metric && (
              <div
                key={`m-${activeChapter}`}
                style={{
                  display: "inline-flex",
                  alignItems: "baseline",
                  gap: 12,
                  paddingTop: 18,
                  borderTop: "0.5px solid rgba(255,255,255,0.1)",
                  animation: "fadeUp 0.5s 0.15s cubic-bezier(0.25,0.1,0.25,1) both",
                }}
              >
                <span
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: 36,
                    fontWeight: 500,
                    letterSpacing: "-0.04em",
                    color: s.accent,
                  }}
                >
                  {chapter.metric.value}
                </span>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", letterSpacing: "0.04em" }}>
                  {chapter.metric.label}
                </span>
              </div>
            )}
          </div>

          {/* ── RIGHT CHAPTER RAIL ───────────────────────────────────── */}
          <div
            style={{
              position: "absolute",
              right: 36,
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              flexDirection: "column",
              gap: 14,
              pointerEvents: "none",
            }}
          >
            {s.chapters.map((c: typeof s.chapters[number], i: number) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: 8,
                  opacity: i === activeChapter ? 1 : 0.22,
                  transition: "opacity 0.4s ease",
                }}
              >
                <span style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: i === activeChapter ? "#fff" : "rgba(255,255,255,0.4)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div
                  style={{
                    height: 1,
                    width: i === activeChapter ? 28 : 10,
                    background: i === activeChapter ? s.accent : "rgba(255,255,255,0.2)",
                    transition: "all 0.4s ease",
                  }}
                />
              </div>
            ))}
          </div>

          {/* ── PROGRESS BAR ─────────────────────────────────────────── */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: "rgba(255,255,255,0.06)", pointerEvents: "none" }}>
            <div
              style={{
                height: "100%",
                width: `${scrollProgress * 100}%`,
                background: s.accent,
                transition: "width 0.1s linear",
              }}
            />
          </div>

          {/* First chapter scroll nudge */}
          {activeChapter === 0 && scrollProgress < 0.04 && (
            <div
              style={{
                position: "absolute",
                bottom: 28,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 5,
                pointerEvents: "none",
                animation: "bob 2s ease-in-out infinite",
              }}
            >
              <span style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>Scroll</span>
              <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
                <path d="M7 0v14M1 8l6 6 6-6" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* ── OUTRO CTA ─────────────────────────────────────────────────── */}
      <div
        style={{
          textAlign: "center",
          padding: "120px 64px",
          borderTop: "0.5px solid rgba(255,255,255,0.06)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 500,
            height: 300,
            borderRadius: "50%",
            background: `radial-gradient(ellipse, ${s.accent}0d 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 20 }}>
          <Link to="/sports" style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>
            ← All sports
          </Link>
        </div>
        <h2
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: "clamp(32px, 4vw, 56px)",
            fontWeight: 300,
            letterSpacing: "-0.035em",
            marginBottom: 16,
          }}
        >
          Ready for the{" "}
          <span style={{ color: s.accent }}>{s.name}</span>
          {" "}forecast?
        </h2>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.4)", maxWidth: 420, margin: "0 auto 40px" }}>
          Live matches, AI reasoning, and win-probability updates every 30 seconds.
        </p>
        <Link
          to="/matches"
          style={{
            display: "inline-block",
            padding: "14px 32px",
            borderRadius: 100,
            fontSize: 15,
            fontWeight: 500,
            color: "#000",
            background: s.accent,
            textDecoration: "none",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          See {s.name} matches →
        </Link>
      </div>

      <SiteFooter />

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes bob {
          0%,100% { transform: translateX(-50%) translateY(0); }
          50%      { transform: translateX(-50%) translateY(6px); }
        }
      `}</style>
    </div>
  );
}

/** Gradient placeholder — swap with Spline or video */
function SplinePlaceholder({ sport: s }: { sport: (typeof SPORTS)[SportSlug] }) {
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 70% 90% at 65% 40%, ${s.primary}30 0%, #06060a 65%), radial-gradient(ellipse 50% 60% at 30% 70%, ${s.accent}15 0%, transparent 55%)`,
        }}
      />
      {/* Instruction card */}
      <div
        style={{
          position: "absolute",
          top: 80,
          right: 52,
          background: "rgba(0,0,0,0.5)",
          border: `0.5px solid ${s.accent}30`,
          borderRadius: 10,
          padding: "12px 16px",
          backdropFilter: "blur(8px)",
          maxWidth: 260,
        }}
      >
        <div style={{ fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: s.accent, marginBottom: 6 }}>
          [SPLINE-SCENE] 3D placeholder
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
          Search{" "}
          <a href="https://spline.design" target="_blank" rel="noreferrer" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "underline" }}>
            spline.design
          </a>{" "}
          for <span style={{ color: "rgba(255,255,255,0.7)" }}>"{s.name.toLowerCase()} 3d"</span>
          <br />Fork → publish → replace this component.
          <br /><br />
          Or use a video from pexels.com: search <span style={{ color: "rgba(255,255,255,0.7)" }}>"{s.name.toLowerCase()} stadium"</span>
        </div>
      </div>
    </div>
  );
}
