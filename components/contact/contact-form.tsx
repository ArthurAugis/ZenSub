"use client";

import { useActionState, useEffect, useRef } from "react";
import { sendContactEmail } from "@/actions/contact";
import { Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";

export function ContactForm() {
    const [state, dispatch, isPending] = useActionState(sendContactEmail, undefined);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state?.success) {
            formRef.current?.reset();
        }
    }, [state?.success]);

    return (
        <form ref={formRef} action={dispatch} className="space-y-4">
            {state?.error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
                    {state.error}
                </div>
            )}
            {state?.success && (
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-md text-sm text-green-500">
                    Message sent successfully! We'll get back to you soon.
                </div>
            )}

            <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Your name"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="your@email.com"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">Message</label>
                <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    placeholder="How can we help?"
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                ></textarea>
            </div>
            <button
                type="submit"
                disabled={isPending}
                className={cn(
                    "w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2",
                    isPending && "opacity-70 cursor-not-allowed"
                )}
            >
                {isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                    </>
                ) : (
                    <>
                        Send Message <Send className="ml-2 h-4 w-4" />
                    </>
                )}
            </button>
        </form>
    );
}
