import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FloatingNav } from "@/components/FloatingNav";
import { SiteFooter } from "@/components/SiteFooter";
import { supabase } from "@/integrations/supabase/client";
import { useViewport } from "@/hooks/use-viewport";


export const Route = createFileRoute("/leaderboard")({
  head: () => ({ meta: [{ title: "Leaderboard — VisionPlay" }] }),
  component: LeaderboardPage,
});

type Row = {
  id: string;
  display_name: string | null;
  tier: string;
  accuracy: number;
  forecasts_count: number;
};

const TIER_COLOR: Record<string, string> = {
  oracle: "#a78bfa",
  gold: "#eab308",
  silver: "#94a3b8",
  bronze: "#b45309",
};

function LeaderboardPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const { isMobile, isHandheld, isWide } = useViewport();
  const pad = isMobile ? "20px" : isHandheld ? "32px" : "64px";
  const maxW = isWide ? 1400 : 1100;
  const gridCols = isMobile ? "32px 1fr 60px 60px" : "48px 1fr 120px 100px 80px";

  useEffect(() => {
    supabase
      .from("profiles")
      .select("id, display_name, tier, accuracy, forecasts_count")
      .order("accuracy", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        setRows((data as Row[]) ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div
      style={{
        background: "#06060a",
        color: "#fff",
        minHeight: "100vh",
        fontFamily: '"Inter", sans-serif',
      }}
    >
      <FloatingNav />

      {/* Header */}
      <div
        style={{ maxWidth: maxW, margin: "0 auto", padding: `${isMobile ? 80 : 100}px ${pad} ${isMobile ? 32 : 56}px` }}
      >
        <p
          style={{
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)",
            marginBottom: 14,
          }}
        >
          Community
        </p>
        <h1
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: "clamp(34px, 4.5vw, 64px)",
            fontWeight: 300,
            letterSpacing: "-0.035em",
            marginBottom: 14,
          }}
        >
          Leaderboard.
        </h1>
        <p
          style={{
            fontSize: isMobile ? 14 : 16,
            color: "rgba(255,255,255,0.4)",
            maxWidth: 420,
          }}
        >
          The sharpest forecasters on VisionPlay, ranked by accuracy over
          their full record.
        </p>
      </div>

      {/* Table */}
      <div
        style={{
          maxWidth: maxW,
          margin: "0 auto",
          padding: `0 ${pad} ${isMobile ? 64 : 100}px`,
        }}
      >
        {/* Column headers */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: gridCols,
            gap: isMobile ? 10 : 16,
            padding: "10px 0",
            borderBottom: "0.5px solid rgba(255,255,255,0.07)",
            fontSize: 10,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.25)",
          }}
        >
          <div>#</div>
          <div>Analyst</div>
          {!isMobile && <div>Tier</div>}
          <div style={{ textAlign: "right" }}>{isMobile ? "Acc" : "Accuracy"}</div>
          <div style={{ textAlign: "right" }}>{isMobile ? "Picks" : "Forecasts"}</div>
        </div>


        {loading &&
          [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              style={{
                height: 52,
                borderBottom: "0.5px solid rgba(255,255,255,0.04)",
                background: `rgba(255,255,255,${0.005 + (8 - i) * 0.001})`,
              }}
            />
          ))}

        {!loading && rows.length === 0 && (
          <div
            style={{
              padding: "80px 0",
              textAlign: "center",
              fontSize: 14,
              color: "rgba(255,255,255,0.2)",
            }}
          >
            No forecasters yet — be the first.
          </div>
        )}

        {rows.map((r, i) => {
          const tierColor = TIER_COLOR[r.tier] ?? TIER_COLOR.bronze;
          const isTop3 = i < 3;
          return (
            <div
              key={r.id}
              style={{
                display: "grid",
                gridTemplateColumns: "48px 1fr 120px 100px 80px",
                gap: 16,
                padding: "16px 0",
                borderBottom: "0.5px solid rgba(255,255,255,0.04)",
                alignItems: "center",
                transition: "background 0.2s",
                borderRadius: 6,
                cursor: "default",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background =
                  "rgba(255,255,255,0.02)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              {/* Rank */}
              <div
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: isTop3 ? 18 : 14,
                  fontWeight: isTop3 ? 500 : 400,
                  color: isTop3 ? "#fff" : "rgba(255,255,255,0.25)",
                  letterSpacing: "-0.02em",
                }}
              >
                {i + 1}
              </div>

              {/* Name */}
              <div
                style={{
                  fontSize: 15,
                  fontWeight: isTop3 ? 500 : 400,
                  letterSpacing: "-0.01em",
                }}
              >
                {r.display_name ?? "Anonymous"}
              </div>

              {/* Tier */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                }}
              >
                <div
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: tierColor,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 12,
                    color: tierColor,
                    textTransform: "capitalize",
                  }}
                >
                  {r.tier}
                </span>
              </div>

              {/* Accuracy */}
              <div
                style={{
                  textAlign: "right",
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: 15,
                  fontWeight: 500,
                  letterSpacing: "-0.02em",
                  color: isTop3 ? "#34d399" : "rgba(255,255,255,0.7)",
                }}
              >
                {r.accuracy}%
              </div>

              {/* Count */}
              <div
                style={{
                  textAlign: "right",
                  fontSize: 13,
                  color: "rgba(255,255,255,0.25)",
                }}
              >
                {r.forecasts_count}
              </div>
            </div>
          );
        })}
      </div>

      <SiteFooter />
    </div>
  );
}
