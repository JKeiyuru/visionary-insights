/**
 * /dashboard — Redesigned User Dashboard
 *
 * PLACEHOLDERS:
 * ─────────────────────────────────────────────────────────────────────
 * [SPLINE-PERSONAL] A small 3D scene matching the user's top sport.
 *   When you have your Spline scenes ready, swap the gradient hero
 *   background with:
 *     import Spline from "@splinetool/react-spline";
 *     <Spline scene="https://prod.spline.design/YOUR-ID/scene.splinecode"
 *       style={{ position:"absolute", inset:0, width:"100%", height:"100%" }} />
 *
 * [VIDEO-AMBIENT] Optional 6-8s looping stadium video behind the hero.
 *   Source: pexels.com → "stadium night aerial"
 *   Save to: /public/videos/dashboard-ambient.mp4
 * ─────────────────────────────────────────────────────────────────────
 */

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FloatingNav } from "@/components/FloatingNav";
import { SiteFooter } from "@/components/SiteFooter";
import { PhoneOnboarding } from "@/components/PhoneOnboarding";
import { TierGate } from "@/components/TierGate";
import { useAuth } from "@/hooks/use-auth";
import { useViewport } from "@/hooks/use-viewport";
import { supabase } from "@/integrations/supabase/client";


export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — VisionPlay" }] }),
  component: DashboardPage,
});

type Match = {
  id: string; sport: string; league: string | null;
  home_team: string; away_team: string; kickoff_at: string;
};
type Profile = {
  display_name: string | null; tier: string; accuracy: number;
  forecasts_count: number; correct_count: number; subscription_plan: string;
};

const TIER_COLORS: Record<string, string> = {
  bronze: "#b45309", silver: "#94a3b8", gold: "#eab308", oracle: "#a78bfa",
};
const SPORT_ACCENT: Record<string, string> = {
  soccer: "#34d399", basketball: "#fb923c", formula1: "#f87171",
  baseball: "#60a5fa", tennis: "#a3e635", cricket: "#fbbf24",
};

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
    supabase.from("matches").select("*").order("kickoff_at", { ascending: true }).limit(6)
      .then(({ data }) => setMatches(data ?? []));
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()
      .then(({ data }) => setProfile(data as Profile | null));
  }, [user]);

  if (loading || !user) {
    return (
      <div style={{ background: "#06060a", minHeight: "100vh", display: "grid", placeItems: "center", color: "rgba(255,255,255,0.3)", fontSize: 14 }}>
        Loading…
      </div>
    );
  }

  const plan = profile?.subscription_plan ?? "free";
  const tierColor = TIER_COLORS[profile?.tier ?? "bronze"] ?? "#b45309";

  return (
    <div style={{ background: "#06060a", color: "#fff", minHeight: "100vh", fontFamily: '"Inter", sans-serif' }}>
      <PhoneOnboarding />
      <FloatingNav />

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          height: 400,
          overflow: "hidden",
          marginBottom: 0,
        }}
      >
        <video
          src="/videos/dashboard-ambient.mp4"
          autoPlay
          muted
          loop
          playsInline
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />


        {/* Overlays */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(6,6,10,0.2) 0%, rgba(6,6,10,0.85) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(6,6,10,0.8) 0%, transparent 60%)" }} />

        {/* Welcome text */}
        <div style={{ position: "absolute", bottom: 40, left: 0, padding: "0 64px" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: tierColor, marginBottom: 12 }}>
            {profile?.tier ?? "bronze"} tier
          </div>
          <h1
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: "clamp(28px, 3.5vw, 48px)",
              fontWeight: 300,
              letterSpacing: "-0.03em",
              marginBottom: 8,
            }}
          >
            {profile?.display_name ? `Welcome back, ${profile.display_name}.` : "Welcome back."}
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)" }}>
            Your AI sports intelligence is live.
          </p>
        </div>
      </div>

      {/* ── STATS ROW ─────────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "40px 64px 0",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 1,
          borderTop: "0.5px solid rgba(255,255,255,0.06)",
          borderBottom: "0.5px solid rgba(255,255,255,0.06)",
        }}
      >
        {[
          { label: "Tier", value: profile?.tier ?? "Bronze", color: tierColor },
          { label: "Accuracy", value: `${profile?.accuracy ?? 0}%`, color: "#60a5fa" },
          { label: "Total forecasts", value: String(profile?.forecasts_count ?? 0), color: "#34d399" },
          { label: "Active plan", value: plan, color: "#a78bfa" },
        ].map((s, i) => (
          <div
            key={s.label}
            style={{
              padding: "28px 24px",
              borderRight: i < 3 ? "0.5px solid rgba(255,255,255,0.06)" : "none",
            }}
          >
            <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 10 }}>
              {s.label}
            </div>
            <div
              style={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: 28,
                fontWeight: 400,
                letterSpacing: "-0.03em",
                color: s.color,
                textTransform: "capitalize",
              }}
            >
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* ── UPCOMING MATCHES ──────────────────────────────────────────── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 64px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
          <h2 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: "clamp(20px, 2.5vw, 32px)", fontWeight: 300, letterSpacing: "-0.025em" }}>
            Upcoming matches
          </h2>
          <Link to="/matches" style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>
            All matches →
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1 }}>
          {matches.slice(0, 6).map((m) => {
            const accent = SPORT_ACCENT[m.sport] ?? "rgba(255,255,255,0.3)";
            return (
              <div
                key={m.id}
                style={{
                  padding: "24px",
                  border: "0.5px solid rgba(255,255,255,0.06)",
                  borderRadius: 10,
                  transition: "background 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: accent }} />
                  <span style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>
                    {m.sport}
                  </span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 500, letterSpacing: "-0.015em", marginBottom: 3 }}>{m.home_team}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginBottom: 3 }}>vs</div>
                <div style={{ fontSize: 15, fontWeight: 500, letterSpacing: "-0.015em", marginBottom: 14 }}>{m.away_team}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
                  {new Date(m.kickoff_at).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── PREMIUM SECTION ───────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 64px 80px",
          borderTop: "0.5px solid rgba(255,255,255,0.06)",
          paddingTop: 56,
        }}
      >
        <h2 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: "clamp(18px, 2.2vw, 28px)", fontWeight: 300, letterSpacing: "-0.025em", marginBottom: 24 }}>
          Live momentum
        </h2>
        <TierGate current={plan} required="monthly" feature="Real-time win-probability shifts">
          <div style={{ padding: "32px 28px", border: "0.5px solid rgba(255,255,255,0.06)", borderRadius: 12, color: "rgba(255,255,255,0.35)", fontSize: 14 }}>
            Your live momentum charts will appear here once a match goes live.
          </div>
        </TierGate>
      </div>

      {/* ── QUICK LINKS ───────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 64px 100px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 1,
        }}
      >
        {[
          { to: "/pricing", label: "Upgrade your plan", desc: "Unlock premium leagues, live momentum and revenue share.", cta: "See plans →" },
          { to: "/leaderboard", label: "Leaderboard", desc: "See where the world's sharpest forecasters rank right now.", cta: "View rankings →" },
        ].map((q) => (
          <div key={q.to} style={{ padding: "28px 0", paddingRight: 48 }}>
            <h3 style={{ fontSize: 17, fontWeight: 500, letterSpacing: "-0.01em", marginBottom: 8 }}>{q.label}</h3>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.55, marginBottom: 18 }}>{q.desc}</p>
            <Link to={q.to} style={{ fontSize: 13, color: "#fff", textDecoration: "none", borderBottom: "0.5px solid rgba(255,255,255,0.25)", paddingBottom: 2 }}>
              {q.cta}
            </Link>
          </div>
        ))}
      </div>

      <SiteFooter />
    </div>
  );
}
