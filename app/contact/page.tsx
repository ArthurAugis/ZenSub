import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-background p-6 sm:p-12 font-sans relative">
            <div className="max-w-3xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
                    <ArrowLeft size={16} />
                    Back to Home
                </Link>

                <h1 className="text-4xl font-bold tracking-tight mb-8">Contact Us</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <p className="text-lg text-muted-foreground">
                            Have questions, feedback, or need assistance? We're here to help! Reach out to our team using the contact information below.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Email</h3>
                                    <a href="mailto:contact@arthuraugis.fr" className="text-primary hover:underline">contact@arthuraugis.fr</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <ContactForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
