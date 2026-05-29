import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Row = { title: string; body: string; updated_at: string };

/** Renders an admin-editable legal/markdown-ish document with realtime sync. */
export function LegalContent({ contentKey }: { contentKey: string }) {
  const [row, setRow] = useState<Row | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      // @ts-expect-error - site_content not yet in generated types
      const { data } = await supabase
        .from("site_content")
        .select("title,body,updated_at")
        .eq("key", contentKey)
        .maybeSingle();
      if (active && data) setRow(data as Row);
    }
    load();

    const channel = supabase
      .channel(`site_content:${contentKey}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_content", filter: `key=eq.${contentKey}` },
        () => load(),
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [contentKey]);

  if (!row) {
    return <div className="text-sm text-muted-foreground">Loading…</div>;
  }

  return (
    <>
      <h1 className="font-display text-4xl font-semibold">{row.title}</h1>
      <p className="text-sm text-muted-foreground mt-1">
        Last updated: {new Date(row.updated_at).toLocaleDateString()}
      </p>
      <article className="mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground">
        {renderMarkdown(row.body)}
      </article>
    </>
  );
}

/* Tiny markdown renderer (## headings, **bold**, paragraphs). Avoids
   pulling in a full markdown lib for what is essentially editable legalese. */
function renderMarkdown(src: string) {
  const blocks = src.split(/\n{2,}/);
  return blocks.map((b, i) => {
    const h2 = b.match(/^##\s+(.*)$/);
    if (h2) return <h2 key={i} className="text-foreground font-display text-xl mt-6">{h2[1]}</h2>;
    const parts = b.split(/(\*\*[^*]+\*\*)/g).map((seg, j) =>
      seg.startsWith("**") && seg.endsWith("**")
        ? <strong key={j} className="text-foreground">{seg.slice(2, -2)}</strong>
        : <span key={j}>{seg}</span>
    );
    return <p key={i}>{parts}</p>;
  });
}
