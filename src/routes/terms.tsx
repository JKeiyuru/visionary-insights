import { createFileRoute } from "@tanstack/react-router";
import { FloatingNav } from "@/components/FloatingNav";
import { SiteFooter } from "@/components/SiteFooter";
import { LegalContent } from "@/components/LegalContent";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms & Conditions — VisionPlay" }] }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div style={{ background: "#06060a", color: "#fff", minHeight: "100vh", fontFamily: '"Inter", sans-serif' }}>
      <FloatingNav />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "100px 64px 100px" }}>
        <LegalContent contentKey="terms" />
      </div>
      <SiteFooter />
    </div>
  );
}
