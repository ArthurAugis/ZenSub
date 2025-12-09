"use client";

import { useActionState } from "react";
import { updateSettings } from "@/actions/settings";
import { Loader2, Save } from "lucide-react";
import { currencies } from "@/lib/currency";
import { CustomSelect } from "@/components/ui/custom-select";
import { useState } from "react";

interface SettingsFormProps {
    initialName: string;
    initialCurrency: string;
}

export function SettingsForm({ initialName, initialCurrency }: SettingsFormProps) {
    const [state, dispatch, isPending] = useActionState(updateSettings, undefined);
    const [currency, setCurrency] = useState(initialCurrency);

    return (
        <form action={dispatch} className="space-y-6 max-w-lg">
            {state?.error && (
                <div className="p-3 bg-destuctive/10 text-destructive text-sm rounded-md border border-destructive/20">
                    {state.error}
                </div>
            )}
            {state?.success && (
                <div className="p-3 bg-green-500/10 text-green-500 text-sm rounded-md border border-green-500/20">
                    {state.success}
                </div>
            )}

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Display Name</label>
                    <input
                        name="name"
                        defaultValue={initialName}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Preferred Currency</label>
                    <input type="hidden" name="currency" value={currency} />
                    <CustomSelect
                        value={currency}
                        onChange={setCurrency}
                        options={currencies.map(c => ({
                            label: `${c.code} (${c.symbol})`,
                            value: c.code
                        }))}
                    />
                    <p className="text-xs text-muted-foreground">
                        All subscription prices will be converted to this currency for totals.
                    </p>
                </div>
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 disabled:opacity-50"
            >
                {isPending ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                Save Changes
            </button>
        </form>
    );
}
