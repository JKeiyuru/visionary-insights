import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create account — VisionPlay" }] }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/dashboard" });
  }, [user, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleaned = phone.replace(/\s/g, "");
    if (!/^(?:\+?\d{7,15})$/.test(cleaned)) {
      return toast.error("Enter a valid phone with country code, e.g. +254712345678");
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, phone: cleaned },
        emailRedirectTo: window.location.origin + "/dashboard",
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Account created! Check your email to verify.");
    navigate({ to: "/dashboard" });
  }

  async function onGoogle() {
    const res = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/dashboard",
    });
    if (res.error) toast.error("Google sign-in failed");
  }

  return (
    <div
      style={{
        background: "#06060a",
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        fontFamily: '"Inter", sans-serif',
        padding: 24,
      }}
    >
      <div
        style={{
          position: "fixed",
          top: "30%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: 600,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(52,211,153,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ width: "100%", maxWidth: 400, position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Link
            to="/"
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: 22,
              fontWeight: 500,
              letterSpacing: "-0.02em",
              color: "#fff",
              textDecoration: "none",
            }}
          >
            Vision<span style={{ color: "rgba(255,255,255,0.3)" }}>Play</span>
          </Link>
        </div>

        <h1
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: 28,
            fontWeight: 300,
            letterSpacing: "-0.025em",
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          Join VisionPlay.
        </h1>
        <p
          style={{
            fontSize: 14,
            color: "rgba(255,255,255,0.35)",
            textAlign: "center",
            marginBottom: 36,
          }}
        >
          Free to start. No credit card needed.
        </p>

        {/* Google */}
        <button
          onClick={onGoogle}
          style={{
            width: "100%",
            padding: "12px 0",
            borderRadius: 10,
            border: "0.5px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.04)",
            color: "#fff",
            fontSize: 14,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            marginBottom: 24,
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 11v3.2h5.6c-.4 2.3-2.4 4-5.6 4-3.4 0-6.2-2.8-6.2-6.2S8.6 5.8 12 5.8c1.5 0 2.9.5 4 1.5l2.3-2.3C16.7 3.5 14.5 2.6 12 2.6 6.8 2.6 2.6 6.8 2.6 12s4.2 9.4 9.4 9.4c5.4 0 9-3.8 9-9.1 0-.6-.1-1.2-.2-1.7H12z" />
          </svg>
          Continue with Google
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ flex: 1, height: "0.5px", background: "rgba(255,255,255,0.08)" }} />
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", letterSpacing: "0.08em" }}>OR</span>
          <div style={{ flex: 1, height: "0.5px", background: "rgba(255,255,255,0.08)" }} />
        </div>

        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <AuthInput type="text"     placeholder="Display name"             value={name}     onChange={setName}     required />
          <AuthInput type="email"    placeholder="Email address"            value={email}    onChange={setEmail}    required />
          <AuthInput type="tel"      placeholder="Phone  (+254 712 345 678)" value={phone}    onChange={setPhone}    required />
          <AuthInput type="password" placeholder="Password (min 6 chars)"   value={password} onChange={setPassword} required />

          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", lineHeight: 1.6, marginTop: 2 }}>
            Phone is used for M-Pesa payments and match alerts only.
          </p>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 4,
              padding: "13px 0",
              borderRadius: 10,
              border: "none",
              background: "#fff",
              color: "#000",
              fontSize: 14,
              fontWeight: 500,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
              transition: "opacity 0.2s",
              letterSpacing: "-0.01em",
            }}
          >
            {loading ? "Creating account…" : "Create account"}
          </button>

          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", textAlign: "center", lineHeight: 1.6 }}>
            By signing up you agree to our{" "}
            <Link to="/terms" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "underline" }}>Terms</Link>
            {" "}and{" "}
            <Link to="/privacy" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "underline" }}>Privacy Policy</Link>.
          </p>
        </form>

        <p style={{ textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.3)", marginTop: 24 }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#fff", textDecoration: "none", borderBottom: "0.5px solid rgba(255,255,255,0.3)", paddingBottom: 1 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

function AuthInput({ type, placeholder, value, onChange, required }: {
  type: string; placeholder: string; value: string;
  onChange: (v: string) => void; required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type} placeholder={placeholder} value={value}
      onChange={(e) => onChange(e.target.value)} required={required}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{
        padding: "12px 14px", borderRadius: 10,
        border: `0.5px solid ${focused ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.1)"}`,
        background: "rgba(255,255,255,0.04)", color: "#fff", fontSize: 14,
        outline: "none", transition: "border-color 0.2s", fontFamily: '"Inter", sans-serif',
      }}
    />
  );
}
