import { ReactNode, useState } from "react";
import { PaymentDialog, type Plan } from "./PaymentDialog";

export type SubPlan = "free" | "weekly" | "monthly" | "elite";

const ORDER: Record<SubPlan, number> = { free: 0, weekly: 1, monthly: 2, elite: 3 };

export function tierAllows(current: SubPlan | string | undefined, required: SubPlan): boolean {
  return (ORDER[(current as SubPlan)] ?? 0) >= ORDER[required];
}

const PLAN_INFO: Record<SubPlan, Plan> = {
  free:    { name: "Free",         price: "KES 0",     amount: 0,    period: "forever" },
  weekly:  { name: "Weekly",       price: "KES 149",   amount: 149,  period: "/week"   },
  monthly: { name: "Monthly",      price: "KES 399",   amount: 399,  period: "/month"  },
  elite:   { name: "Elite Season", price: "KES 2,999", amount: 2999, period: "/season" },
};

export function TierGate({
  current, required, feature, children,
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
      <div
        style={{
          border: "0.5px solid rgba(255,255,255,0.07)",
          borderRadius: 12,
          padding: "28px 24px",
          textAlign: "center",
          background: "rgba(255,255,255,0.01)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Lock icon */}
        <div
          style={{
            width: 40, height: 40, borderRadius: "50%",
            border: "0.5px solid rgba(255,255,255,0.12)",
            display: "grid", placeItems: "center", margin: "0 auto 16px",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect x="5" y="11" width="14" height="10" rx="2" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
            <path d="M8 11V7a4 4 0 118 0v4" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
          </svg>
        </div>

        <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 6, letterSpacing: "-0.01em" }}>
          {feature}
        </div>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginBottom: 20 }}>
          Unlock with the <span style={{ color: "#fff" }}>{PLAN_INFO[required].name}</span> plan.
        </p>
        <button
          onClick={() => setOpen(true)}
          style={{
            padding: "10px 22px", borderRadius: 100, border: "none",
            background: "#fff", color: "#000", fontSize: 13, fontWeight: 500,
            cursor: "pointer", transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Upgrade to {PLAN_INFO[required].name}
        </button>
      </div>
      <PaymentDialog open={open} onOpenChange={setOpen} plan={PLAN_INFO[required]} />
    </>
  );
}

export { PLAN_INFO };
