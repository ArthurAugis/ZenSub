"use client";

import { useState, useTransition } from "react";
import { addGlobalRule, deleteRule } from "@/actions/notifications";
import { CustomSelect } from "@/components/ui/custom-select";
import { Loader2, Plus, Trash2, BellRing } from "lucide-react";

export function GlobalRulesSection({ initialRules }: { initialRules: any[] }) {
    const [isPending, startTransition] = useTransition();
    const [value, setValue] = useState(1);
    const [unit, setUnit] = useState("Days");

    const handleAdd = () => {
        startTransition(async () => {
            await addGlobalRule(value, unit);
        });
    };

    const handleDelete = (id: string) => {
        startTransition(async () => {
            await deleteRule(id);
        });
    };

    return (
        <div className="space-y-4">
            {/* List */}
            <div className="grid gap-2">
                {initialRules.length === 0 && (
                    <p className="text-sm text-muted-foreground italic">No global alerts set.</p>
                )}
                {initialRules.map(rule => (
                    <div key={rule.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border">
                        <div className="flex items-center gap-3">
                            <BellRing size={16} className="text-primary" />
                            <span className="font-medium text-sm">
                                {rule.value} {rule.unit} Before
                            </span>
                        </div>
                        <button
                            onClick={() => handleDelete(rule.id)}
                            disabled={isPending}
                            className="text-muted-foreground hover:text-destructive transition-colors p-2 cursor-pointer"
                        >
                            {isPending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                        </button>
                    </div>
                ))}
            </div>

            {/* Add Form */}
            <div className="pt-4 border-t border-border mt-4">
                <label className="text-sm font-medium mb-2 block">Add New Global Alert</label>
                <div className="flex gap-2">
                    <div className="flex items-center border border-input rounded-md bg-background px-3">
                        <span className="text-sm text-muted-foreground mr-2">Before</span>
                        <input
                            type="number"
                            min="1"
                            value={value}
                            onChange={(e) => setValue(parseInt(e.target.value))}
                            className="w-12 h-9 bg-transparent border-none focus:outline-none text-sm text-center"
                        />
                    </div>
                    <CustomSelect
                        value={unit}
                        onChange={setUnit}
                        options={[
                            { label: "Day(s)", value: "Days" },
                            { label: "Week(s)", value: "Weeks" },
                            { label: "Month(s)", value: "Months" },
                            { label: "Year(s)", value: "Years" },
                        ]}
                        className="flex-1 min-w-[120px]"
                    />
                    <button
                        onClick={handleAdd}
                        disabled={isPending}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm font-medium whitespace-nowrap cursor-pointer"
                    >
                        {isPending ? <Loader2 size={16} className="animate-spin" /> : <><Plus size={16} /> Add Alert</>}
                    </button>
                </div>
            </div>
        </div>
    );
}
