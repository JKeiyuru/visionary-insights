import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { PaymentDialog, type Plan } from "@/components/PaymentDialog";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/pricing")({
  head: () => ({ meta: [{ title: "Pricing — VisionPlay" }] }),
  component: PricingPage,
});

type DbPlan = {
  id: string;
  slug: string;
  name: string;
  price_label: string;
  amount_kes: number;
  period: string;
  features: string[];
  featured: boolean;
  sort_order: number;
  active: boolean;
};

function PricingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<DbPlan[]>([]);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("plans").select("*").eq("active", true).order("sort_order");
      if (data) setPlans(data as DbPlan[]);
    }
    load();
    const channel = supabase
      .channel("plans-public")
      .on("postgres_changes", { event: "*", schema: "public", table: "plans" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  function handleChoose(t: DbPlan) {
    if (!user) return navigate({ to: "/signup" });
    if (Number(t.amount_kes) === 0) return navigate({ to: "/dashboard" });
    setPlan({ name: t.name, price: t.price_label, amount: Number(t.amount_kes), period: t.period });
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
          {plans.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className={`relative rounded-2xl p-6 ${p.featured ? "bg-gradient-to-b from-primary/15 to-accent/10 border-2 border-primary glow-ring" : "glass"}`}
            >
              {p.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-accent px-3 py-1 text-xs font-semibold text-primary-foreground">
                  Most popular
                </div>
              )}
              <h3 className="font-display text-xl font-semibold">{p.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-display text-3xl font-bold">{p.price_label}</span>
                <span className="text-sm text-muted-foreground">{p.period}</span>
              </div>
              <ul className="mt-5 space-y-2">
                {(p.features ?? []).map((f) => (
                  <li key={f} className="flex gap-2 text-sm">
                    <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" /> {f}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => handleChoose(p)}
                className={`w-full mt-6 ${p.featured ? "bg-gradient-to-r from-primary to-accent text-primary-foreground border-0" : ""}`}
                variant={p.featured ? "default" : "outline"}
              >
                {Number(p.amount_kes) === 0 ? "Start free" : `Choose ${p.name}`}
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
