"use client";

import { useActionState, useEffect, useState } from "react";
import { updateSubscription, getCategories } from "@/actions/subscription";
import { Loader2, Save } from "lucide-react";

interface EditSubscriptionFormProps {
    subscription: any;
    onSuccess?: () => void;
}

export function EditSubscriptionForm({ subscription, onSuccess }: EditSubscriptionFormProps) {
    const [state, dispatch, isPending] = useActionState(updateSubscription, undefined);
    const [categories, setCategories] = useState<string[]>(
        subscription.category ? [subscription.category] : []
    );

    useEffect(() => {
        if (state?.success && onSuccess) {
            onSuccess();
        }
    }, [state?.success, onSuccess]);

    useEffect(() => {
        getCategories().then(cats => {
            const allCats = new Set([...cats]);
            if (subscription.category) allCats.add(subscription.category);
            setCategories(Array.from(allCats));
        });
    }, [subscription.category]);

    // Format date for input type="date"
    const nextRenewalDate = new Date(subscription.nextRenewalDate).toISOString().split('T')[0];

    return (
        <form action={dispatch} className="space-y-4">
            <input type="hidden" name="id" value={subscription.id} />

            <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <input name="name" id="name" required defaultValue={subscription.name} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="price" className="text-sm font-medium">Price</label>
                    <input name="price" id="price" type="number" step="0.01" required defaultValue={subscription.price} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                </div>
                <div className="space-y-2">
                    <label htmlFor="currency" className="text-sm font-medium">Currency</label>
                    <select name="currency" id="currency" defaultValue={subscription.currency} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="frequencyUnit" className="text-sm font-medium">Repeats Every</label>
                    <div className="flex gap-2">
                        <input
                            name="frequencyValue"
                            type="number"
                            min="1"
                            defaultValue={subscription.frequencyValue}
                            className="flex h-10 w-16 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-center"
                        />
                        <select name="frequencyUnit" id="frequencyUnit" defaultValue={subscription.frequencyUnit} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                            <option value="Monthly">Month(s)</option>
                            <option value="Yearly">Year(s)</option>
                            <option value="Weekly">Week(s)</option>
                            <option value="Daily">Day(s)</option>
                        </select>
                    </div>
                </div>
                <div className="space-y-2">
                    <label htmlFor="nextRenewalDate" className="text-sm font-medium">Next Renewal</label>
                    <input name="nextRenewalDate" id="nextRenewalDate" type="date" required defaultValue={nextRenewalDate} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">Category</label>
                <div className="flex gap-2">
                    <select
                        name="category"
                        id="category"
                        defaultValue={subscription.category || ""}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <option value="">No category</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="website" className="text-sm font-medium">Website (Optional)</label>
                <input name="website" id="website" type="url" defaultValue={subscription.website || ""} placeholder="https://example.com" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>

            <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Description (Optional)</label>
                <textarea name="description" id="description" defaultValue={subscription.description || ""} placeholder="Add some notes..." className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>

            {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

            <button type="submit" disabled={isPending} className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full mt-2">
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
            </button>
        </form>
    );
}
