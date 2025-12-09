"use client";

import { useActionState, useEffect, useState } from "react";
import { addSubscription, getCategories } from "@/actions/subscription";
import { Loader2, Plus, Minus } from "lucide-react";
import { CustomSelect } from "@/components/ui/custom-select";

export function AddSubscriptionForm({ onSuccess }: { onSuccess?: () => void }) {
    const [state, dispatch, isPending] = useActionState(addSubscription, undefined);
    const [categories, setCategories] = useState<string[]>([]);

    const [currency, setCurrency] = useState("USD");
    const [frequencyUnit, setFrequencyUnit] = useState("Monthly");
    const [category, setCategory] = useState("");

    // Reminders state
    const [reminders, setReminders] = useState<{ value: number; unit: string }[]>([
        { value: 1, unit: 'Days' }
    ]);

    useEffect(() => {
        if (state?.success && onSuccess) {
            onSuccess();
        }
    }, [state?.success, onSuccess]);

    useEffect(() => {
        getCategories().then(cats => {
            setCategories(Array.from(new Set([...cats])));
        });
    }, []);

    const addReminder = () => {
        setReminders([...reminders, { value: 1, unit: 'Days' }]);
    };

    const removeReminder = (index: number) => {
        setReminders(reminders.filter((_, i) => i !== index));
    };

    const updateReminder = (index: number, field: 'value' | 'unit', value: any) => {
        const newReminders = [...reminders];
        newReminders[index] = { ...newReminders[index], [field]: value };
        setReminders(newReminders);
    };

    return (
        <form action={dispatch} className="space-y-4">
            <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <input name="name" id="name" required placeholder="Netflix" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="price" className="text-sm font-medium">Price</label>
                    <input name="price" id="price" type="number" step="0.01" required placeholder="19.99" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                </div>
                <div className="space-y-2">
                    <label htmlFor="currency" className="text-sm font-medium">Currency</label>
                    <CustomSelect
                        name="currency"
                        value={currency}
                        onChange={setCurrency}
                        options={[
                            { label: "USD ($)", value: "USD" },
                            { label: "EUR (€)", value: "EUR" }
                        ]}
                    />
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
                            defaultValue="1"
                            className="flex h-10 w-16 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-center"
                        />
                        <CustomSelect
                            name="frequencyUnit"
                            value={frequencyUnit}
                            onChange={setFrequencyUnit}
                            options={[
                                { label: "Month(s)", value: "Monthly" },
                                { label: "Year(s)", value: "Yearly" },
                                { label: "Week(s)", value: "Weekly" },
                                { label: "Day(s)", value: "Daily" }
                            ]}
                            className="w-full"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label htmlFor="nextRenewalDate" className="text-sm font-medium">Next Renewal</label>
                    <input name="nextRenewalDate" id="nextRenewalDate" type="date" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">Category</label>
                <div className="flex gap-2">
                    <CustomSelect
                        name="category"
                        value={category}
                        onChange={setCategory}
                        options={[
                            { label: "No category", value: "" },
                            ...categories.map(c => ({ label: c, value: c }))
                        ]}
                        placeholder="Select category"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="website" className="text-sm font-medium">Website</label>
                <div className="text-xs text-muted-foreground mb-1">Enter website to auto-fetch logo</div>
                <input name="website" id="website" type="url" placeholder="https://example.com" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Notifications</label>
                <div className="space-y-2">
                    {reminders.map((reminder, index) => (
                        <div key={index} className="flex gap-2 items-center">
                            <span className="text-sm text-muted-foreground w-16">Before</span>
                            <input
                                type="number"
                                min="1"
                                value={reminder.value}
                                onChange={(e) => updateReminder(index, 'value', parseInt(e.target.value))}
                                className="flex h-9 w-16 rounded-md border border-input bg-background px-3 py-1 text-sm text-center"
                            />
                            <CustomSelect
                                value={reminder.unit}
                                onChange={(val) => updateReminder(index, 'unit', val)}
                                options={[
                                    { label: "Day(s)", value: "Days" },
                                    { label: "Week(s)", value: "Weeks" },
                                    { label: "Month(s)", value: "Months" },
                                    { label: "Year(s)", value: "Years" }
                                ]}
                                className="flex-1 min-w-[100px]"
                            />
                            <button type="button" onClick={() => removeReminder(index)} className="text-destructive hover:bg-destructive/10 p-2 rounded-md transition-colors cursor-pointer">
                                <Minus size={16} />
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={addReminder} className="flex items-center gap-1 text-xs text-primary font-medium hover:underline cursor-pointer">
                        <Plus size={14} /> Add Reminder
                    </button>
                </div>
                <input type="hidden" name="reminders" value={JSON.stringify(reminders)} />
            </div>

            <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Description (Optional)</label>
                <textarea name="description" id="description" placeholder="Add some notes..." className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>

            {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

            <button type="submit" disabled={isPending} className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full mt-2 cursor-pointer">
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <><Plus className="mr-2 h-4 w-4" /> Add Subscription</>}
            </button>
        </form>
    );
}
