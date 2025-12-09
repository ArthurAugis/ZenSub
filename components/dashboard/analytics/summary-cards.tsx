"use client";

import { CreditCard, TrendingUp, DollarSign, Award } from "lucide-react";

interface SummaryCardsProps {
    totalMonthly: number;
    totalYearly: number;
    avgCost: number;
    topCategory: { name: string; amount: number };
    currency: string;
}

export function SummaryCards({ totalMonthly, totalYearly, avgCost, topCategory, currency }: SummaryCardsProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(amount);
    };

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col justify-between hover:border-primary/20 transition-colors">
                <div className="flex justify-between items-start mb-2">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <CreditCard size={18} />
                    </div>
                </div>
                <div>
                    <div className="text-2xl font-bold tracking-tight">{formatCurrency(totalMonthly)}</div>
                    <div className="text-xs text-muted-foreground font-medium mt-1">Monthly Spend</div>
                </div>
            </div>

            <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col justify-between hover:border-primary/20 transition-colors">
                <div className="flex justify-between items-start mb-2">
                    <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                        <DollarSign size={18} />
                    </div>
                </div>
                <div>
                    <div className="text-2xl font-bold tracking-tight">{formatCurrency(totalYearly)}</div>
                    <div className="text-xs text-muted-foreground font-medium mt-1">Yearly Projection</div>
                </div>
            </div>

            <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col justify-between hover:border-primary/20 transition-colors">
                <div className="flex justify-between items-start mb-2">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                        <TrendingUp size={18} />
                    </div>
                </div>
                <div>
                    <div className="text-2xl font-bold tracking-tight">{formatCurrency(avgCost)}</div>
                    <div className="text-xs text-muted-foreground font-medium mt-1">Average Cost</div>
                </div>
            </div>

            <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col justify-between hover:border-primary/20 transition-colors">
                <div className="flex justify-between items-start mb-2">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                        <Award size={18} />
                    </div>
                </div>
                <div>
                    <div className="text-xl font-bold tracking-tight truncate" title={topCategory.name || 'N/A'}>
                        {topCategory.name || 'N/A'}
                    </div>
                    <div className="text-xs text-muted-foreground font-medium mt-1">
                        Top Category ({formatCurrency(topCategory.amount)})
                    </div>
                </div>
            </div>
        </div>
    );
}
