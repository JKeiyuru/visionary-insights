import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Shield, Users, DollarSign, FileText, Loader2, Trash2, Plus, Crown, Ban, CheckCircle2, UserCog, ShieldOff } from "lucide-react";

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
  const { user, loading, isAdmin, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const [bootstrapping, setBootstrapping] = useState(false);
  const [superAdminExists, setSuperAdminExists] = useState<boolean | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  // If no super admin exists yet, first signed-in visitor can claim it.
  useEffect(() => {
    if (!user || isSuperAdmin) return;
    supabase.from("user_roles").select("user_id", { count: "exact", head: true }).eq("role", "super_admin").then(({ count }) => {
      setSuperAdminExists((count ?? 0) > 0);
    });
  }, [user, isSuperAdmin]);

  async function claimSuperAdmin() {
    if (!user) return;
    setBootstrapping(true);
    const { error } = await supabase.from("user_roles").insert({ user_id: user.id, role: "super_admin" });
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
          {superAdminExists === false ? (
            <>
              <p className="mt-2 text-sm text-muted-foreground">
                No super admin exists yet. Claim it to manage the platform. Promote others from the database, then they can sign in as admins here.
              </p>
              <Button onClick={claimSuperAdmin} disabled={bootstrapping} className="mt-5 bg-gradient-to-r from-primary to-accent text-primary-foreground border-0">
                {bootstrapping ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Claiming…</> : <><Crown className="h-4 w-4 mr-2" />Claim super admin</>}
              </Button>
            </>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              You don't have permission to view this page. Ask a super admin (or your database administrator) to promote your account.
            </p>
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
            {isSuperAdmin ? <Crown className="h-5 w-5 text-primary-foreground" /> : <Shield className="h-5 w-5 text-primary-foreground" />}
          </div>
          <div>
            <h1 className="font-display text-3xl font-semibold">
              {isSuperAdmin ? "Super admin" : "Admin"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isSuperAdmin ? "Full control of accounts, admins, pricing, content." : "Manage predictions, content and assigned users."}
            </p>
          </div>
        </motion.div>

        <Tabs defaultValue="users" className="mt-8">
          <TabsList>
            <TabsTrigger value="users"><Users className="h-4 w-4 mr-2" />Users</TabsTrigger>
            {isSuperAdmin && <TabsTrigger value="admins"><UserCog className="h-4 w-4 mr-2" />Admins</TabsTrigger>}
            {isSuperAdmin && <TabsTrigger value="plans"><DollarSign className="h-4 w-4 mr-2" />Plans</TabsTrigger>}
            <TabsTrigger value="content"><FileText className="h-4 w-4 mr-2" />Legal content</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-6"><UsersPanel /></TabsContent>
          {isSuperAdmin && <TabsContent value="admins" className="mt-6"><AdminsPanel currentUserId={user.id} /></TabsContent>}
          {isSuperAdmin && <TabsContent value="plans" className="mt-6"><PlansPanel /></TabsContent>}
          <TabsContent value="content" className="mt-6"><ContentPanel /></TabsContent>
        </Tabs>
      </main>
      <SiteFooter />
    </div>
  );
}

/* ----------------------------- Admins panel ----------------------------- */

type RoleRow = { id: string; user_id: string; role: string };
type AdminProfile = ProfileRow & { roles: string[] };

function AdminsPanel({ currentUserId }: { currentUserId: string }) {
  const [people, setPeople] = useState<AdminProfile[]>([]);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const { data: roles } = await supabase.from("user_roles").select("*");
    if (!roles) return;
    const uids = Array.from(new Set((roles as RoleRow[]).map(r => r.user_id)));
    if (uids.length === 0) { setPeople([]); return; }
    const { data: profs } = await supabase
      .from("profiles")
      .select("id,display_name,phone,tier,subscription_plan,is_banned")
      .in("id", uids);
    const map = new Map<string, string[]>();
    (roles as RoleRow[]).forEach(r => {
      const arr = map.get(r.user_id) ?? [];
      arr.push(r.role);
      map.set(r.user_id, arr);
    });
    setPeople(((profs as ProfileRow[]) ?? []).map(p => ({ ...p, roles: map.get(p.id) ?? [] })));
  }

  useEffect(() => {
    load();
    const ch = supabase.channel("admin-roles")
      .on("postgres_changes", { event: "*", schema: "public", table: "user_roles" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  async function promoteByName() {
    if (!email.trim()) return;
    setBusy(true);
    // Lookup by display_name (since auth.users is not directly queryable from client)
    const { data: matches } = await supabase
      .from("profiles")
      .select("id,display_name")
      .ilike("display_name", `%${email.trim()}%`)
      .limit(2);
    if (!matches || matches.length === 0) { setBusy(false); return toast.error("No matching profile. Ask the user to sign up first."); }
    if (matches.length > 1) { setBusy(false); return toast.error("More than one match — refine the search."); }
    const target = matches[0] as { id: string };
    const { error } = await supabase.from("user_roles").insert({ user_id: target.id, role: "admin" });
    setBusy(false);
    if (error) return toast.error(error.message);
    setEmail("");
    toast.success("Promoted to admin");
  }

  async function setRole(userId: string, role: "admin" | "moderator" | "super_admin", give: boolean) {
    if (userId === currentUserId && role === "super_admin" && !give) {
      return toast.error("You can't remove your own super admin role.");
    }
    if (give) {
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
      if (error) return toast.error(error.message);
      toast.success(`Granted ${role}`);
    } else {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role);
      if (error) return toast.error(error.message);
      toast.success(`Removed ${role}`);
    }
  }

  async function toggleSuspend(p: AdminProfile) {
    const { error } = await supabase.from("profiles").update({ is_banned: !p.is_banned }).eq("id", p.id);
    if (error) return toast.error(error.message);
    toast.success(p.is_banned ? "Account restored" : "Account suspended");
    load();
  }

  return (
    <div className="space-y-4">
      <div className="glass rounded-2xl p-4">
        <h3 className="font-display text-lg font-semibold">Promote a user to admin</h3>
        <p className="text-xs text-muted-foreground mt-1">
          The user must have signed up first. Search by display name, then promote. (Super admin promotion happens directly in the database for safety.)
        </p>
        <div className="mt-3 flex gap-2">
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Display name search…" className="flex-1" />
          <Button onClick={promoteByName} disabled={busy} className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4 mr-1" />Promote</>}
          </Button>
        </div>
      </div>

      <div className="glass rounded-2xl p-4">
        <h3 className="font-display text-lg font-semibold">Privileged accounts</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-muted-foreground">
              <tr className="text-left">
                <th className="py-2 pr-3">User</th>
                <th className="py-2 pr-3">Roles</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {people.map((p) => {
                const isSuper = p.roles.includes("super_admin");
                const isAdminRow = p.roles.includes("admin");
                const isMod = p.roles.includes("moderator");
                return (
                  <tr key={p.id} className="border-t border-border/40">
                    <td className="py-2 pr-3">
                      <div className="font-medium flex items-center gap-1">
                        {isSuper && <Crown className="h-3 w-3 text-accent" />}
                        {p.display_name ?? "—"}
                        {p.id === currentUserId && <span className="text-[10px] text-muted-foreground">(you)</span>}
                      </div>
                      <div className="text-xs text-muted-foreground">{p.id.slice(0, 8)}…</div>
                    </td>
                    <td className="py-2 pr-3 text-xs">
                      {p.roles.length === 0 ? <span className="text-muted-foreground">none</span> : p.roles.join(" · ")}
                    </td>
                    <td className="py-2 pr-3">
                      {p.is_banned
                        ? <span className="inline-flex items-center gap-1 text-xs text-destructive"><Ban className="h-3 w-3" />Suspended</span>
                        : <span className="inline-flex items-center gap-1 text-xs text-success"><CheckCircle2 className="h-3 w-3" />Active</span>}
                    </td>
                    <td className="py-2 pr-3 text-right space-x-1">
                      {!isAdminRow && !isSuper && (
                        <Button size="sm" variant="outline" onClick={() => setRole(p.id, "admin", true)}>Make admin</Button>
                      )}
                      {isAdminRow && !isSuper && (
                        <Button size="sm" variant="outline" onClick={() => setRole(p.id, "admin", false)}>
                          <ShieldOff className="h-3 w-3 mr-1" />Demote
                        </Button>
                      )}
                      {!isMod && !isSuper && (
                        <Button size="sm" variant="ghost" onClick={() => setRole(p.id, "moderator", true)}>+ Mod</Button>
                      )}
                      {!isSuper && (
                        <Button size="sm" variant={p.is_banned ? "outline" : "destructive"} onClick={() => toggleSuspend(p)}>
                          {p.is_banned ? "Restore" : "Suspend"}
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {people.length === 0 && (
                <tr><td colSpan={4} className="py-6 text-center text-muted-foreground text-sm">No admins or moderators yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
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
    const { error } = await supabase.from("plans").delete().eq("id", id);
    if (error) toast.error(error.message);
  }

  async function add() {
    const slug = prompt("Plan slug (e.g. annual):");
    if (!slug) return;
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
    const { error } = await supabase.from("site_content").update({
      title: r.title, body: r.body, updated_at: new Date().toISOString(),
    }).eq("id", r.id);
    if (error) toast.error(error.message);
    else toast.success(`${r.title} updated — visible on /${r.key} now`);
  }

  async function addDoc() {
    const key = prompt("New content key (e.g. faq, about):");
    if (!key) return;
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
