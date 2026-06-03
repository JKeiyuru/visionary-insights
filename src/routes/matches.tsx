/**
 * /matches — Redesigned Matches Page
 *
 * PLACEHOLDERS:
 * ─────────────────────────────────────────────────────────────────────
 * [VIDEO-BG]  Optional: a looping ambient stadium video behind the hero.
 *             Source: pexels.com → "football stadium aerial night"
 *             Free commercial use. Download 1080p MP4.
 *             Save to: /public/videos/matches-bg.mp4
 *             Uncomment the <video> block in the MatchesHero component.
 *
 * [SPLINE-CARD] Each sport filter button can have a tiny inline Spline
 *              scene (a floating ball) when you have assets ready.
 *              Not required — the current design works great without it.
 * ─────────────────────────────────────────────────────────────────────
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FloatingNav } from "@/components/FloatingNav";
import { SiteFooter } from "@/components/SiteFooter";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useViewport } from "@/hooks/use-viewport";
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
  status: string;
  predictions?: Array<{
    home_win_prob: number;
    draw_prob: number;
    away_win_prob: number;
    predicted_outcome: string;
    confidence: number;
    reasoning: string | null;
    premium: boolean;
  }>;
};

const SPORT_FILTERS = [
  { key: "all", label: "All", accent: "rgba(255,255,255,0.7)" },
  { key: "soccer", label: "Soccer", accent: "#34d399" },
  { key: "basketball", label: "Basketball", accent: "#fb923c" },
  { key: "formula1", label: "Formula 1", accent: "#f87171" },
  { key: "baseball", label: "Baseball", accent: "#60a5fa" },
  { key: "tennis", label: "Tennis", accent: "#a3e635" },
  { key: "cricket", label: "Cricket", accent: "#fbbf24" },
];

const SPORT_ACCENT: Record<string, string> = {
  soccer: "#34d399",
  basketball: "#fb923c",
  formula1: "#f87171",
  baseball: "#60a5fa",
  tennis: "#a3e635",
  cricket: "#fbbf24",
  boxing: "#e879f9",
  "american-football": "#818cf8",
};

function MatchesPage() {
  const { user } = useAuth();
  const { isMobile, isHandheld, isWide } = useViewport();
  const pad = isMobile ? "20px" : isHandheld ? "32px" : "64px";
  const maxW = isWide ? 1400 : 1100;
  const [matches, setMatches] = useState<Match[]>([]);
  const [filter, setFilter] = useState("all");
  const [plan, setPlan] = useState("free");
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    supabase
      .from("matches")
      .select("*, predictions(*)")
      .order("kickoff_at", { ascending: true })
      .then(({ data }) => {
        setMatches((data as Match[]) ?? []);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("subscription_plan")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => setPlan(data?.subscription_plan ?? "free"));
  }, [user]);

  const filtered = filter === "all" ? matches : matches.filter((m) => m.sport === filter);

  return (
    <div style={{ background: "#06060a", color: "#fff", minHeight: "100vh", fontFamily: '"Inter", sans-serif' }}>
      <FloatingNav />

      {/* ── PAGE HEADER ───────────────────────────────────────────────── */}
      <div style={{ maxWidth: maxW, margin: "0 auto", padding: `${isMobile ? 80 : 100}px ${pad} ${isMobile ? 32 : 56}px` }}>
        <p style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 14 }}>
          Live intelligence
        </p>
        <h1
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: "clamp(36px, 4.5vw, 64px)",
            fontWeight: 300,
            letterSpacing: "-0.03em",
            marginBottom: 16,
          }}
        >
          All matches.
        </h1>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.4)", maxWidth: 480 }}>
          AI forecasts across every sport, updated every 30 seconds. Click any match to see the full reasoning chain.
        </p>
      </div>

      {/* ── SPORT FILTERS ─────────────────────────────────────────────── */}
      <div
        style={{
          borderTop: "0.5px solid rgba(255,255,255,0.06)",
          borderBottom: "0.5px solid rgba(255,255,255,0.06)",
          position: "sticky",
          top: 52,
          zIndex: 50,
          background: "rgba(6,6,10,0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 64px", display: "flex", gap: 0, overflowX: "auto" }}>
          {SPORT_FILTERS.map((sf) => (
            <button
              key={sf.key}
              onClick={() => setFilter(sf.key)}
              style={{
                background: "none",
                border: "none",
                padding: "16px 18px",
                fontSize: 13,
                color: filter === sf.key ? sf.accent : "rgba(255,255,255,0.35)",
                cursor: "pointer",
                borderBottom: filter === sf.key ? `1.5px solid ${sf.accent}` : "1.5px solid transparent",
                whiteSpace: "nowrap",
                transition: "color 0.2s, border-color 0.2s",
                letterSpacing: "-0.01em",
              }}
            >
              {sf.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── MATCH GRID ────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 64px 80px" }}>
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1 }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{ padding: 28, border: "0.5px solid rgba(255,255,255,0.06)", borderRadius: 12, height: 200, background: "rgba(255,255,255,0.01)" }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(255,255,255,0.25)", fontSize: 15 }}>
            No matches for this filter yet.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1 }}>
            {filtered.map((m) => (
              <MatchDetailCard key={m.id} match={m} plan={plan} />
            ))}
          </div>
        )}
      </div>

      <SiteFooter />
    </div>
  );
}

function MatchDetailCard({ match: m, plan }: { match: Match; plan: string }) {
  const [expanded, setExpanded] = useState(false);
  const p = m.predictions?.[0];
  const accent = SPORT_ACCENT[m.sport] ?? "rgba(255,255,255,0.4)";
  const isLive = m.status === "live";

  return (
    <div
      style={{
        border: "0.5px solid rgba(255,255,255,0.06)",
        borderRadius: 12,
        padding: 28,
        cursor: "pointer",
        transition: "background 0.2s ease",
        background: expanded ? "rgba(255,255,255,0.025)" : "transparent",
      }}
      onMouseEnter={(e) => !expanded && (e.currentTarget.style.background = "rgba(255,255,255,0.015)")}
      onMouseLeave={(e) => !expanded && (e.currentTarget.style.background = "transparent")}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: accent }} />
          <span style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
            {m.sport}{m.league ? ` · ${m.league}` : ""}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {isLive && (
            <span style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: accent, display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: accent, display: "inline-block", animation: "live-pulse 1.4s infinite" }} />
              Live
            </span>
          )}
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>
            {new Date(m.kickoff_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      </div>

      {/* Teams */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
        <div style={{ flex: 1, textAlign: "left" }}>
          <div style={{ fontSize: 18, fontWeight: 500, letterSpacing: "-0.02em" }}>{m.home_team}</div>
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", flexShrink: 0 }}>vs</div>
        <div style={{ flex: 1, textAlign: "right" }}>
          <div style={{ fontSize: 18, fontWeight: 500, letterSpacing: "-0.02em" }}>{m.away_team}</div>
        </div>
      </div>

      {/* Probability bar */}
      {p ? (
        p.premium && !tierAllows(plan, "weekly") ? (
          <div style={{ marginTop: 8 }}>
            <TierGate current={plan} required="weekly" feature="Premium AI prediction">
              <div />
            </TierGate>
          </div>
        ) : (
          <>
            <div style={{ height: 2, display: "flex", borderRadius: 2, overflow: "hidden", background: "rgba(255,255,255,0.06)", marginBottom: 8 }}>
              <div style={{ width: `${p.home_win_prob}%`, background: accent, transition: "width 0.8s ease" }} />
              {p.draw_prob > 0 && <div style={{ width: `${p.draw_prob}%`, background: "rgba(255,255,255,0.15)" }} />}
              <div style={{ width: `${p.away_win_prob}%`, background: "rgba(255,255,255,0.07)" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 14 }}>
              <span style={{ color: accent }}>{p.home_win_prob}%</span>
              {p.draw_prob > 0 && <span>Draw {p.draw_prob}%</span>}
              <span>{p.away_win_prob}%</span>
            </div>

            {/* Verdict chip */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>
                <span style={{ color: "#fff", fontWeight: 500 }}>
                  {p.predicted_outcome === "home" ? m.home_team : p.predicted_outcome === "away" ? m.away_team : "Draw"}
                </span>
                {" "}to {p.predicted_outcome === "draw" ? "end level" : "win"}
              </div>
              <div style={{ fontSize: 12, color: accent }}>{p.confidence}% conf.</div>
            </div>

            {/* Expanded reasoning */}
            {expanded && p.reasoning && (
              <div
                style={{
                  marginTop: 18,
                  paddingTop: 18,
                  borderTop: "0.5px solid rgba(255,255,255,0.07)",
                  fontSize: 13,
                  color: "rgba(255,255,255,0.45)",
                  lineHeight: 1.65,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {p.reasoning}
              </div>
            )}
          </>
        )
      ) : (
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", fontStyle: "italic" }}>
          Prediction generating…
        </div>
      )}

      {/* Expand toggle */}
      {p && !p.premium && (
        <div style={{ marginTop: 14, fontSize: 11, color: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", gap: 4 }}>
          {expanded ? "↑ Hide reasoning" : "↓ Show AI reasoning"}
        </div>
      )}

      <style>{`
        @keyframes live-pulse {
          0%, 100% { opacity:1; transform:scale(1); }
          50% { opacity:0.4; transform:scale(0.75); }
        }
      `}</style>
    </div>
  );
}
