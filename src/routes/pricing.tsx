import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { PaymentDialog, type Plan } from "@/components/PaymentDialog";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/pricing")({
  head: () => ({ meta: [{ title: "Pricing — VisionPlay" }] }),
  component: PricingPage,
});

type Tier = Plan & { features: string[]; featured?: boolean; cta?: string };

const tiers: Tier[] = [
  { name: "Free", price: "KES 0", amount: 0, period: "forever", features: ["5 picks / day", "Basic insights", "Community access"], cta: "Start free" },
  { name: "Weekly", price: "KES 149", amount: 149, period: "/week", features: ["Unlimited picks", "Live momentum", "Email & SMS alerts"] },
  { name: "Monthly", price: "KES 399", amount: 399, period: "/month", featured: true, features: ["Everything in Weekly", "Premium leagues", "Priority support", "Revenue share access"] },
  { name: "Elite Season", price: "KES 2,999", amount: 2999, period: "/season", features: ["All sports unlocked", "1-on-1 analyst time", "Private discord", "Early features"] },
];

function PricingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [open, setOpen] = useState(false);

  function handleChoose(t: Tier) {
    if (!user) return navigate({ to: "/signup" });
    if (t.amount === 0) return navigate({ to: "/dashboard" });
    setPlan(t);
    setOpen(true);
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs">
            <Sparkles className="h-3.5 w-3.5 text-accent" /> Pay in KES via M-Pesa or card
          </div>
          <h1 className="mt-4 font-display text-5xl font-semibold">Pricing</h1>
          <p className="mt-3 text-muted-foreground">Cancel anytime, no questions asked.</p>
        </motion.div>

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className={`relative rounded-2xl p-6 ${p.featured ? "bg-gradient-to-b from-primary/15 to-accent/10 border-2 border-primary glow-ring" : "glass"}`}
            >
              {p.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-accent px-3 py-1 text-xs font-semibold text-white">
                  Most popular
                </div>
              )}
              <h3 className="font-display text-xl font-semibold">{p.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-display text-3xl font-bold">{p.price}</span>
                <span className="text-sm text-muted-foreground">{p.period}</span>
              </div>
              <ul className="mt-5 space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm">
                    <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" /> {f}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => handleChoose(p)}
                className={`w-full mt-6 ${p.featured ? "bg-gradient-to-r from-primary to-accent text-white border-0" : ""}`}
                variant={p.featured ? "default" : "outline"}
              >
                {p.cta ?? `Choose ${p.name}`}
              </Button>
            </motion.div>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground max-w-xl mx-auto">
          Payments processed securely. Subscription auto-renews unless cancelled. VisionPlay is an analytics platform, not a betting operator.
        </p>
      </main>
      <PaymentDialog open={open} onOpenChange={setOpen} plan={plan} />
      <SiteFooter />
    </div>
  );
}
