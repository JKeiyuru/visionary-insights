import { createFileRoute } from "@tanstack/react-router";
import {
  Brain,
  Activity,
  Trophy,
  Users,
  Shield,
  Sparkles,
  LineChart,
  Bell,
  Zap,
  Check,
  Star,
  ArrowRight,
  TrendingUp,
  Target,
  Award,
  Crown,
  Phone,
  CircleCheck,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VisionPlay — AI Sports Intelligence & Forecasting" },
      {
        name: "description",
        content:
          "VisionPlay is Africa's AI-powered sports intelligence platform. Smarter forecasts, explainable predictions, and a competitive community of analysts.",
      },
      { property: "og:title", content: "VisionPlay — AI Sports Intelligence" },
      {
        property: "og:description",
        content:
          "Forecast smarter with explainable AI, live match intelligence, and a global community of sports analysts.",
      },
    ],
  }),
  component: Landing,
});

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent grid place-items-center shadow-lg">
        <div className="h-3 w-3 rounded-sm bg-background" />
        <div className="absolute inset-0 rounded-lg ring-1 ring-white/20" />
      </div>
      <span className="font-display text-xl font-semibold tracking-tight">
        Vision<span className="text-gradient">Play</span>
      </span>
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/60 border-b border-white/5">
      <div className="mx-auto max-w-7xl px-5 h-16 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition">Intelligence</a>
          <a href="#live" className="hover:text-foreground transition">Live</a>
          <a href="#community" className="hover:text-foreground transition">Community</a>
          <a href="#pricing" className="hover:text-foreground transition">Pricing</a>
          <a href="#faq" className="hover:text-foreground transition">FAQ</a>
        </nav>
        <div className="flex items-center gap-2">
          <a href="#login" className="hidden sm:inline-flex text-sm text-muted-foreground hover:text-foreground px-3 py-2">
            Sign in
          </a>
          <a
            href="#signup"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition shadow-lg shadow-primary/20"
          >
            Get started <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              Explainable AI · Built for Africa, designed for the world
            </div>
            <h1 className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.02]">
              Become a smarter
              <br />
              <span className="text-gradient">sports analyst.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
              VisionPlay turns raw match data into clear, explainable forecasts —
              so you can predict, learn, and compete with a global community of
              analysts. Not a betting site. A sports intelligence platform.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#signup"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition glow-ring"
              >
                Start forecasting free <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#live"
                className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium hover:bg-white/10 transition"
              >
                See live AI in action
              </a>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              {[
                ["64%", "Avg AI accuracy"],
                ["120k+", "Predictions / week"],
                ["38", "Leagues covered"],
              ].map(([k, v]) => (
                <div key={v}>
                  <div className="text-2xl font-semibold text-foreground">{k}</div>
                  <div className="text-xs text-muted-foreground mt-1">{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <PredictionCard />
          </div>
        </div>
      </div>
    </section>
  );
}

function PredictionCard() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 blur-3xl rounded-full" />
      <div className="relative glass rounded-2xl p-5 shadow-2xl">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-warning animate-pulse" />
            Premier League · 67'
          </span>
          <span>AI Confidence · High</span>
        </div>

        <div className="mt-4 grid grid-cols-3 items-center gap-3">
          <Team name="Arsenal" abbr="ARS" color="from-red-500/30 to-red-500/10" score={2} />
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Live</div>
            <div className="font-display text-3xl font-semibold tracking-tight">2 — 1</div>
          </div>
          <Team name="Chelsea" abbr="CHE" color="from-blue-500/30 to-blue-500/10" score={1} right />
        </div>

        <div className="mt-5 space-y-3">
          <ProbBar label="Arsenal win" value={64} color="bg-accent" />
          <ProbBar label="Draw" value={22} color="bg-secondary" />
          <ProbBar label="Chelsea win" value={14} color="bg-warning" />
        </div>

        <div className="mt-5 rounded-xl bg-background/60 border border-white/5 p-4">
          <div className="flex items-center gap-2 text-xs text-secondary">
            <Sparkles className="h-3.5 w-3.5" /> Why this forecast
          </div>
          <p className="mt-2 text-sm text-foreground/90 leading-relaxed">
            Arsenal projects a <b>64% win probability</b> due to superior recent
            form, higher attacking efficiency, and stronger home possession
            metrics. Chelsea's xG drop after the 60' substitution lowered momentum.
          </p>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          {[
            ["xG", "2.4 — 1.1"],
            ["Momentum", "+18%"],
            ["Upset risk", "Low"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-lg bg-white/5 border border-white/5 py-2">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
              <div className="text-sm font-medium mt-0.5">{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Team({ name, abbr, color, score, right }: { name: string; abbr: string; color: string; score: number; right?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${right ? "justify-end flex-row-reverse" : ""}`}>
      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${color} grid place-items-center border border-white/10`}>
        <span className="font-display text-sm font-semibold">{abbr}</span>
      </div>
      <div className={right ? "text-right" : ""}>
        <div className="text-sm font-medium">{name}</div>
        <div className="text-xs text-muted-foreground">Form: WWDLW</div>
      </div>
    </div>
  );
}

function ProbBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <div className="mt-1.5 h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function LogoStrip() {
  const items = ["Sportmonks", "API-Football", "Sportradar", "StatsBomb", "Opta", "The Odds API"];
  return (
    <div className="mx-auto max-w-7xl px-5 pb-10">
      <p className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Powered by world-class sports data
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-muted-foreground/80">
        {items.map((i) => (
          <span key={i} className="font-display text-sm tracking-wide">{i}</span>
        ))}
      </div>
    </div>
  );
}

function Features() {
  const items = [
    {
      icon: Brain,
      title: "Explainable AI engine",
      desc: "Every forecast comes with reasoning — factors, weights, and confidence. No black boxes.",
    },
    {
      icon: Activity,
      title: "Real-time match intelligence",
      desc: "Momentum, possession, xG, lineup impact and live probability shifts as the game unfolds.",
    },
    {
      icon: Target,
      title: "Personalized insights",
      desc: "The AI learns your favorite teams, sports, and habits — your home screen evolves with you.",
    },
    {
      icon: Users,
      title: "Community forecasting",
      desc: "Follow top analysts, compare predictions, join leagues, and build a reputation.",
    },
    {
      icon: Bell,
      title: "Smart alerts, not spam",
      desc: "Lineup changes, upset risks, confidence shifts and streak reminders — only what matters.",
    },
    {
      icon: Shield,
      title: "Fintech-grade trust",
      desc: "Encrypted payments, device management, fraud detection and full account transparency.",
    },
  ];
  return (
    <section id="features" className="py-24 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-5">
        <SectionHeader
          eyebrow="Intelligence"
          title="An AI built to make you sharper."
          subtitle="VisionPlay rewards skill, consistency, and analytical thinking — not chasing odds. Every feature is designed to help you understand sports more deeply."
        />
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="group glass rounded-2xl p-6 hover:bg-white/[0.06] transition">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/30 to-accent/20 grid place-items-center border border-white/10">
                <Icon className="h-5 w-5 text-secondary" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <div className="max-w-2xl">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-secondary">
        <Sparkles className="h-3 w-3" /> {eyebrow}
      </div>
      <h2 className="mt-5 text-4xl sm:text-5xl font-semibold leading-[1.05]">{title}</h2>
      <p className="mt-4 text-muted-foreground text-lg leading-relaxed">{subtitle}</p>
    </div>
  );
}

function LiveSection() {
  return (
    <section id="live" className="py-24 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-5 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <SectionHeader
            eyebrow="Live"
            title="Watch probability shift in real time."
            subtitle="Heat maps, possession trends, substitution impact, injury alerts — VisionPlay's live engine keeps you a step ahead of the broadcast."
          />
          <ul className="mt-8 space-y-3">
            {[
              "Live win probability and xG updates every play",
              "Tactical shift detection and momentum graphs",
              "Lineup change impact, instantly modeled",
              "Upset alerts when something doesn't add up",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3 text-foreground/90">
                <CircleCheck className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Win probability · last 90 minutes</span>
            <span className="inline-flex items-center gap-1.5 text-accent">
              <TrendingUp className="h-3.5 w-3.5" /> +18%
            </span>
          </div>
          <LiveChart />
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[
              ["Possession", "58 / 42"],
              ["Shots", "14 / 9"],
              ["xG", "2.4 / 1.1"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-lg bg-white/5 border border-white/5 py-3">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
                <div className="text-sm font-medium mt-1">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function LiveChart() {
  const pts = [25, 32, 30, 38, 45, 42, 50, 58, 55, 62, 60, 64, 70, 68, 72, 64];
  const w = 600;
  const h = 180;
  const max = 100;
  const step = w / (pts.length - 1);
  const path = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - (p / max) * h}`)
    .join(" ");
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-4 w-full h-44">
      <defs>
        <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.72 0.17 162)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="oklch(0.72 0.17 162)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#g)" />
      <path d={path} fill="none" stroke="oklch(0.78 0.13 235)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function Reputation() {
  const tiers = [
    { name: "Bronze", icon: Award, accuracy: "50–59%" },
    { name: "Silver", icon: Award, accuracy: "60–64%" },
    { name: "Gold", icon: Trophy, accuracy: "65–69%" },
    { name: "Platinum", icon: Star, accuracy: "70–74%" },
    { name: "Elite", icon: Zap, accuracy: "75–79%" },
    { name: "Oracle", icon: Crown, accuracy: "80%+" },
  ];
  return (
    <section id="community" className="py-24 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-5">
        <SectionHeader
          eyebrow="Reputation"
          title="Climb from Bronze to Oracle."
          subtitle="Every prediction builds your forecasting reputation. Earn XP, unlock badges, and prove your edge in seasonal leagues and tournaments."
        />
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {tiers.map(({ name, icon: Icon, accuracy }, i) => (
            <div
              key={name}
              className={`glass rounded-2xl p-5 text-center ${
                i === 5 ? "bg-gradient-to-b from-warning/10 to-transparent border-warning/30" : ""
              }`}
            >
              <Icon
                className={`mx-auto h-7 w-7 ${
                  i === 5 ? "text-warning" : i >= 3 ? "text-secondary" : "text-muted-foreground"
                }`}
              />
              <div className="mt-3 font-display font-semibold">{name}</div>
              <div className="text-xs text-muted-foreground mt-1">{accuracy}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: Phone, title: "Sign up in 30 seconds", desc: "Enter your phone number, verify with OTP, you're in. Optional Google or Apple sign-in." },
    { icon: Brain, title: "Get AI-powered forecasts", desc: "Browse explained predictions for the matches you care about — with reasoning, not noise." },
    { icon: LineChart, title: "Predict, learn, climb", desc: "Lock in your call, watch it play out live, and build a reputation that other analysts respect." },
  ];
  return (
    <section className="py-24 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-5">
        <SectionHeader
          eyebrow="How it works"
          title="From signup to Oracle, frictionless."
          subtitle="Onboarding is built for Kenya-first mobile users with M-Pesa, then scales globally with Visa, Mastercard, Apple Pay and Google Pay."
        />
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {steps.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="relative glass rounded-2xl p-6">
              <div className="absolute -top-3 left-6 text-xs font-medium rounded-full bg-primary px-2.5 py-1 text-primary-foreground">
                Step {i + 1}
              </div>
              <Icon className="h-6 w-6 text-secondary mt-2" />
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    {
      name: "Free",
      price: "KES 0",
      period: "forever",
      desc: "Get a feel for explainable AI forecasts.",
      features: ["Daily AI top picks", "Basic match insights", "Community leaderboard", "Bronze reputation tier"],
      cta: "Start free",
    },
    {
      name: "Weekly",
      price: "KES 149",
      period: "/ week",
      desc: "Perfect for matchday warriors.",
      features: [
        "Full AI prediction library",
        "Live match intelligence",
        "Lineup & injury alerts",
        "Compete in weekly leagues",
      ],
      cta: "Choose Weekly",
      highlight: false,
    },
    {
      name: "Monthly",
      price: "KES 399",
      period: "/ month",
      desc: "Best value for serious analysts.",
      features: [
        "Everything in Weekly",
        "Advanced analytics dashboards",
        "Deeper prediction breakdowns",
        "Priority alerts & AI coaching",
        "Platinum reputation boost",
      ],
      cta: "Choose Monthly",
      highlight: true,
    },
    {
      name: "Elite Season",
      price: "Custom",
      period: "teams & pros",
      desc: "For media, fantasy platforms & creators.",
      features: [
        "Enterprise forecasting APIs",
        "White-label analytics",
        "Dedicated success manager",
        "Custom data feeds",
      ],
      cta: "Talk to sales",
    },
  ];

  return (
    <section id="pricing" className="py-24 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-5">
        <SectionHeader
          eyebrow="Pricing"
          title="Simple plans. Serious edge."
          subtitle="Pay with M-Pesa, card, Apple Pay or Google Pay. Cancel any time — no lock-in, no gambling, no nonsense."
        />
        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative rounded-2xl p-6 flex flex-col ${
                t.highlight
                  ? "bg-gradient-to-b from-primary/20 to-primary/5 border border-primary/40 glow-ring"
                  : "glass"
              }`}
            >
              {t.highlight && (
                <div className="absolute -top-3 right-6 text-[10px] uppercase tracking-wider font-semibold rounded-full bg-accent px-2.5 py-1 text-accent-foreground">
                  Most popular
                </div>
              )}
              <div className="text-sm text-muted-foreground">{t.name}</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-display text-4xl font-semibold">{t.price}</span>
                <span className="text-sm text-muted-foreground">{t.period}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
              <ul className="mt-6 space-y-2.5 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                    <span className="text-foreground/90">{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#signup"
                className={`mt-7 inline-flex items-center justify-center gap-1.5 rounded-md px-4 py-2.5 text-sm font-medium transition ${
                  t.highlight
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-white/5 hover:bg-white/10 border border-white/10"
                }`}
              >
                {t.cta} <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-muted-foreground">
          VisionPlay is a sports analytics and forecasting platform — not a betting or gambling operator.
          Predictions are informational. Please play responsibly.
        </p>
      </div>
    </section>
  );
}

function Testimonials() {
  const t = [
    {
      name: "Brian K.",
      role: "Gold analyst · Nairobi",
      quote:
        "I finally understand why a forecast is what it is. VisionPlay made me a better viewer, not just a better predictor.",
    },
    {
      name: "Amara O.",
      role: "Platinum analyst · Lagos",
      quote:
        "The live momentum graph is unreal. I caught three upsets last month before they hit the broadcast.",
    },
    {
      name: "Daniel M.",
      role: "Sports creator · Cape Town",
      quote:
        "The API and explainability gave my channel a real edge. My audience trusts the breakdowns now.",
    },
  ];
  return (
    <section className="py-24 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-5">
        <SectionHeader
          eyebrow="Community"
          title="Trusted by analysts across Africa."
          subtitle="A growing network of curious, competitive fans turning sports knowledge into reputation."
        />
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {t.map((x) => (
            <figure key={x.name} className="glass rounded-2xl p-6">
              <div className="flex gap-0.5 text-warning">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 text-foreground/90 leading-relaxed">“{x.quote}”</blockquote>
              <figcaption className="mt-5 text-sm">
                <div className="font-medium">{x.name}</div>
                <div className="text-muted-foreground">{x.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const qa = [
    {
      q: "Is VisionPlay a betting site?",
      a: "No. VisionPlay is a sports analytics, forecasting and community platform. We do not accept wagers, run odds, or operate payout pools. Predictions are informational and meant to help you understand sports more deeply.",
    },
    {
      q: "How accurate is the AI?",
      a: "Our models average 60–68% accuracy across major football leagues, with confidence levels published on every forecast. Every prediction comes with an explanation of the factors driving it.",
    },
    {
      q: "How do I pay in Kenya?",
      a: "M-Pesa STK push is built in. Your registered phone is your default payment number, but you can add and switch alternative numbers any time.",
    },
    {
      q: "Can I cancel anytime?",
      a: "Yes. Weekly and Monthly plans cancel instantly from your account. You keep access until the end of your billing period.",
    },
    {
      q: "What data sources do you use?",
      a: "We aggregate Sportmonks, API-Football, Sportradar, StatsBomb and Opta-grade signals — plus our own community and behavior models.",
    },
  ];
  return (
    <section id="faq" className="py-24 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-5 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <SectionHeader
            eyebrow="FAQ"
            title="Smart answers, no fluff."
            subtitle="Still curious? Reach out at hello@visionplay.app and we'll get back within a day."
          />
        </div>
        <div className="lg:col-span-8 space-y-3">
          {qa.map(({ q, a }) => (
            <details key={q} className="group glass rounded-xl p-5 open:bg-white/[0.06] transition">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <span className="font-medium">{q}</span>
                <span className="text-muted-foreground group-open:rotate-45 transition">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section id="signup" className="py-24 border-t border-white/5">
      <div className="mx-auto max-w-5xl px-5">
        <div className="relative overflow-hidden rounded-3xl p-10 md:p-14 text-center border border-white/10 bg-gradient-to-br from-primary/30 via-surface to-accent/20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,oklch(0.78_0.13_235/0.25),transparent_70%)]" />
          <div className="relative">
            <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">
              Ready to forecast like a pro?
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Join thousands of analysts already climbing the VisionPlay leaderboard.
              Sign up in 30 seconds with your phone number.
            </p>
            <form className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="flex-1 flex items-center gap-2 rounded-md bg-background/60 border border-white/10 px-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <input
                  type="tel"
                  placeholder="+254 7XX XXX XXX"
                  className="bg-transparent w-full py-3 text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
              <button
                type="button"
                className="rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
              >
                Send OTP
              </button>
            </form>
            <p className="mt-3 text-xs text-muted-foreground">
              By continuing you agree to our Terms and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="mx-auto max-w-7xl px-5 grid md:grid-cols-4 gap-8 text-sm">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 text-muted-foreground max-w-sm">
            VisionPlay is Africa's AI sports intelligence platform — built to make fans smarter, not gamblers.
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Platform</div>
          <ul className="mt-3 space-y-2 text-foreground/90">
            <li><a href="#features" className="hover:text-secondary">Intelligence</a></li>
            <li><a href="#live" className="hover:text-secondary">Live</a></li>
            <li><a href="#community" className="hover:text-secondary">Community</a></li>
            <li><a href="#pricing" className="hover:text-secondary">Pricing</a></li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Company</div>
          <ul className="mt-3 space-y-2 text-foreground/90">
            <li><a href="#" className="hover:text-secondary">About</a></li>
            <li><a href="#" className="hover:text-secondary">Terms of Service</a></li>
            <li><a href="#" className="hover:text-secondary">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-secondary">Responsible Use</a></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-5 mt-10 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
        <div>© {new Date().getFullYear()} VisionPlay. All rights reserved.</div>
        <div>Sports intelligence platform · Not a gambling operator.</div>
      </div>
    </footer>
  );
}

function Landing() {
  return (
    <div className="min-h-screen text-foreground">
      <Nav />
      <main>
        <Hero />
        <LogoStrip />
        <Features />
        <LiveSection />
        <Reputation />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
