/**
 * /pricing — Redesigned Pricing Page
 *
 * PLACEHOLDERS:
 * ─────────────────────────────────────────────────────────────────────
 * [SPLINE-BG] A slowly rotating trophy or medal 3D object as the
 *   hero background. Search spline.design for "trophy 3d" or "medal".
 *   Replace the gradient div below with:
 *     import Spline from "@splinetool/react-spline";
 *     <Spline scene="https://prod.spline.design/YOUR-ID/scene.splinecode"
 *       style={{ position:"absolute", inset:0, width:"100%", height:"100%" }} />
 * ─────────────────────────────────────────────────────────────────────
 */

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FloatingNav } from "@/components/FloatingNav";
import { SiteFooter } from "@/components/SiteFooter";
import { PaymentDialog, type Plan } from "@/components/PaymentDialog";
import { useAuth } from "@/hooks/use-auth";
import { useViewport } from "@/hooks/use-viewport";
import { supabase } from "@/integrations/supabase/client";


export const Route = createFileRoute("/pricing")({
  head: () => ({ meta: [{ title: "Pricing — VisionPlay" }] }),
  component: PricingPage,
});

type DbPlan = {
  id: string; slug: string; name: string; price_label: string;
  amount_kes: number; period: string; features: string[];
  featured: boolean; sort_order: number; active: boolean;
};

function PricingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isMobile, isHandheld, isWide } = useViewport();
  const pad = isMobile ? "20px" : isHandheld ? "32px" : "64px";
  const maxW = isWide ? 1400 : 1100;
  const [plans, setPlans] = useState<DbPlan[]>([]);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [open, setOpen] = useState(false);


  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("plans").select("*").eq("active", true).order("sort_order");
      if (data) setPlans(data as DbPlan[]);
    }
    load();
    const ch = supabase.channel("plans-public")
      .on("postgres_changes", { event: "*", schema: "public", table: "plans" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  function handleChoose(t: DbPlan) {
    if (!user) return navigate({ to: "/signup" });
    if (Number(t.amount_kes) === 0) return navigate({ to: "/dashboard" });
    setPlan({ name: t.name, price: t.price_label, amount: Number(t.amount_kes), period: t.period });
    setOpen(true);
  }

  return (
    <div style={{ background: "#06060a", color: "#fff", minHeight: "100vh", fontFamily: '"Inter", sans-serif' }}>
      <FloatingNav />

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <div style={{ position: "relative", height: isMobile ? 260 : isHandheld ? 300 : 360, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 100% at 70% 50%, #1a0a2e 0%, #06060a 65%)" }} />

        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 0%, rgba(6,6,10,0.9) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(6,6,10,0.85) 0%, transparent 60%)" }} />

        <div style={{ position: "absolute", bottom: isMobile ? 32 : 48, left: 0, right: 0, padding: `0 ${pad}`, maxWidth: maxW, margin: "0 auto" }}>
          <p style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 14 }}>
            Pricing
          </p>
          <h1
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: "clamp(30px, 4.5vw, 60px)",
              fontWeight: 300,
              letterSpacing: "-0.035em",
              lineHeight: 1.05,
            }}
          >
            Start free.
            <br />Scale when you're ready.
          </h1>
        </div>
      </div>

      {/* ── PLANS ─────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: maxW, margin: "0 auto", padding: `${isMobile ? 40 : 56}px ${pad} ${isMobile ? 56 : 80}px` }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isHandheld ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: isMobile ? 14 : 1 }}>
          {plans.map((p) => (
            <PlanCard key={p.id} plan={p} onChoose={handleChoose} />
          ))}

          {/* Skeleton while loading */}
          {plans.length === 0 && [1, 2, 3, 4].map((i) => (
            <div key={i} style={{ height: 400, border: "0.5px solid rgba(255,255,255,0.06)", borderRadius: 12, background: "rgba(255,255,255,0.01)", animation: "pulse 1.5s infinite" }} />
          ))}
        </div>

        <p style={{ marginTop: 32, textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.2)", lineHeight: 1.65 }}>
          Payments processed securely via M-Pesa or card.
          Subscription auto-renews unless cancelled.
          VisionPlay is an analytics platform, not a betting operator.
        </p>
      </div>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 680,
          margin: "0 auto",
          padding: `${isMobile ? 48 : 64}px ${pad} ${isMobile ? 64 : 100}px`,
          borderTop: "0.5px solid rgba(255,255,255,0.06)",
        }}
      >

        <h2 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 28, fontWeight: 300, letterSpacing: "-0.025em", marginBottom: 40 }}>
          Questions
        </h2>
        {[
          { q: "Can I cancel anytime?", a: "Yes. Cancel from your dashboard before the next billing cycle and you won't be charged again." },
          { q: "What payment methods are accepted?", a: "M-Pesa (Safaricom) and major debit/credit cards. More methods coming soon." },
          { q: "Is VisionPlay a betting platform?", a: "No. VisionPlay is an analytics and entertainment platform. We provide predictions and insights — we do not accept wagers or operate as a bookmaker." },
          { q: "How accurate are the predictions?", a: "Our average accuracy across all sports is 71.4%. Individual sports vary — soccer tends to be our strongest, F1 strategy the most complex." },
          { q: "What is the Elite Season plan?", a: "A season-length pass covering all sports, premium leagues, 1-on-1 analyst sessions, and access to our private analyst community." },
        ].map((f, i) => (
          <FaqItem key={i} q={f.q} a={f.a} />
        ))}
      </div>

      <PaymentDialog open={open} onOpenChange={setOpen} plan={plan} />
      <SiteFooter />

      <style>{`@keyframes pulse { 0%,100%{opacity:0.4;} 50%{opacity:0.7;} }`}</style>
    </div>
  );
}

function PlanCard({ plan: p, onChoose }: { plan: DbPlan; onChoose: (p: DbPlan) => void }) {
  const [hovered, setHovered] = useState(false);
  const accent = p.featured ? "#60a5fa" : "rgba(255,255,255,0.25)";

  return (
    <div
      style={{
        padding: "28px 24px 24px",
        border: p.featured ? `0.5px solid rgba(96,165,250,0.25)` : "0.5px solid rgba(255,255,255,0.06)",
        borderRadius: 12,
        background: p.featured ? "rgba(96,165,250,0.04)" : hovered ? "rgba(255,255,255,0.015)" : "transparent",
        transition: "background 0.2s ease",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {p.featured && (
        <div
          style={{
            position: "absolute",
            top: -10,
            left: 20,
            background: "#60a5fa",
            color: "#000",
            fontSize: 10,
            fontWeight: 600,
            padding: "3px 10px",
            borderRadius: 100,
            letterSpacing: "0.06em",
          }}
        >
          Most popular
        </div>
      )}

      {/* Name */}
      <div style={{ fontSize: 13, fontWeight: 500, color: accent, marginBottom: 16, letterSpacing: "-0.01em" }}>
        {p.name}
      </div>

      {/* Price */}
      <div style={{ marginBottom: 20 }}>
        <span
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: 30,
            fontWeight: 400,
            letterSpacing: "-0.03em",
          }}
        >
          {p.price_label}
        </span>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginLeft: 5 }}>
          {p.period}
        </span>
      </div>

      {/* Features */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 9, marginBottom: 24 }}>
        {(p.features ?? []).map((f) => (
          <div key={f} style={{ display: "flex", gap: 9, alignItems: "flex-start", fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.45 }}>
            <span style={{ color: accent, flexShrink: 0, marginTop: 1 }}>—</span>
            {f}
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={() => onChoose(p)}
        style={{
          width: "100%",
          padding: "11px 0",
          borderRadius: 8,
          border: "none",
          cursor: "pointer",
          fontSize: 13,
          fontWeight: 500,
          letterSpacing: "-0.01em",
          background: p.featured ? "#60a5fa" : "rgba(255,255,255,0.07)",
          color: p.featured ? "#000" : "rgba(255,255,255,0.6)",
          transition: "opacity 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        {Number(p.amount_kes) === 0 ? "Start free" : `Choose ${p.name}`}
      </button>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "18px 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#fff",
          textAlign: "left",
          gap: 16,
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 400, letterSpacing: "-0.01em" }}>{q}</span>
        <span style={{ fontSize: 18, color: "rgba(255,255,255,0.3)", flexShrink: 0, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
      </button>
      {open && (
        <div style={{ padding: "0 0 18px", fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.65 }}>
          {a}
        </div>
      )}
    </div>
  );
}
