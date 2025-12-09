import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background p-6 sm:p-12 font-sans relative">
            <div className="max-w-3xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
                    <ArrowLeft size={16} />
                    Back to Home
                </Link>

                <h1 className="text-4xl font-bold tracking-tight mb-8">Privacy Policy</h1>

                <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
                    <p>Last updated: December 8, 2025</p>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">1. Introduction</h2>
                        <p>
                            Welcome to ZenSub ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data.
                            This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you
                            about your privacy rights and how the law protects you.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">2. Data We Collect</h2>
                        <p>
                            We collect data to provide the best experience for our users. This may include:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Identity Data (e.g., name, username).</li>
                            <li>Contact Data (e.g., email address).</li>
                            <li>Subscription Data (e.g., services you track, costs, renewal dates).</li>
                            <li>Technical Data (e.g., IP address, browser type).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">3. How We Use Your Data</h2>
                        <p>
                            We will only use your personal data when the law allows us to. Most commonly, we use your personal data to:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Provide and manage your subscription tracking service.</li>
                            <li>Send you renewal notifications and reminders.</li>
                            <li>Improve our website and services.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">4. Data Security</h2>
                        <p>
                            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used,
                            or accessed in an unauthorized way. We limit access to your personal data to those employees and partners who have a business need to know.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">5. Contact Us</h2>
                        <p>
                            If you have generic questions about this policy, please contact us at <a href="mailto:contact@arthuraugis.fr" className="text-primary hover:underline">contact@arthuraugis.fr</a>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
