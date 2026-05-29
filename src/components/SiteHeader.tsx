import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Eye, Menu, X, Shield } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Marquee } from "./Marquee";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { to: "/matches", label: "Matches" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/pricing", label: "Pricing" },
];

export function SiteHeader() {
  const { user, isAdmin, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Scrolling ticker */}
      <div className="border-b border-border/40 bg-background/60 backdrop-blur-md">
        <Marquee speed={45} className="py-1.5 text-[11px] uppercase tracking-widest text-muted-foreground">
          <span>⚽ Arsenal vs Chelsea — 78% confidence</span>
          <span className="text-accent">🏀 Lakers vs Celtics — Live xG +1.2</span>
          <span>🏎️ Monaco GP — Verstappen leads grid</span>
          <span className="text-warning">⚾ Yankees vs Red Sox — Edge: Home</span>
          <span>🎾 Alcaraz vs Sinner — 65% Alcaraz</span>
          <span className="text-accent">⚽ Real Madrid vs Barça — Forecast updated</span>
          <span>🏀 Warriors vs Nuggets — Weather: indoor</span>
        </Marquee>
      </div>

      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary via-accent to-secondary grid place-items-center shadow-lg glow-ring"
            >
              <Eye className="h-5 w-5 text-primary-foreground" />
            </motion.div>
            <span className="font-display text-xl font-semibold tracking-tight">
              Vision<span className="text-gradient">Play</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
              >
                {n.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className="px-3 py-2 text-sm font-medium text-accent hover:text-foreground flex items-center gap-1"
              >
                <Shield className="h-3.5 w-3.5" /> Admin
              </Link>
            )}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm">Dashboard</Button>
                </Link>
                <Button size="sm" variant="outline" onClick={() => signOut()}>Sign out</Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Sign in</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0">
                    Get started
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center gap-1">
            <ThemeToggle />
            <button className="p-2" onClick={() => setOpen(!open)} aria-label="menu">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="md:hidden border-t border-border/40 px-4 py-3 space-y-2"
          >
            {navItems.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="block py-2 text-sm text-muted-foreground hover:text-foreground"
              >
                {n.label}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" onClick={() => setOpen(false)} className="block py-2 text-sm text-accent">
                Admin panel
              </Link>
            )}
            <div className="pt-2 flex gap-2">
              {user ? (
                <>
                  <Link to="/dashboard" className="flex-1">
                    <Button size="sm" variant="outline" className="w-full">Dashboard</Button>
                  </Link>
                  <Button size="sm" variant="ghost" onClick={() => signOut()}>Sign out</Button>
                </>
              ) : (
                <>
                  <Link to="/login" className="flex-1">
                    <Button size="sm" variant="outline" className="w-full">Sign in</Button>
                  </Link>
                  <Link to="/signup" className="flex-1">
                    <Button size="sm" className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground border-0">
                      Get started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </motion.header>
    </>
  );
}
