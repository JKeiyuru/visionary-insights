import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FloatingNav } from "@/components/FloatingNav";
import { SiteFooter } from "@/components/SiteFooter";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — VisionPlay" }] }),
  component: AdminPage,
});

/* ── types ── */
type ProfileRow = { id: string; display_name: string | null; phone: string | null; tier: string; subscription_plan: string; is_banned: boolean };
type PlanRow    = { id: string; slug: string; name: string; price_label: string; amount_kes: number; period: string; features: string[]; featured: boolean; sort_order: number; active: boolean };
type ContentRow = { id: string; key: string; title: string; body: string; updated_at: string };
type RoleRow    = { id: string; user_id: string; role: string };
type AdminProfile = ProfileRow & { roles: string[] };

const TIERS = ["bronze", "silver", "gold", "oracle"];
const PLANS = ["free", "weekly", "monthly", "elite"];

/* ── shared style helpers ── */
const S = {
  label:   { fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.3)", marginBottom: 8 },
  input:   { padding: "10px 12px", borderRadius: 8, border: "0.5px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#fff", fontSize: 13, outline: "none", fontFamily: '"Inter", sans-serif', width: "100%" },
  btn:     (accent?: boolean) => ({ padding: "9px 18px", borderRadius: 8, border: accent ? "none" : "0.5px solid rgba(255,255,255,0.12)", background: accent ? "#fff" : "rgba(255,255,255,0.05)", color: accent ? "#000" : "rgba(255,255,255,0.7)", fontSize: 12, cursor: "pointer", fontFamily: '"Inter", sans-serif', transition: "opacity 0.2s" }),
  cell:    { padding: "14px 0", borderBottom: "0.5px solid rgba(255,255,255,0.05)", fontSize: 13, color: "rgba(255,255,255,0.65)", verticalAlign: "top" as const },
  section: { background: "rgba(255,255,255,0.02)", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "24px 28px", marginBottom: 16 },
};

/* ════════════════════════════════════════════════════════════════════ */
function AdminPage() {
  const { user, loading, isAdmin, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"users" | "admins" | "plans" | "content">("users");

  useEffect(() => { if (!loading && !user) navigate({ to: "/login" }); }, [user, loading, navigate]);

  if (loading || !user) return <Spinner />;

  if (!isAdmin) return (
    <Wrap>
      <div style={{ padding: "100px 64px", textAlign: "center" }}>
        <h1 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 32, fontWeight: 300, marginBottom: 12 }}>Admin area</h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>You don't have permission to view this page.</p>
      </div>
    </Wrap>
  );

  const tabs: { key: typeof tab; label: string; show: boolean }[] = [
    { key: "users",   label: "Users",         show: true },
    { key: "admins",  label: "Admins",        show: isSuperAdmin },
    { key: "plans",   label: "Plans",         show: isSuperAdmin },
    { key: "content", label: "Legal content", show: true },
  ];

  return (
    <Wrap>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "100px 64px 80px" }}>
        <p style={S.label}>Admin panel</p>
        <h1 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 36, fontWeight: 300, letterSpacing: "-0.025em", marginBottom: 40 }}>
          {isSuperAdmin ? "Super admin" : "Admin"}
        </h1>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, borderBottom: "0.5px solid rgba(255,255,255,0.07)", marginBottom: 36 }}>
          {tabs.filter(t => t.show).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ background: "none", border: "none", padding: "12px 18px", fontSize: 13, cursor: "pointer", color: tab === t.key ? "#fff" : "rgba(255,255,255,0.35)", borderBottom: tab === t.key ? "1.5px solid #fff" : "1.5px solid transparent", transition: "color 0.2s", fontFamily: '"Inter", sans-serif' }}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === "users"   && <UsersPanel />}
        {tab === "admins"  && isSuperAdmin && <AdminsPanel currentUserId={user.id} />}
        {tab === "plans"   && isSuperAdmin && <PlansPanel />}
        {tab === "content" && <ContentPanel />}
      </div>
    </Wrap>
  );
}

/* ── Users ── */
function UsersPanel() {
  const [rows, setRows] = useState<ProfileRow[]>([]);
  const [q, setQ] = useState("");

  async function load() {
    const { data } = await supabase.from("profiles").select("id,display_name,phone,tier,subscription_plan,is_banned").order("display_name");
    if (data) setRows(data as ProfileRow[]);
  }
  useEffect(() => {
    load();
    const ch = supabase.channel("adm-profiles").on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, load).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  async function update(id: string, patch: Partial<ProfileRow>) {
    const { error } = await supabase.from("profiles").update(patch as never).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Updated"); load(); }
  }

  const filtered = rows.filter(r => !q || r.display_name?.toLowerCase().includes(q.toLowerCase()) || r.phone?.includes(q) || r.id.includes(q));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <input style={{ ...S.input, maxWidth: 280 }} placeholder="Search name, phone or id…" value={q} onChange={e => setQ(e.target.value)} />
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>{filtered.length} accounts</span>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>
              {["User", "Phone", "Tier", "Plan", "Status", ""].map(h => (
                <th key={h} style={{ padding: "8px 12px 12px", textAlign: "left", fontWeight: 400 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id}>
                <td style={S.cell}>
                  <div style={{ fontWeight: 500 }}>{r.display_name ?? "—"}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 2 }}>{r.id.slice(0,8)}…</div>
                </td>
                <td style={{ ...S.cell, color: "rgba(255,255,255,0.4)" }}>{r.phone ?? "—"}</td>
                <td style={S.cell}>
                  <select value={r.tier} onChange={e => update(r.id, { tier: e.target.value })}
                    style={{ ...S.input, width: "auto", padding: "5px 8px" }}>
                    {TIERS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </td>
                <td style={S.cell}>
                  <select value={r.subscription_plan} onChange={e => update(r.id, { subscription_plan: e.target.value })}
                    style={{ ...S.input, width: "auto", padding: "5px 8px" }}>
                    {PLANS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </td>
                <td style={S.cell}>
                  <span style={{ fontSize: 11, color: r.is_banned ? "#f87171" : "#34d399" }}>
                    {r.is_banned ? "Banned" : "Active"}
                  </span>
                </td>
                <td style={S.cell}>
                  <button onClick={() => update(r.id, { is_banned: !r.is_banned })} style={S.btn()}>
                    {r.is_banned ? "Unban" : "Ban"}
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{ padding: "48px 0", textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: 14 }}>No matches</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Admins ── */
function AdminsPanel({ currentUserId }: { currentUserId: string }) {
  const [people, setPeople] = useState<AdminProfile[]>([]);
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const { data: roles } = await supabase.from("user_roles").select("*");
    if (!roles) return;
    const uids = Array.from(new Set((roles as RoleRow[]).map(r => r.user_id)));
    if (!uids.length) { setPeople([]); return; }
    const { data: profs } = await supabase.from("profiles").select("id,display_name,phone,tier,subscription_plan,is_banned").in("id", uids);
    const map = new Map<string, string[]>();
    (roles as RoleRow[]).forEach(r => { const a = map.get(r.user_id) ?? []; a.push(r.role); map.set(r.user_id, a); });
    setPeople(((profs as ProfileRow[]) ?? []).map(p => ({ ...p, roles: map.get(p.id) ?? [] })));
  }
  useEffect(() => {
    load();
    const ch = supabase.channel("adm-roles").on("postgres_changes", { event: "*", schema: "public", table: "user_roles" }, load).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  async function promote() {
    if (!search.trim()) return;
    setBusy(true);
    const { data } = await supabase.from("profiles").select("id").ilike("display_name", `%${search.trim()}%`).limit(2);
    if (!data || data.length === 0) { toast.error("No matching profile."); setBusy(false); return; }
    if (data.length > 1) { toast.error("Multiple matches — be more specific."); setBusy(false); return; }
    const { error } = await supabase.from("user_roles").insert({ user_id: (data[0] as { id: string }).id, role: "admin" });
    setBusy(false);
    if (error) return toast.error(error.message);
    setSearch(""); toast.success("Promoted to admin"); load();
  }

  async function removeRole(userId: string, role: string) {
    const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role as "admin" | "moderator" | "super_admin" | "user");
    if (error) return toast.error(error.message);
    toast.success(`Removed ${role}`); load();
  }

  return (
    <div>
      <div style={S.section}>
        <p style={S.label}>Promote by display name</p>
        <div style={{ display: "flex", gap: 10 }}>
          <input style={{ ...S.input, flex: 1 }} placeholder="Display name…" value={search} onChange={e => setSearch(e.target.value)} />
          <button onClick={promote} disabled={busy} style={S.btn(true)}>
            {busy ? "…" : "Promote to admin"}
          </button>
        </div>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>
            {["User", "Roles", "Status", ""].map(h => <th key={h} style={{ padding: "8px 12px 12px", textAlign: "left", fontWeight: 400 }}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {people.map(p => (
            <tr key={p.id}>
              <td style={S.cell}>
                <div style={{ fontWeight: 500 }}>{p.display_name ?? "—"} {p.id === currentUserId && <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>(you)</span>}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>{p.id.slice(0,8)}…</div>
              </td>
              <td style={{ ...S.cell, fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{p.roles.join(" · ") || "—"}</td>
              <td style={S.cell}><span style={{ fontSize: 11, color: p.is_banned ? "#f87171" : "#34d399" }}>{p.is_banned ? "Suspended" : "Active"}</span></td>
              <td style={S.cell}>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {p.roles.filter(r => r !== "super_admin").map(r => (
                    <button key={r} onClick={() => removeRole(p.id, r)} style={S.btn()}>Remove {r}</button>
                  ))}
                </div>
              </td>
            </tr>
          ))}
          {people.length === 0 && <tr><td colSpan={4} style={{ padding: "48px 0", textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: 14 }}>No admins yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

/* ── Plans ── */
function PlansPanel() {
  const [rows, setRows] = useState<PlanRow[]>([]);
  async function load() {
    const { data } = await supabase.from("plans").select("*").order("sort_order");
    if (data) setRows(data as PlanRow[]);
  }
  useEffect(() => {
    load();
    const ch = supabase.channel("adm-plans").on("postgres_changes", { event: "*", schema: "public", table: "plans" }, load).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  async function save(p: PlanRow) {
    const { error } = await supabase.from("plans").update({ name: p.name, price_label: p.price_label, amount_kes: p.amount_kes, period: p.period, features: p.features, featured: p.featured, sort_order: p.sort_order, active: p.active, updated_at: new Date().toISOString() }).eq("id", p.id);
    if (error) toast.error(error.message); else toast.success(`${p.name} saved`);
  }
  async function add() {
    const slug = prompt("Plan slug (e.g. annual):"); if (!slug) return;
    const { error } = await supabase.from("plans").insert({ slug, name: slug, price_label: "KES 0", amount_kes: 0, period: "/month", features: [], sort_order: rows.length + 1 });
    if (error) toast.error(error.message);
  }
  async function remove(id: string) {
    if (!confirm("Delete this plan?")) return;
    const { error } = await supabase.from("plans").delete().eq("id", id);
    if (error) toast.error(error.message);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
        <button onClick={add} style={S.btn(true)}>+ Add plan</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
        {rows.map(p => <PlanEditor key={p.id} plan={p} onSave={save} onRemove={remove} />)}
      </div>
    </div>
  );
}

function PlanEditor({ plan, onSave, onRemove }: { plan: PlanRow; onSave: (p: PlanRow) => void; onRemove: (id: string) => void }) {
  const [d, setD] = useState(plan);
  useEffect(() => setD(plan), [plan]);
  return (
    <div style={S.section}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>slug: {d.slug}</span>
        <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
          <label style={{ display: "flex", gap: 6, alignItems: "center", cursor: "pointer", color: "rgba(255,255,255,0.5)" }}>
            <input type="checkbox" checked={d.featured} onChange={e => setD({ ...d, featured: e.target.checked })} /> Featured
          </label>
          <label style={{ display: "flex", gap: 6, alignItems: "center", cursor: "pointer", color: "rgba(255,255,255,0.5)" }}>
            <input type="checkbox" checked={d.active} onChange={e => setD({ ...d, active: e.target.checked })} /> Active
          </label>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
        {[
          { label: "Name",        val: d.name,        set: (v: string) => setD({ ...d, name: v }) },
          { label: "Period",      val: d.period,      set: (v: string) => setD({ ...d, period: v }) },
          { label: "Price label", val: d.price_label, set: (v: string) => setD({ ...d, price_label: v }) },
        ].map(f => (
          <div key={f.label}>
            <div style={S.label}>{f.label}</div>
            <input style={S.input} value={f.val} onChange={e => f.set(e.target.value)} />
          </div>
        ))}
        <div>
          <div style={S.label}>Amount (KES)</div>
          <input style={S.input} type="number" value={d.amount_kes} onChange={e => setD({ ...d, amount_kes: Number(e.target.value) })} />
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <div style={S.label}>Features (one per line)</div>
        <textarea rows={4} style={{ ...S.input, resize: "vertical" }} value={(d.features ?? []).join("\n")} onChange={e => setD({ ...d, features: e.target.value.split("\n").filter(Boolean) })} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={() => onRemove(plan.id)} style={S.btn()}>Delete</button>
        <button onClick={() => onSave(d)} style={S.btn(true)}>Save</button>
      </div>
    </div>
  );
}

/* ── Content ── */
function ContentPanel() {
  const [rows, setRows] = useState<ContentRow[]>([]);
  async function load() {
    const { data } = await supabase.from("site_content").select("*").order("key");
    if (data) setRows(data as ContentRow[]);
  }
  useEffect(() => {
    load();
    const ch = supabase.channel("adm-content").on("postgres_changes", { event: "*", schema: "public", table: "site_content" }, load).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  async function save(r: ContentRow) {
    const { error } = await supabase.from("site_content").update({ title: r.title, body: r.body, updated_at: new Date().toISOString() }).eq("id", r.id);
    if (error) toast.error(error.message); else toast.success(`${r.title} saved`);
  }
  async function add() {
    const key = prompt("Content key (e.g. faq):"); if (!key) return;
    const { error } = await supabase.from("site_content").insert({ key, title: key, body: "" });
    if (error) toast.error(error.message);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
        <button onClick={add} style={S.btn(true)}>+ Add document</button>
      </div>
      {rows.map(r => <ContentEditor key={r.id} row={r} onSave={save} />)}
    </div>
  );
}

function ContentEditor({ row, onSave }: { row: ContentRow; onSave: (r: ContentRow) => void }) {
  const [d, setD] = useState(row);
  useEffect(() => setD(row), [row]);
  return (
    <div style={{ ...S.section, marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>/{d.key}</span>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>Updated {new Date(d.updated_at).toLocaleString()}</span>
      </div>
      <input style={{ ...S.input, marginBottom: 10, fontSize: 16 }} value={d.title} onChange={e => setD({ ...d, title: e.target.value })} />
      <textarea rows={12} style={{ ...S.input, fontFamily: "monospace", fontSize: 12, resize: "vertical" }} value={d.body} onChange={e => setD({ ...d, body: e.target.value })} />
      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", margin: "8px 0 14px" }}>
        Supports <code>## Heading</code> and <code>**bold**</code>.
      </p>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={() => onSave(d)} style={S.btn(true)}>Save & broadcast</button>
      </div>
    </div>
  );
}

/* ── shared wrappers ── */
function Wrap({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "#06060a", color: "#fff", minHeight: "100vh", fontFamily: '"Inter", sans-serif' }}>
      <FloatingNav />
      {children}
      <SiteFooter />
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ background: "#06060a", minHeight: "100vh", display: "grid", placeItems: "center", color: "rgba(255,255,255,0.25)", fontSize: 13 }}>
      Loading…
    </div>
  );
}
