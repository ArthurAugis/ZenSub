"use client";

import { useActionState, useEffect } from "react";
import { createCategory } from "@/actions/category";
import { Loader2, Plus } from "lucide-react";

export function AddCategoryForm({ onSuccess }: { onSuccess?: () => void }) {
    const [state, dispatch, isPending] = useActionState(createCategory, undefined);

    useEffect(() => {
        if (state?.success && onSuccess) {
            onSuccess();
        }
    }, [state?.success, onSuccess]);

    return (
        <form action={dispatch} className="space-y-4">
            <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Category Name</label>
                <input name="name" id="name" required placeholder="e.g. Streaming, Gym..." className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>

            {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
            {state?.success && <p className="text-sm text-emerald-500">{state.success}</p>}

            <button type="submit" disabled={isPending} className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 w-full mt-2">
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <><Plus className="mr-2 h-4 w-4" /> Create Category</>}
            </button>
        </form>
    );
}
