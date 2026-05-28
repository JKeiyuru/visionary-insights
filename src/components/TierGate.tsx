import { ReactNode, useState } from "react";
import { motion } from "framer-motion";
import { Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaymentDialog, type Plan } from "./PaymentDialog";

export type SubPlan = "free" | "weekly" | "monthly" | "elite";

const order: Record<SubPlan, number> = { free: 0, weekly: 1, monthly: 2, elite: 3 };

export function tierAllows(current: SubPlan | string | undefined, required: SubPlan): boolean {
  const c = (current as SubPlan) ?? "free";
  return (order[c] ?? 0) >= order[required];
}

const PLAN_INFO: Record<SubPlan, Plan> = {
  free: { name: "Free", price: "KES 0", amount: 0, period: "forever" },
  weekly: { name: "Weekly", price: "KES 149", amount: 149, period: "/week" },
  monthly: { name: "Monthly", price: "KES 399", amount: 399, period: "/month" },
  elite: { name: "Elite Season", price: "KES 2,999", amount: 2999, period: "/season" },
};

export function TierGate({
  current,
  required,
  feature,
  children,
}: {
  current: SubPlan | string | undefined;
  required: SubPlan;
  feature: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  if (tierAllows(current, required)) return <>{children}</>;
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-border bg-surface/60 p-6 text-center"
      >
        <div className="absolute inset-0 grid-bg opacity-30" aria-hidden />
        <div className="relative">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-accent grid place-items-center glow-magenta">
            <Lock className="h-5 w-5 text-white" />
          </div>
          <h4 className="mt-3 font-display text-lg font-semibold">{feature}</h4>
          <p className="mt-1 text-sm text-muted-foreground">
            Unlock with the <span className="text-foreground font-medium capitalize">{required}</span> plan.
          </p>
          <Button
            className="mt-4 bg-gradient-to-r from-primary to-accent text-white border-0"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Sparkles className="h-4 w-4 mr-2" /> Upgrade to {PLAN_INFO[required].name}
          </Button>
        </div>
      </motion.div>
      <PaymentDialog open={open} onOpenChange={setOpen} plan={PLAN_INFO[required]} />
    </>
  );
}

export { PLAN_INFO };
