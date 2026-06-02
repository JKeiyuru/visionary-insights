import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";

const NAV_LINKS = [
  { to: "/matches", label: "Matches" },
  { to: "/sports", label: "Sports" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/pricing", label: "Pricing" },
];

export function FloatingNav() {
  const { user, signOut } = useAuth();
  const [hidden, setHidden] = useState(false);
  const [lastY, setLastY] = useState(0);
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      setAtTop(y < 40);
      setHidden(y > lastY && y > 120);
      setLastY(y);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastY]);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transform: hidden ? "translateY(-100%)" : "translateY(0)",
        transition: "transform 0.4s cubic-bezier(0.25,0.1,0.25,1)",
        WebkitBackdropFilter: atTop ? "blur(0px)" : "blur(20px)",
        backdropFilter: atTop ? "blur(0px)" : "blur(20px)",
        backgroundColor: atTop ? "transparent" : "rgba(6,6,10,0.72)",
        borderBottom: atTop ? "none" : "0.5px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          height: 52,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 32,
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: 17,
            fontWeight: 500,
            color: "#fff",
            textDecoration: "none",
            letterSpacing: "-0.02em",
            flexShrink: 0,
          }}
        >
          Vision<span style={{ color: "rgba(255,255,255,0.4)" }}>Play</span>
        </Link>

        {/* Center links */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            flex: 1,
            justifyContent: "center",
          }}
        >
          {NAV_LINKS.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.65)",
                textDecoration: "none",
                padding: "6px 12px",
                borderRadius: 8,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.65)")}
            >
              {n.label}
            </Link>
          ))}
        </div>

        {/* Right CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {user ? (
            <>
              <Link
                to="/dashboard"
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.65)",
                  textDecoration: "none",
                  padding: "6px 12px",
                }}
              >
                Dashboard
              </Link>
              <button
                onClick={() => signOut()}
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.45)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "6px 12px",
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.65)",
                  textDecoration: "none",
                  padding: "6px 12px",
                }}
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                style={{
                  fontSize: 13,
                  color: "#000",
                  background: "#fff",
                  textDecoration: "none",
                  padding: "7px 16px",
                  borderRadius: 100,
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
