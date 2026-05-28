import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Smartphone, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

/**
 * Forces phone capture on the first session for users whose profile has no phone
 * (typically: Google signups, where the OAuth payload didn't include a number).
 */
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
    const { error } = await supabase
      .from("profiles")
      .update({ phone: cleaned })
      .eq("id", user!.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Phone saved");
    setOpen(false);
  }

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => { /* mandatory: only close after save */ if (!v && phone) setOpen(false); }}>
      <DialogContent className="sm:max-w-md glass-strong" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-accent grid place-items-center mb-2">
            <Smartphone className="h-5 w-5 text-white" />
          </div>
          <DialogTitle className="text-center font-display text-xl">Add your phone</DialogTitle>
          <DialogDescription className="text-center">
            We need it for M-Pesa payments and match alerts. We'll never share it.
          </DialogDescription>
        </DialogHeader>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-2 space-y-3">
          <Label htmlFor="onboarding-phone">Mobile number</Label>
          <Input
            id="onboarding-phone"
            placeholder="+254 712 345 678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Button
            className="w-full bg-gradient-to-r from-primary to-accent text-white border-0"
            onClick={save}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save & continue"}
          </Button>
          <p className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3 w-3" /> Encrypted at rest. Used only for payments and alerts.
          </p>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
