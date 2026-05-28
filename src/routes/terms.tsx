import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms & Conditions — VisionPlay" }] }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
        <h1 className="font-display text-4xl font-semibold">Terms & Conditions</h1>
        <p className="text-sm text-muted-foreground mt-1">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-invert mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-foreground font-display text-xl">1. Acceptance of Terms</h2>
            <p>By accessing or using VisionPlay ("the Platform"), you agree to be bound by these Terms & Conditions. If you do not agree, please do not use the Platform.</p>
          </section>
          <section>
            <h2 className="text-foreground font-display text-xl">2. Nature of Service</h2>
            <p>VisionPlay is an analytics and entertainment platform that provides AI-generated sports forecasts, statistics, and educational content. VisionPlay is <strong>not a gambling or betting operator</strong>. We do not accept wagers, hold funds for staking, or pay out winnings.</p>
          </section>
          <section>
            <h2 className="text-foreground font-display text-xl">3. Eligibility</h2>
            <p>You must be at least 18 years old (or the legal age of majority in your jurisdiction) to create an account. By signing up you confirm that you meet this requirement.</p>
          </section>
          <section>
            <h2 className="text-foreground font-display text-xl">4. Accounts</h2>
            <p>You are responsible for maintaining the confidentiality of your login credentials and all activities that occur under your account. Notify us immediately of any unauthorised use.</p>
          </section>
          <section>
            <h2 className="text-foreground font-display text-xl">5. Subscriptions & Payments</h2>
            <p>Paid plans (Weekly, Monthly, Elite Season) are billed in advance and auto-renew unless cancelled before the next billing cycle. Refunds are issued at our discretion in accordance with applicable law.</p>
          </section>
          <section>
            <h2 className="text-foreground font-display text-xl">6. No Guarantee of Outcomes</h2>
            <p>All predictions, probabilities, and analyses on the Platform are informational only. Sports are inherently unpredictable. We make no warranty regarding the accuracy of any forecast, and you are solely responsible for any decisions you make based on information provided.</p>
          </section>
          <section>
            <h2 className="text-foreground font-display text-xl">7. Acceptable Use</h2>
            <p>You agree not to: (a) reverse engineer or scrape the Platform, (b) use VisionPlay for any unlawful purpose, (c) attempt to gain unauthorised access to any portion of the service, or (d) abuse, harass, or impersonate other users.</p>
          </section>
          <section>
            <h2 className="text-foreground font-display text-xl">8. Intellectual Property</h2>
            <p>All content, branding, models, and code on VisionPlay are owned by VisionPlay or its licensors and are protected by copyright and other applicable laws.</p>
          </section>
          <section>
            <h2 className="text-foreground font-display text-xl">9. Termination</h2>
            <p>We may suspend or terminate your account at any time for violation of these Terms or for any reason in our sole discretion.</p>
          </section>
          <section>
            <h2 className="text-foreground font-display text-xl">10. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, VisionPlay shall not be liable for any indirect, incidental, special, consequential or punitive damages, or any loss of profits or revenues, arising out of your use of the Platform.</p>
          </section>
          <section>
            <h2 className="text-foreground font-display text-xl">11. Changes</h2>
            <p>We may update these Terms from time to time. Continued use of the Platform after updates constitutes acceptance.</p>
          </section>
          <section>
            <h2 className="text-foreground font-display text-xl">12. Contact</h2>
            <p>Questions? Reach us at <a href="mailto:legal@visionplay.app" className="text-accent">legal@visionplay.app</a>.</p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
