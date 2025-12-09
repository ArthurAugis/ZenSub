"use client";

import { useActionState, useEffect, useState } from "react";
import { updateSubscription, getCategories } from "@/actions/subscription";
import { Loader2, Save, Plus, Minus } from "lucide-react";
import { CustomSelect } from "@/components/ui/custom-select";

interface EditSubscriptionFormProps {
    subscription: any;
    onSuccess?: () => void;
}

export function EditSubscriptionForm({ subscription, onSuccess }: EditSubscriptionFormProps) {
    const [state, dispatch, isPending] = useActionState(updateSubscription, undefined);
    const [categories, setCategories] = useState<string[]>(
        subscription.category ? [subscription.category] : []
    );

    const [currency, setCurrency] = useState(subscription.currency || "USD");
    const [frequencyUnit, setFrequencyUnit] = useState(subscription.frequencyUnit || "Monthly");
    const [category, setCategory] = useState(subscription.category || "");
    const [isShared, setIsShared] = useState(subscription.isShared || false);

    const [reminders, setReminders] = useState<{ value: number; unit: string }[]>(
        subscription.notificationRules
            ? subscription.notificationRules
                .filter((r: any) => r.type === 'SPECIFIC')
                .map((r: any) => ({ value: r.value, unit: r.unit }))
            : []
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

    const nextRenewalDate = new Date(subscription.nextRenewalDate).toISOString().split('T')[0];

    return (
        <form action={dispatch} className="space-y-4 text-left">
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
                    <CustomSelect
                        name="currency"
                        value={currency}
                        onChange={setCurrency}
                        options={[
                            { label: "USD ($)", value: "USD" },
                            { label: "EUR (€)", value: "EUR" },
                            { label: "GBP (£)", value: "GBP" }
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
                            defaultValue={subscription.frequencyValue}
                            className="flex h-10 w-20 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-center"
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
                    <input name="nextRenewalDate" id="nextRenewalDate" type="date" required defaultValue={nextRenewalDate} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">Category</label>
                <div className="flex gap-2">
                    <input
                        name="category"
                        defaultValue={category}
                        list="categories-list"
                        placeholder="Select or type..."
                        onChange={(e) => setCategory(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <datalist id="categories-list">
                        {categories.map((c) => (
                            <option key={c} value={c} />
                        ))}
                    </datalist>
                </div>
            </div>

            <div className="flex items-center space-x-2 border p-3 rounded-md bg-muted/20">
                <input
                    type="checkbox"
                    id="isShared"
                    name="isShared"
                    checked={isShared}
                    onChange={(e) => setIsShared(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                />
                <label htmlFor="isShared" className="flex-1 cursor-pointer text-sm font-medium">This is a shared subscription</label>
            </div>

            {isShared && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    <label htmlFor="sharedCount" className="text-sm font-medium">Total People Splitting</label>
                    <input
                        id="sharedCount"
                        name="sharedCount"
                        type="number"
                        min="2"
                        defaultValue={subscription.sharedCount || 2}
                        placeholder="e.g. 2"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <p className="text-xs text-muted-foreground">The price will be divided by this number calculation.</p>
                </div>
            )}

            <div className="space-y-2">
                <label htmlFor="website" className="text-sm font-medium">Website</label>
                <div className="text-xs text-muted-foreground mb-1">Enter website to auto-fetch logo</div>
                <input name="website" id="website" type="url" defaultValue={subscription.website || ""} placeholder="https://example.com" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
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
                <textarea name="description" id="description" defaultValue={subscription.description || ""} placeholder="Add some notes..." className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>

            {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

            <button type="submit" disabled={isPending} className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full mt-2 cursor-pointer">
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
            </button>
        </form >
    );
}
