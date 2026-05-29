import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, CreditCard, Check, Loader2, Lock, Shield, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [defaultPhone, setDefaultPhone] = useState<string>("");
  const [phone, setPhone] = useState("");
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState<"idle" | "processing" | "success">("idle");

  // Load default M-Pesa phone from the user's profile (set at signup or by PhoneOnboarding).
  useEffect(() => {
    if (!user || !open) return;
    supabase
      .from("profiles")
      .select("phone")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        const p = data?.phone ?? "";
        setDefaultPhone(p);
        setPhone(p);
        setEditing(!p); // if no profile phone, force edit
      });
  }, [user, open]);

  async function recordAttempt(provider: string, payPhone?: string) {
    if (!user || !plan) return;
    await supabase.from("payments").insert({
      user_id: user.id,
      provider,
      plan: plan.name.toLowerCase(),
      amount_kes: plan.amount,
      status: "pending",
      phone: payPhone ?? null,
      reference: `VP-${Date.now()}`,
    });
  }

  async function payMpesa() {
    const norm = normalize(phone);
    if (!norm) {
      toast.error("Enter a valid Safaricom number, e.g. 0712 345 678");
      return;
    }
    setStatus("processing");
    await recordAttempt("mpesa", norm);
    // Placeholder STK-push simulation (real Daraja integration added when keys arrive)
    setTimeout(() => {
      setStatus("success");
      toast.success(`STK push sent to ${norm}. Approve on your phone (demo).`);
    }, 2200);
  }

  async function payCard() {
    setStatus("processing");
    await recordAttempt("card");
    setTimeout(() => {
      setStatus("success");
      toast.success("Payment authorized (demo). Stripe will go live once keys are set.");
    }, 1800);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setStatus("idle"); }}>
      <DialogContent className="sm:max-w-md glass-strong border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            Upgrade to <span className="text-gradient">{plan?.name}</span>
          </DialogTitle>
          <DialogDescription>
            {plan?.price} {plan?.period} · cancel anytime
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-10 text-center"
            >
              <div className="mx-auto h-14 w-14 rounded-full bg-success/20 grid place-items-center">
                <Check className="h-7 w-7 text-success" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">Request received</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                We'll activate your {plan?.name} plan as soon as payment confirms.
              </p>
              <Button className="mt-5" onClick={() => onOpenChange(false)}>Done</Button>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Tabs defaultValue="mpesa" className="mt-2">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="mpesa"><Smartphone className="h-4 w-4 mr-2" />M-Pesa</TabsTrigger>
                  <TabsTrigger value="card"><CreditCard className="h-4 w-4 mr-2" />Card</TabsTrigger>
                </TabsList>

                <TabsContent value="mpesa" className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="mpesa-phone">M-Pesa number</Label>
                    {!editing && defaultPhone && (
                      <button
                        type="button"
                        onClick={() => setEditing(true)}
                        className="text-xs text-accent hover:underline flex items-center gap-1"
                      >
                        <Pencil className="h-3 w-3" /> Use a different number
                      </button>
                    )}
                  </div>
                  <Input
                    id="mpesa-phone"
                    placeholder="0712 345 678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={status === "processing" || (!editing && !!defaultPhone)}
                  />
                  {!editing && defaultPhone && (
                    <p className="text-[11px] text-muted-foreground">
                      Using your account number. You can switch to a one-off number above.
                    </p>
                  )}
                  <Button
                    className="w-full bg-success text-success-foreground hover:bg-success/90"
                    onClick={payMpesa}
                    disabled={status === "processing"}
                  >
                    {status === "processing" ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Sending STK push…</>
                    ) : (
                      <>Pay {plan?.price} via M-Pesa</>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    You'll receive a prompt on your phone to authorize the payment.
                  </p>
                </TabsContent>

                <TabsContent value="card" className="mt-4 space-y-3">
                  <div>
                    <Label htmlFor="card-num">Card number</Label>
                    <Input id="card-num" placeholder="4242 4242 4242 4242" disabled={status === "processing"} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="exp">Expiry</Label>
                      <Input id="exp" placeholder="MM / YY" disabled={status === "processing"} />
                    </div>
                    <div>
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="123" disabled={status === "processing"} />
                    </div>
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground border-0"
                    onClick={payCard}
                    disabled={status === "processing"}
                  >
                    {status === "processing" ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Authorizing…</>
                    ) : (
                      <><Lock className="h-4 w-4 mr-2" />Pay {plan?.price}</>
                    )}
                  </Button>
                </TabsContent>
              </Tabs>

              <div className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground justify-center">
                <Shield className="h-3 w-3" /> Encrypted · PCI-DSS · Powered by Lovable Cloud
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
