import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export function PhoneOnboarding() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("phone").eq("id", user.id).maybeSingle().then(({ data }) => {
      if (data && !data.phone) setOpen(true);
    });
  }, [user]);

  async function save() {
    const cleaned = phone.replace(/\s/g, "");
    if (!/^(?:\+?\d{7,15})$/.test(cleaned)) {
      toast.error("Enter a valid phone number with country code, e.g. +254712345678");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ phone: cleaned }).eq("id", user!.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Phone saved");
    setOpen(false);
  }

  if (!open || !user) return null;

  return (
    <>
      {/* Backdrop */}
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 300, backdropFilter: "blur(8px)" }} />

      {/* Dialog */}
      <div
        style={{
          position: "fixed", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)", zIndex: 301,
          width: "100%", maxWidth: 380,
          background: "rgba(12,12,20,0.98)",
          border: "0.5px solid rgba(255,255,255,0.1)",
          borderRadius: 16, padding: "32px 28px",
          fontFamily: '"Inter", sans-serif', color: "#fff",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 48, height: 48, borderRadius: "50%",
            border: "0.5px solid rgba(255,255,255,0.12)",
            display: "grid", placeItems: "center", margin: "0 auto 20px",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="5" y="2" width="14" height="20" rx="2" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
            <circle cx="12" cy="17" r="1" fill="rgba(255,255,255,0.6)" />
          </svg>
        </div>

        <h2
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: 20, fontWeight: 400, letterSpacing: "-0.02em", marginBottom: 8,
          }}
        >
          Add your phone number
        </h2>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 24, lineHeight: 1.6 }}>
          Needed for M-Pesa payments and match alerts. Never shared.
        </p>

        <input
          type="tel"
          placeholder="+254 712 345 678"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{
            width: "100%", padding: "12px 14px", borderRadius: 9,
            border: "0.5px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: 14,
            outline: "none", marginBottom: 12, fontFamily: '"Inter", sans-serif', textAlign: "left",
          }}
        />

        <button
          onClick={save}
          disabled={saving}
          style={{
            width: "100%", padding: "12px 0", borderRadius: 9, border: "none",
            background: "#fff", color: "#000", fontSize: 14, fontWeight: 500,
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.6 : 1, fontFamily: '"Inter", sans-serif',
          }}
        >
          {saving ? "Saving…" : "Save & continue"}
        </button>

        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 14 }}>
          Encrypted at rest · used only for payments and alerts
        </p>
      </div>
    </>
  );
}
