import { NewVerificationForm } from "@/components/auth/new-verification-form";
import { Suspense } from "react";

export default function NewVerificationPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
            <Suspense>
                <NewVerificationForm />
            </Suspense>
        </div>
    );
}
