"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { newVerification } from "@/actions/new-verification";
import Link from "next/link";

export function NewVerificationForm() {
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const onSubmit = useCallback(() => {
        if (success || error) return;

        if (!token) {
            setError("Missing token!");
            return;
        }

        newVerification(token)
            .then((data) => {
                setSuccess(data.success);
                setError(data.error);
            })
            .catch(() => {
                setError("Something went wrong!");
            })
    }, [token, success, error]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit]);

    return (
        <div className="flex items-center w-full justify-center">
            <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-sm p-8 flex flex-col items-center gap-y-4">
                <h1 className="text-2xl font-semibold">Confirming your verification</h1>
                <p className="text-muted-foreground text-sm">Please wait while we verify your email.</p>

                {!success && !error && (
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                )}

                {success && (
                    <div className="bg-emerald-500/15 p-3 rounded-md flex items-center w-full gap-x-2 text-sm text-emerald-500 justify-center">
                        <p>{success}</p>
                    </div>
                )}

                {error && (
                    <div className="bg-destructive/15 p-3 rounded-md flex items-center w-full gap-x-2 text-sm text-destructive justify-center">
                        <p>{error}</p>
                    </div>
                )}

                <Link href="/login" className="text-sm underline hover:text-primary pt-4">
                    Back to login
                </Link>
            </div>
        </div>
    )
}
