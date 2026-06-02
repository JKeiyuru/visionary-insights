import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer
      style={{
        borderTop: "0.5px solid rgba(255,255,255,0.07)",
        background: "#06060a",
        color: "#fff",
        fontFamily: '"Inter", ui-sans-serif, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "64px 64px 48px",
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: 48,
        }}
      >
        {/* Brand */}
        <div>
          <div
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: 18,
              fontWeight: 500,
              letterSpacing: "-0.02em",
              marginBottom: 14,
            }}
          >
            Vision<span style={{ color: "rgba(255,255,255,0.3)" }}>Play</span>
          </div>
          <p
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.35)",
              lineHeight: 1.65,
              maxWidth: 280,
              marginBottom: 20,
            }}
          >
            AI-powered sports intelligence. Explainable forecasts across soccer,
            basketball, F1, baseball, tennis and cricket.
          </p>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", lineHeight: 1.6 }}>
            VisionPlay is an analytics &amp; entertainment platform.
            We are not a betting operator and do not accept wagers.
          </p>
        </div>

        {/* Platform */}
        <div>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.25)",
              marginBottom: 16,
            }}
          >
            Platform
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { to: "/matches", label: "Matches" },
              { to: "/sports", label: "Sports" },
              { to: "/leaderboard", label: "Leaderboard" },
              { to: "/pricing", label: "Pricing" },
              { to: "/dashboard", label: "Dashboard" },
            ].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.4)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Sports */}
        <div>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.25)",
              marginBottom: 16,
            }}
          >
            Sports
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {["Soccer", "Formula 1", "Basketball", "Tennis", "Baseball", "Cricket"].map((s) => (
              <Link
                key={s}
                to={`/sports/${s.toLowerCase().replace(" ", "-")}`}
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.4)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
              >
                {s}
              </Link>
            ))}
          </div>
        </div>

        {/* Legal */}
        <div>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.25)",
              marginBottom: 16,
            }}
          >
            Legal
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { to: "/terms", label: "Terms & Conditions" },
              { to: "/privacy", label: "Privacy Policy" },
            ].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.4)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
              >
                {l.label}
              </Link>
            ))}
            <a
              href="mailto:hello@visionplay.app"
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.4)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
            >
              Contact
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: "0.5px solid rgba(255,255,255,0.06)",
          maxWidth: 1100,
          margin: "0 auto",
          padding: "20px 64px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>
          © {new Date().getFullYear()} VisionPlay. All rights reserved. 18+ only.
        </span>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.15)" }}>
          Not a betting operator · Analytics only
        </span>
      </div>
    </footer>
  );
}
