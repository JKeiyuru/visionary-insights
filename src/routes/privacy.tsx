import { createFileRoute } from "@tanstack/react-router";
import { FloatingNav } from "@/components/FloatingNav";
import { SiteFooter } from "@/components/SiteFooter";
import { LegalContent } from "@/components/LegalContent";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy — VisionPlay" }] }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div style={{ background: "#06060a", color: "#fff", minHeight: "100vh", fontFamily: '"Inter", sans-serif' }}>
      <FloatingNav />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "100px 64px 100px" }}>
        <LegalContent contentKey="privacy" />
      </div>
      <SiteFooter />
    </div>
  );
}
