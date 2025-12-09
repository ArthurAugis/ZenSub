import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background p-6 sm:p-12 font-sans">
            <div className="max-w-3xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
                    <ArrowLeft size={16} />
                    Back to Home
                </Link>

                <h1 className="text-4xl font-bold tracking-tight mb-8">Terms of Service</h1>

                <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
                    <p>Last updated: December 8, 2025</p>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">1. Agreement to Terms</h2>
                        <p>
                            By accessing or using ZenSub, you agree to be bound by these Terms of Service. If you do not agree to these terms,
                            please do not use our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">2. Description of Service</h2>
                        <p>
                            ZenSub provides a subscription management platform allowing users to track their recurring expenses and receive notifications.
                            We do not process payments for your external subscriptions, nor do we cancel them on your behalf.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">3. User Accounts</h2>
                        <p>
                            To access certain features, you must create an account. You represent that the information you provide is accurate
                            and complete. You are responsible for maintaining the confidentiality of your account password.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">4. Intellectual Property</h2>
                        <p>
                            The ZenSub platform and its original content, features, and functionality are owned by ZenSub and are protected by
                            international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">5. Termination</h2>
                        <p>
                            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever,
                            including without limitation if you breach the Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">6. Limitation of Liability</h2>
                        <p>
                            In no event shall ZenSub, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect,
                            incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
