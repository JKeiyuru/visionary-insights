import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Row = { title: string; body: string; updated_at: string };

export function LegalContent({ contentKey }: { contentKey: string }) {
  const [row, setRow] = useState<Row | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
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
      .on("postgres_changes", { event: "*", schema: "public", table: "site_content", filter: `key=eq.${contentKey}` }, () => load())
      .subscribe();
    return () => { active = false; supabase.removeChannel(channel); };
  }, [contentKey]);

  if (!row) {
    return (
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", padding: "48px 0" }}>
        Loading…
      </div>
    );
  }

  return (
    <>
      <h1
        style={{
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: "clamp(28px, 4vw, 48px)",
          fontWeight: 300,
          letterSpacing: "-0.03em",
          marginBottom: 10,
        }}
      >
        {row.title}
      </h1>
      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", marginBottom: 48 }}>
        Last updated:{" "}
        {new Date(row.updated_at).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>
      <article
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 0,
        }}
      >
        {renderMarkdown(row.body)}
      </article>
    </>
  );
}

function renderMarkdown(src: string) {
  const blocks = src.split(/\n{2,}/);
  return blocks.map((b, i) => {
    const h2 = b.match(/^##\s+(.*)$/);
    if (h2) {
      return (
        <h2
          key={i}
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: 18,
            fontWeight: 400,
            letterSpacing: "-0.02em",
            color: "#fff",
            marginTop: 40,
            marginBottom: 10,
            paddingTop: 32,
            borderTop: "0.5px solid rgba(255,255,255,0.07)",
          }}
        >
          {h2[1]}
        </h2>
      );
    }
    const parts = b.split(/(\*\*[^*]+\*\*)/g).map((seg, j) =>
      seg.startsWith("**") && seg.endsWith("**") ? (
        <strong key={j} style={{ color: "#fff", fontWeight: 500 }}>
          {seg.slice(2, -2)}
        </strong>
      ) : (
        <span key={j}>{seg}</span>
      ),
    );
    return (
      <p
        key={i}
        style={{
          fontSize: 15,
          lineHeight: 1.75,
          color: "rgba(255,255,255,0.5)",
          marginBottom: 16,
        }}
      >
        {parts}
      </p>
    );
  });
}
