import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy — VisionPlay" }] }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
        <h1 className="font-display text-4xl font-semibold">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mt-1">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-foreground font-display text-xl">1. What We Collect</h2>
            <p>We collect (a) account info (email, name, avatar), (b) usage data (matches viewed, forecasts placed, device/browser metadata), and (c) payment info processed by our payment partners (we do not store card numbers).</p>
          </section>
          <section>
            <h2 className="text-foreground font-display text-xl">2. How We Use Data</h2>
            <p>To operate the service, train and improve our AI models, personalise your experience, send transactional emails, prevent fraud, and comply with legal obligations.</p>
          </section>
          <section>
            <h2 className="text-foreground font-display text-xl">3. Legal Basis</h2>
            <p>We process personal data on the basis of (i) contract (providing the Platform), (ii) legitimate interest (security, analytics), (iii) consent (marketing emails), and (iv) legal obligation.</p>
          </section>
          <section>
            <h2 className="text-foreground font-display text-xl">4. Sharing</h2>
            <p>We share data with vetted processors (hosting, payments, analytics, email delivery, AI providers) under strict contractual safeguards. We never sell your personal data.</p>
          </section>
          <section>
            <h2 className="text-foreground font-display text-xl">5. Cookies</h2>
            <p>We use cookies and similar technologies for authentication, preferences, and analytics. You can control cookies via your browser settings.</p>
          </section>
          <section>
            <h2 className="text-foreground font-display text-xl">6. Data Retention</h2>
            <p>We retain account data for as long as your account is active. You may request deletion at any time. Some records may be retained where required by law (e.g. financial records).</p>
          </section>
          <section>
            <h2 className="text-foreground font-display text-xl">7. Your Rights</h2>
            <p>Depending on your jurisdiction you may have rights to access, correct, delete, restrict, port, or object to processing of your personal data. Contact us to exercise any right.</p>
          </section>
          <section>
            <h2 className="text-foreground font-display text-xl">8. Security</h2>
            <p>We use encryption in transit, row-level access controls, and regular audits. No system is 100% secure — please use a strong, unique password.</p>
          </section>
          <section>
            <h2 className="text-foreground font-display text-xl">9. Children</h2>
            <p>VisionPlay is not intended for users under 18. We do not knowingly collect data from children.</p>
          </section>
          <section>
            <h2 className="text-foreground font-display text-xl">10. International Transfers</h2>
            <p>Your data may be processed outside your country. We rely on appropriate safeguards (e.g. standard contractual clauses) where required.</p>
          </section>
          <section>
            <h2 className="text-foreground font-display text-xl">11. Changes</h2>
            <p>We may update this Policy. We'll notify you of material changes through the Platform or by email.</p>
          </section>
          <section>
            <h2 className="text-foreground font-display text-xl">12. Contact</h2>
            <p>Privacy questions: <a href="mailto:privacy@visionplay.app" className="text-accent">privacy@visionplay.app</a>.</p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
