import { Link } from "@tanstack/react-router";
import { Eye } from "lucide-react";
import { Marquee } from "./Marquee";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/40 bg-background/60">
      <Marquee speed={55} reverse className="border-b border-border/40 py-3 text-sm">
        <span className="font-display text-2xl">SOCCER</span>
        <span className="text-muted-foreground">•</span>
        <span className="font-display text-2xl text-accent">BASKETBALL</span>
        <span className="text-muted-foreground">•</span>
        <span className="font-display text-2xl">FORMULA 1</span>
        <span className="text-muted-foreground">•</span>
        <span className="font-display text-2xl text-warning">BASEBALL</span>
        <span className="text-muted-foreground">•</span>
        <span className="font-display text-2xl">TENNIS</span>
        <span className="text-muted-foreground">•</span>
        <span className="font-display text-2xl text-secondary">CRICKET</span>
        <span className="text-muted-foreground">•</span>
        <span className="font-display text-2xl">RUGBY</span>
      </Marquee>
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent grid place-items-center">
              <Eye className="h-4 w-4 text-white" />
            </div>
            <span className="font-display text-lg font-semibold">
              Vision<span className="text-gradient">Play</span>
            </span>
          </Link>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            AI-powered sports intelligence. Explainable forecasts across soccer, basketball, F1, baseball, tennis and more.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            VisionPlay is an analytics & entertainment platform. We are not a betting operator and do not accept wagers.
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold mb-3">Platform</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/matches" className="hover:text-foreground">Matches</Link></li>
            <li><Link to="/leaderboard" className="hover:text-foreground">Leaderboard</Link></li>
            <li><Link to="/pricing" className="hover:text-foreground">Pricing</Link></li>
            <li><Link to="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold mb-3">Legal</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/terms" className="hover:text-foreground">Terms & Conditions</Link></li>
            <li><Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
            <li><a href="mailto:hello@visionplay.app" className="hover:text-foreground">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/40 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} VisionPlay. All rights reserved. 18+ only.
      </div>
    </footer>
  );
}
