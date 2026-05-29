import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { LegalContent } from "@/components/LegalContent";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms & Conditions — VisionPlay" }] }),
  component: TermsPage,
});

function TermsPage() {
  const [tick, setTick] = useState(0); // forces LegalContent to re-render on realtime updates
  useEffect(() => setTick((t) => t + 1), []);
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
        <LegalContent key={tick} contentKey="terms" />
      </main>
      <SiteFooter />
    </div>
  );
}
