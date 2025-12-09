"use client";

import { useState, useTransition } from "react";
import { Loader2, Plus, Trash2, Bell, Check, X } from "lucide-react";
import { addSpecificRule } from "@/actions/notifications";
import { deleteRule } from "@/actions/notifications";
import { CustomSelect } from "@/components/ui/custom-select";

interface SpecificRulesListProps {
    rules: any[];
    subscriptions: any[];
}

export function SpecificRulesList({ rules, subscriptions }: SpecificRulesListProps) {
    const [isPending, startTransition] = useTransition();
    const [isAdding, setIsAdding] = useState(false);

    const [value, setValue] = useState(1);
    const [unit, setUnit] = useState("Days");
    const [selectedSubIds, setSelectedSubIds] = useState<string[]>([]);

    const handleToggleSub = (id: string) => {
        if (selectedSubIds.includes(id)) {
            setSelectedSubIds(selectedSubIds.filter(s => s !== id));
        } else {
            setSelectedSubIds([...selectedSubIds, id]);
        }
    };

    const handleAdd = () => {
        if (selectedSubIds.length === 0) return;
        startTransition(async () => {
            await addSpecificRule(value, unit, selectedSubIds);
            setIsAdding(false);
            setValue(1);
            setUnit("Days");
            setSelectedSubIds([]);
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
            <div className="space-y-3">
                {rules.length === 0 && !isAdding && (
                    <p className="text-sm text-muted-foreground italic">No specific alerts set.</p>
                )}
                {rules.map(rule => (
                    <div key={rule.id} className="bg-card border border-border rounded-lg p-4 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Bell size={16} className="text-primary" />
                                    <span className="font-semibold text-sm">{rule.value} {rule.unit} Before</span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    Applied to:
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {rule.subscriptions.map((sub: any) => (
                                            <span key={sub.id} className="bg-muted px-2 py-0.5 rounded-full text-foreground border border-border/50">
                                                {sub.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(rule.id)}
                                disabled={isPending}
                                className="text-muted-foreground hover:text-destructive transition-colors p-2 cursor-pointer"
                            >
                                {isPending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Button / Form */}
            {!isAdding ? (
                <button
                    onClick={() => setIsAdding(true)}
                    className="w-full py-3 border border-dashed border-border rounded-lg text-sm text-muted-foreground hover:bg-muted/30 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                    <Plus size={16} /> Create Group Alert
                </button>
            ) : (
                <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
                    <h3 className="font-semibold text-sm mb-3">New Group Alert</h3>

                    <div className="flex gap-2 mb-4">
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
                            className="flex-1"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">Select Subscriptions</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[200px] overflow-y-auto pr-2">
                            {subscriptions.map(sub => (
                                <button
                                    key={sub.id}
                                    onClick={() => handleToggleSub(sub.id)}
                                    className={`text-left px-3 py-2 rounded-md text-sm border flex items-center justify-between transition-all cursor-pointer ${selectedSubIds.includes(sub.id)
                                        ? 'bg-primary/10 border-primary text-primary'
                                        : 'bg-background border-input hover:bg-muted'
                                        }`}
                                >
                                    <span className="truncate">{sub.name}</span>
                                    {selectedSubIds.includes(sub.id) && <Check size={14} />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setIsAdding(false)}
                            disabled={isPending}
                            className="px-4 py-2 rounded-md text-sm font-medium hover:bg-muted transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAdd}
                            disabled={isPending || selectedSubIds.length === 0}
                            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm font-medium cursor-pointer"
                        >
                            {isPending ? <Loader2 size={16} className="animate-spin" /> : "Create Alert"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
