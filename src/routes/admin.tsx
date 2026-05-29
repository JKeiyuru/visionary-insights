import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Shield, Users, DollarSign, FileText, Loader2, Trash2, Plus, Crown, Ban, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — VisionPlay" }] }),
  component: AdminPage,
});

/* ----------------------------- Types ----------------------------- */

type PlanRow = {
  id: string; slug: string; name: string; price_label: string;
  amount_kes: number; period: string; features: string[];
  featured: boolean; sort_order: number; active: boolean;
};
type ContentRow = { id: string; key: string; title: string; body: string; updated_at: string };
type ProfileRow = {
  id: string; display_name: string | null; phone: string | null;
  tier: string; subscription_plan: string; is_banned: boolean;
};

function AdminPage() {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [bootstrapping, setBootstrapping] = useState(false);
  const [adminExists, setAdminExists] = useState<boolean | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  // If no admin exists in the system, first signed-in visitor can claim it (one-time bootstrap).
  useEffect(() => {
    if (!user || isAdmin) return;
    // @ts-expect-error user_roles not yet in generated types
    supabase.from("user_roles").select("user_id", { count: "exact", head: true }).eq("role", "admin").then(({ count }) => {
      setAdminExists((count ?? 0) > 0);
    });
  }, [user, isAdmin]);

  async function claimAdmin() {
    if (!user) return;
    setBootstrapping(true);
    // @ts-expect-error user_roles not yet in generated types
    const { error } = await supabase.from("user_roles").insert({ user_id: user.id, role: "admin" });
    setBootstrapping(false);
    if (error) return toast.error(error.message);
    toast.success("You are now the super admin. Reloading…");
    setTimeout(() => window.location.reload(), 600);
  }

  if (loading || !user) {
    return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <main className="mx-auto max-w-md px-4 py-16 text-center">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-accent grid place-items-center">
            <Shield className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="mt-5 font-display text-2xl font-semibold">Admin area</h1>
          {adminExists === false ? (
            <>
              <p className="mt-2 text-sm text-muted-foreground">
                No super admin exists yet. Since this is your platform, claim the role to manage everything.
              </p>
              <Button onClick={claimAdmin} disabled={bootstrapping} className="mt-5 bg-gradient-to-r from-primary to-accent text-primary-foreground border-0">
                {bootstrapping ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Claiming…</> : <><Crown className="h-4 w-4 mr-2" />Claim super admin</>}
              </Button>
            </>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">You don't have permission to view this page.</p>
          )}
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary to-accent grid place-items-center glow-ring">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-semibold">Super admin</h1>
            <p className="text-sm text-muted-foreground">Realtime control of accounts, pricing and legal content.</p>
          </div>
        </motion.div>

        <Tabs defaultValue="users" className="mt-8">
          <TabsList>
            <TabsTrigger value="users"><Users className="h-4 w-4 mr-2" />Users</TabsTrigger>
            <TabsTrigger value="plans"><DollarSign className="h-4 w-4 mr-2" />Plans</TabsTrigger>
            <TabsTrigger value="content"><FileText className="h-4 w-4 mr-2" />Legal content</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-6"><UsersPanel /></TabsContent>
          <TabsContent value="plans" className="mt-6"><PlansPanel /></TabsContent>
          <TabsContent value="content" className="mt-6"><ContentPanel /></TabsContent>
        </Tabs>
      </main>
      <SiteFooter />
    </div>
  );
}

/* ----------------------------- Users ----------------------------- */

const TIERS = ["bronze", "silver", "gold", "oracle"];
const PLANS = ["free", "weekly", "monthly", "elite"];

function UsersPanel() {
  const [rows, setRows] = useState<ProfileRow[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("profiles")
        .select("id,display_name,phone,tier,subscription_plan,is_banned")
        .order("display_name");
      if (data) setRows(data as unknown as ProfileRow[]);
    }
    load();
    const channel = supabase
      .channel("admin-profiles")
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, load)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  async function update(id: string, patch: Partial<ProfileRow>) {
    const { error } = await supabase.from("profiles").update(patch as never).eq("id", id);
    if (error) toast.error(error.message);
    else toast.success("Updated");
  }

  const filtered = rows.filter(r =>
    !q ||
    r.display_name?.toLowerCase().includes(q.toLowerCase()) ||
    r.phone?.includes(q) ||
    r.id.includes(q),
  );

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between gap-2 mb-3">
        <Input placeholder="Search by name, phone or id…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />
        <span className="text-xs text-muted-foreground">{filtered.length} accounts</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase text-muted-foreground">
            <tr className="text-left">
              <th className="py-2 pr-3">User</th>
              <th className="py-2 pr-3">Phone</th>
              <th className="py-2 pr-3">Tier</th>
              <th className="py-2 pr-3">Plan</th>
              <th className="py-2 pr-3">Status</th>
              <th className="py-2 pr-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t border-border/40">
                <td className="py-2 pr-3">
                  <div className="font-medium">{r.display_name ?? "—"}</div>
                  <div className="text-xs text-muted-foreground">{r.id.slice(0, 8)}…</div>
                </td>
                <td className="py-2 pr-3 text-muted-foreground">{r.phone ?? "—"}</td>
                <td className="py-2 pr-3">
                  <select
                    value={r.tier}
                    onChange={(e) => update(r.id, { tier: e.target.value })}
                    className="bg-input rounded-md px-2 py-1 text-xs"
                  >
                    {TIERS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </td>
                <td className="py-2 pr-3">
                  <select
                    value={r.subscription_plan}
                    onChange={(e) => update(r.id, { subscription_plan: e.target.value })}
                    className="bg-input rounded-md px-2 py-1 text-xs"
                  >
                    {PLANS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </td>
                <td className="py-2 pr-3">
                  {r.is_banned
                    ? <span className="inline-flex items-center gap-1 text-xs text-destructive"><Ban className="h-3 w-3" />Banned</span>
                    : <span className="inline-flex items-center gap-1 text-xs text-success"><CheckCircle2 className="h-3 w-3" />Active</span>}
                </td>
                <td className="py-2 pr-3 text-right">
                  <Button size="sm" variant="outline" onClick={() => update(r.id, { is_banned: !r.is_banned })}>
                    {r.is_banned ? "Unban" : "Ban"}
                  </Button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="py-6 text-center text-muted-foreground text-sm">No matches</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ----------------------------- Plans ----------------------------- */

function PlansPanel() {
  const [rows, setRows] = useState<PlanRow[]>([]);

  useEffect(() => {
    async function load() {
      // @ts-expect-error plans not yet in generated types
      const { data } = await supabase.from("plans").select("*").order("sort_order");
      if (data) setRows(data as PlanRow[]);
    }
    load();
    const channel = supabase
      .channel("admin-plans")
      .on("postgres_changes", { event: "*", schema: "public", table: "plans" }, load)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  async function save(p: PlanRow) {
    // @ts-expect-error plans not yet in generated types
    const { error } = await supabase.from("plans").update({
      name: p.name, price_label: p.price_label, amount_kes: p.amount_kes,
      period: p.period, features: p.features, featured: p.featured,
      sort_order: p.sort_order, active: p.active, updated_at: new Date().toISOString(),
    }).eq("id", p.id);
    if (error) toast.error(error.message);
    else toast.success(`${p.name} updated — clients refreshed live`);
  }

  async function remove(id: string) {
    if (!confirm("Delete this plan?")) return;
    // @ts-expect-error plans not yet in generated types
    const { error } = await supabase.from("plans").delete().eq("id", id);
    if (error) toast.error(error.message);
  }

  async function add() {
    const slug = prompt("Plan slug (e.g. annual):");
    if (!slug) return;
    // @ts-expect-error plans not yet in generated types
    const { error } = await supabase.from("plans").insert({
      slug, name: slug, price_label: "KES 0", amount_kes: 0,
      period: "/month", features: [], sort_order: rows.length + 1,
    });
    if (error) toast.error(error.message);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={add} size="sm" className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0">
          <Plus className="h-4 w-4 mr-1" /> Add plan
        </Button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {rows.map((p) => <PlanEditor key={p.id} plan={p} onSave={save} onRemove={remove} />)}
      </div>
    </div>
  );
}

function PlanEditor({ plan, onSave, onRemove }: { plan: PlanRow; onSave: (p: PlanRow) => void; onRemove: (id: string) => void }) {
  const [draft, setDraft] = useState(plan);
  useEffect(() => setDraft(plan), [plan]);

  return (
    <div className="glass rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase text-muted-foreground">slug: {draft.slug}</div>
        <div className="flex items-center gap-2 text-xs">
          Featured
          <Switch checked={draft.featured} onCheckedChange={(v) => setDraft({ ...draft, featured: v })} />
          Active
          <Switch checked={draft.active} onCheckedChange={(v) => setDraft({ ...draft, active: v })} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Name</Label>
          <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
        </div>
        <div>
          <Label className="text-xs">Period</Label>
          <Input value={draft.period} onChange={(e) => setDraft({ ...draft, period: e.target.value })} />
        </div>
        <div>
          <Label className="text-xs">Price label</Label>
          <Input value={draft.price_label} onChange={(e) => setDraft({ ...draft, price_label: e.target.value })} />
        </div>
        <div>
          <Label className="text-xs">Amount (KES)</Label>
          <Input type="number" value={draft.amount_kes} onChange={(e) => setDraft({ ...draft, amount_kes: Number(e.target.value) })} />
        </div>
      </div>
      <div>
        <Label className="text-xs">Features (one per line)</Label>
        <Textarea
          rows={4}
          value={(draft.features ?? []).join("\n")}
          onChange={(e) => setDraft({ ...draft, features: e.target.value.split("\n").filter(Boolean) })}
        />
      </div>
      <div className="flex justify-between gap-2">
        <Button variant="outline" size="sm" onClick={() => onRemove(plan.id)}>
          <Trash2 className="h-4 w-4 mr-1" /> Delete
        </Button>
        <Button size="sm" onClick={() => onSave(draft)} className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0">
          Save & broadcast
        </Button>
      </div>
    </div>
  );
}

/* --------------------------- Legal content --------------------------- */

function ContentPanel() {
  const [rows, setRows] = useState<ContentRow[]>([]);

  useEffect(() => {
    async function load() {
      // @ts-expect-error site_content not yet in generated types
      const { data } = await supabase.from("site_content").select("*").order("key");
      if (data) setRows(data as ContentRow[]);
    }
    load();
    const channel = supabase
      .channel("admin-content")
      .on("postgres_changes", { event: "*", schema: "public", table: "site_content" }, load)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  async function save(r: ContentRow) {
    // @ts-expect-error site_content not yet in generated types
    const { error } = await supabase.from("site_content").update({
      title: r.title, body: r.body, updated_at: new Date().toISOString(),
    }).eq("id", r.id);
    if (error) toast.error(error.message);
    else toast.success(`${r.title} updated — visible on /${r.key} now`);
  }

  async function addDoc() {
    const key = prompt("New content key (e.g. faq, about):");
    if (!key) return;
    // @ts-expect-error site_content not yet in generated types
    const { error } = await supabase.from("site_content").insert({ key, title: key, body: "" });
    if (error) toast.error(error.message);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={addDoc} size="sm" className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0">
          <Plus className="h-4 w-4 mr-1" /> Add document
        </Button>
      </div>
      <div className="space-y-4">
        {rows.map((r) => <ContentEditor key={r.id} row={r} onSave={save} />)}
      </div>
    </div>
  );
}

function ContentEditor({ row, onSave }: { row: ContentRow; onSave: (r: ContentRow) => void }) {
  const [draft, setDraft] = useState(row);
  useEffect(() => setDraft(row), [row]);
  return (
    <div className="glass rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase text-muted-foreground">/{draft.key}</div>
        <span className="text-xs text-muted-foreground">Updated {new Date(draft.updated_at).toLocaleString()}</span>
      </div>
      <Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="font-display text-lg" />
      <Textarea
        rows={12}
        className="font-mono text-xs"
        value={draft.body}
        onChange={(e) => setDraft({ ...draft, body: e.target.value })}
      />
      <p className="text-[11px] text-muted-foreground">
        Supports basic markdown: <code>## Heading</code> and <code>**bold**</code>.
      </p>
      <div className="flex justify-end">
        <Button size="sm" onClick={() => onSave(draft)} className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0">
          Save & broadcast
        </Button>
      </div>
    </div>
  );
}
