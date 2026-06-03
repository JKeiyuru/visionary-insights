import { Link } from "@tanstack/react-router";
import { useViewport } from "@/hooks/use-viewport";

export function SiteFooter() {
  const { isMobile, isHandheld } = useViewport();
  const pad = isMobile ? "20px" : isHandheld ? "32px" : "64px";

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
          padding: `${isHandheld ? 48 : 64}px ${pad} ${isHandheld ? 32 : 48}px`,
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : isHandheld ? "1fr 1fr" : "2fr 1fr 1fr 1fr",
          gap: isMobile ? 32 : isHandheld ? 36 : 48,
        }}
      >
        {/* Brand */}
        <div style={isHandheld && !isMobile ? { gridColumn: "1 / -1" } : undefined}>
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
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.65, maxWidth: 320, marginBottom: 20 }}>
            AI-powered sports intelligence. Explainable forecasts across soccer, basketball, F1, baseball, tennis and cricket.
          </p>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", lineHeight: 1.6 }}>
            VisionPlay is an analytics &amp; entertainment platform. We are not a betting operator and do not accept wagers.
          </p>
        </div>

        {/* Platform */}
        <FooterCol title="Platform">
          {[
            { to: "/matches", label: "Matches" },
            { to: "/sports", label: "Sports" },
            { to: "/leaderboard", label: "Leaderboard" },
            { to: "/pricing", label: "Pricing" },
            { to: "/dashboard", label: "Dashboard" },
          ].map((l) => (
            <FooterLink key={l.to} to={l.to} label={l.label} />
          ))}
        </FooterCol>

        {/* Sports */}
        <FooterCol title="Sports">
          {["Soccer", "Formula 1", "Basketball", "Tennis", "Baseball", "Cricket"].map((s) => (
            <FooterLink key={s} to={`/sports/${s.toLowerCase().replace(" ", "-")}`} label={s} />
          ))}
        </FooterCol>

        {/* Legal */}
        <FooterCol title="Legal">
          <FooterLink to="/terms" label="Terms & Conditions" />
          <FooterLink to="/privacy" label="Privacy Policy" />
          <a
            href="mailto:hello@visionplay.app"
            style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
          >
            Contact
          </a>
        </FooterCol>
      </div>

      <div
        style={{
          borderTop: "0.5px solid rgba(255,255,255,0.06)",
          maxWidth: 1100,
          margin: "0 auto",
          padding: `20px ${pad}`,
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

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
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
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{children}</div>
    </div>
  );
}

function FooterLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none", transition: "color 0.2s" }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
    >
      {label}
    </Link>
  );
}
