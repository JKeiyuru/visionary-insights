import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useViewport } from "@/hooks/use-viewport";

const NAV_LINKS = [
  { to: "/matches", label: "Matches" },
  { to: "/sports", label: "Sports" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/pricing", label: "Pricing" },
];

export function FloatingNav() {
  const { user, signOut } = useAuth();
  const { isMobile, isHandheld } = useViewport();
  const [hidden, setHidden] = useState(false);
  const [lastY, setLastY] = useState(0);
  const [atTop, setAtTop] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

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

  // Close menu when resizing back to desktop
  useEffect(() => {
    if (!isHandheld) setMenuOpen(false);
  }, [isHandheld]);

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          transform: hidden ? "translateY(-100%)" : "translateY(0)",
          transition: "transform 0.4s cubic-bezier(0.25,0.1,0.25,1)",
          WebkitBackdropFilter: atTop && !menuOpen ? "blur(0px)" : "blur(20px)",
          backdropFilter: atTop && !menuOpen ? "blur(0px)" : "blur(20px)",
          backgroundColor: atTop && !menuOpen ? "transparent" : "rgba(6,6,10,0.72)",
          borderBottom: atTop && !menuOpen ? "none" : "0.5px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: isMobile ? "0 16px" : "0 24px",
            height: 52,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: isMobile ? 8 : 32,
          }}
        >
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

          {/* Center links — desktop only */}
          {!isHandheld && (
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
          )}

          {/* Right CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            {!isHandheld && user && (
              <>
                <Link to="/dashboard" style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", textDecoration: "none", padding: "6px 12px" }}>
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", background: "none", border: "none", cursor: "pointer", padding: "6px 12px" }}
                >
                  Sign out
                </button>
              </>
            )}
            {!isHandheld && !user && (
              <>
                <Link to="/login" style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", textDecoration: "none", padding: "6px 12px" }}>
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
                  }}
                >
                  Get started
                </Link>
              </>
            )}

            {isHandheld && (
              <button
                onClick={() => setMenuOpen((o) => !o)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                style={{
                  width: 40,
                  height: 36,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 5,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <span
                  style={{
                    width: 18,
                    height: 1,
                    background: "#fff",
                    transition: "transform 0.25s",
                    transform: menuOpen ? "rotate(45deg) translate(3px,3px)" : "none",
                  }}
                />
                <span
                  style={{
                    width: 18,
                    height: 1,
                    background: "#fff",
                    transition: "transform 0.25s",
                    transform: menuOpen ? "rotate(-45deg) translate(3px,-3px)" : "none",
                  }}
                />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile sheet */}
      {isHandheld && menuOpen && (
        <div
          style={{
            position: "fixed",
            top: 52,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 99,
            background: "rgba(6,6,10,0.96)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            padding: "24px 20px 40px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            animation: "fadeInMenu 0.25s ease-out",
          }}
          onClick={() => setMenuOpen(false)}
        >
          {NAV_LINKS.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              style={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: 24,
                color: "#fff",
                textDecoration: "none",
                padding: "16px 4px",
                borderBottom: "0.5px solid rgba(255,255,255,0.06)",
                letterSpacing: "-0.02em",
              }}
            >
              {n.label}
            </Link>
          ))}
          <div style={{ height: 24 }} />
          {user ? (
            <>
              <Link
                to="/dashboard"
                style={{
                  fontSize: 14,
                  color: "#fff",
                  background: "rgba(255,255,255,0.06)",
                  textAlign: "center",
                  padding: "14px 0",
                  borderRadius: 100,
                  textDecoration: "none",
                  marginBottom: 10,
                }}
              >
                Dashboard
              </Link>
              <button
                onClick={() => signOut()}
                style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", background: "none", border: "none", padding: "10px 0", cursor: "pointer" }}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signup"
                style={{
                  fontSize: 15,
                  color: "#000",
                  background: "#fff",
                  textAlign: "center",
                  padding: "14px 0",
                  borderRadius: 100,
                  fontWeight: 500,
                  textDecoration: "none",
                  marginBottom: 10,
                }}
              >
                Get started
              </Link>
              <Link
                to="/login"
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.8)",
                  textAlign: "center",
                  padding: "12px 0",
                  border: "0.5px solid rgba(255,255,255,0.15)",
                  borderRadius: 100,
                  textDecoration: "none",
                }}
              >
                Sign in
              </Link>
            </>
          )}
          <style>{`
            @keyframes fadeInMenu {
              from { opacity: 0; transform: translateY(-8px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
