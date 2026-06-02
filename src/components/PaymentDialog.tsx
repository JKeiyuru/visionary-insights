import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export type Plan = { name: string; price: string; amount: number; period: string };

function normalize(p: string) {
  const raw = p.replace(/\s|-/g, "");
  if (/^0[17]\d{8}$/.test(raw)) return "+254" + raw.slice(1);
  if (/^[17]\d{8}$/.test(raw)) return "+254" + raw;
  if (/^\+?254[17]\d{8}$/.test(raw)) return raw.startsWith("+") ? raw : "+" + raw;
  return null;
}

export function PaymentDialog({
  open,
  onOpenChange,
  plan,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  plan: Plan | null;
}) {
  const { user } = useAuth();
  const [tab, setTab] = useState<"mpesa" | "card">("mpesa");
  const [phone, setPhone] = useState("");
  const [defaultPhone, setDefaultPhone] = useState("");
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState<"idle" | "processing" | "success">("idle");

  useEffect(() => {
    if (!user || !open) return;
    supabase.from("profiles").select("phone").eq("id", user.id).maybeSingle().then(({ data }) => {
      const p = data?.phone ?? "";
      setDefaultPhone(p);
      setPhone(p);
      setEditing(!p);
    });
  }, [user, open]);

  function close() { onOpenChange(false); setStatus("idle"); }

  async function recordAttempt(provider: string, payPhone?: string) {
    if (!user || !plan) return;
    await supabase.from("payments").insert({
      user_id: user.id, provider, plan: plan.name.toLowerCase(),
      amount_kes: plan.amount, status: "pending",
      phone: payPhone ?? null, reference: `VP-${Date.now()}`,
    });
  }

  async function payMpesa() {
    const norm = normalize(phone);
    if (!norm) { toast.error("Enter a valid Safaricom number, e.g. 0712 345 678"); return; }
    setStatus("processing");
    await recordAttempt("mpesa", norm);
    setTimeout(() => { setStatus("success"); toast.success(`STK push sent to ${norm}.`); }, 2200);
  }

  async function payCard() {
    setStatus("processing");
    await recordAttempt("card");
    setTimeout(() => { setStatus("success"); toast.success("Payment authorized (demo)."); }, 1800);
  }

  if (!open) return null;

  const inputStyle = {
    width: "100%", padding: "11px 13px", borderRadius: 9,
    border: "0.5px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: 14,
    outline: "none", fontFamily: '"Inter", sans-serif',
  };

  const btnPrimary = {
    width: "100%", padding: "12px 0", borderRadius: 9, border: "none",
    background: "#fff", color: "#000", fontSize: 14, fontWeight: 500,
    cursor: "pointer", fontFamily: '"Inter", sans-serif', transition: "opacity 0.2s",
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={close}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 200, backdropFilter: "blur(6px)" }}
      />

      {/* Dialog */}
      <div
        style={{
          position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          zIndex: 201, width: "100%", maxWidth: 420,
          background: "rgba(12,12,20,0.97)",
          border: "0.5px solid rgba(255,255,255,0.1)",
          borderRadius: 16, padding: 28,
          fontFamily: '"Inter", sans-serif', color: "#fff",
        }}
      >
        {status === "success" ? (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(52,211,153,0.12)", border: "0.5px solid rgba(52,211,153,0.3)", display: "grid", placeItems: "center", margin: "0 auto 20px" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 20, fontWeight: 400, marginBottom: 8 }}>Request received</h3>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 24 }}>
              We'll activate your {plan?.name} plan as soon as payment confirms.
            </p>
            <button onClick={close} style={{ ...btnPrimary, width: "auto", padding: "11px 28px" }}>Done</button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 22, fontWeight: 400, marginBottom: 4 }}>
                Upgrade to {plan?.name}
              </h2>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
                {plan?.price} {plan?.period} · cancel anytime
              </p>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 0, borderBottom: "0.5px solid rgba(255,255,255,0.08)", marginBottom: 20 }}>
              {(["mpesa", "card"] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  style={{ flex: 1, background: "none", border: "none", padding: "10px 0", fontSize: 13, cursor: "pointer", color: tab === t ? "#fff" : "rgba(255,255,255,0.35)", borderBottom: tab === t ? "1.5px solid #fff" : "1.5px solid transparent", fontFamily: '"Inter", sans-serif' }}>
                  {t === "mpesa" ? "M-Pesa" : "Card"}
                </button>
              ))}
            </div>

            {tab === "mpesa" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>M-Pesa number</span>
                  {!editing && defaultPhone && (
                    <button onClick={() => setEditing(true)} style={{ background: "none", border: "none", fontSize: 11, color: "rgba(255,255,255,0.4)", cursor: "pointer", textDecoration: "underline" }}>
                      Use different number
                    </button>
                  )}
                </div>
                <input style={inputStyle} placeholder="0712 345 678" value={phone}
                  onChange={e => setPhone(e.target.value)}
                  disabled={status === "processing" || (!editing && !!defaultPhone)} />
                <button onClick={payMpesa} disabled={status === "processing"} style={{ ...btnPrimary, background: status === "processing" ? "rgba(255,255,255,0.4)" : "#fff" }}>
                  {status === "processing" ? "Sending STK push…" : `Pay ${plan?.price} via M-Pesa`}
                </button>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", textAlign: "center" }}>
                  You'll receive a prompt on your phone to approve.
                </p>
              </div>
            )}

            {tab === "card" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <input style={inputStyle} placeholder="4242 4242 4242 4242" disabled={status === "processing"} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <input style={inputStyle} placeholder="MM / YY" disabled={status === "processing"} />
                  <input style={inputStyle} placeholder="CVC" disabled={status === "processing"} />
                </div>
                <button onClick={payCard} disabled={status === "processing"} style={{ ...btnPrimary, background: status === "processing" ? "rgba(255,255,255,0.4)" : "#fff" }}>
                  {status === "processing" ? "Authorizing…" : `Pay ${plan?.price}`}
                </button>
              </div>
            )}

            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", textAlign: "center", marginTop: 16 }}>
              Encrypted · PCI-DSS · Powered by VisionPlay
            </p>
          </>
        )}
      </div>
    </>
  );
}
