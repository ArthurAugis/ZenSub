import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { SummaryCards } from "@/components/dashboard/analytics/summary-cards";
import { ChartsSection } from "@/components/dashboard/analytics/charts-section";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function AnalyticsPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const subscriptions = await db.subscription.findMany({
        where: {
            userId: session.user.id,
            status: 'Active'
        }
    });


    let totalMonthly = 0;
    let totalYearly = 0;
    let categoryMap: Record<string, number> = {};

    const currency = subscriptions[0]?.currency || "USD";

    subscriptions.forEach(sub => {
        let monthlyCost = 0;
        let yearlyCost = 0;
        const price = sub.price;
        const unit = sub.frequencyUnit || 'Monthly';
        const val = sub.frequencyValue || 1;

        if (unit === 'Monthly') {
            monthlyCost = price / val;
            yearlyCost = monthlyCost * 12;
        } else if (unit === 'Yearly') {
            yearlyCost = price / val;
            monthlyCost = yearlyCost / 12;
        } else if (unit === 'Weekly') {
            yearlyCost = (price / val) * 52;
            monthlyCost = yearlyCost / 12;
        } else if (unit === 'Daily') {
            yearlyCost = (price / val) * 365;
            monthlyCost = yearlyCost / 12;
        }

        totalMonthly += monthlyCost;
        totalYearly += yearlyCost;

        const catName = sub.category || "Uncategorized";
        categoryMap[catName] = (categoryMap[catName] || 0) + monthlyCost;
    });

    const avgCost = subscriptions.length > 0 ? totalMonthly / subscriptions.length : 0;

    let topCategory = { name: "N/A", amount: 0 };
    Object.entries(categoryMap).forEach(([name, amount]) => {
        if (amount > topCategory.amount) {
            topCategory = { name, amount };
        }
    });

    const categoryData = Object.entries(categoryMap)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

    const today = new Date();
    const projectionData = Array.from({ length: 12 }, (_, i) => {
        const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
        return {
            name: d.toLocaleString('en-US', { month: 'short' }),
            fullName: d.toLocaleString('en-US', { month: 'long', year: 'numeric' }),
            monthIndex: d.getMonth(),
            year: d.getFullYear(),
            value: 0
        };
    });

    subscriptions.forEach(sub => {

        const price = sub.price;
        const unit = sub.frequencyUnit || 'Monthly';
        const val = sub.frequencyValue || 1;

        projectionData.forEach(slot => {
            let costInThisMonth = 0;

            if (unit === 'Monthly') {
                costInThisMonth = price / val;
            } else if (unit === 'Yearly') {
                const renewalDate = new Date(sub.nextRenewalDate);
                if (renewalDate.getMonth() === slot.monthIndex) {
                    costInThisMonth = price;
                }
            } else if (unit === 'Weekly') {
                costInThisMonth = price * 4.33 / val;
            } else if (unit === 'Daily') {
                costInThisMonth = price * 30 / val;
            }

            slot.value += costInThisMonth;
        });
    });

    return (
        <div className="min-h-screen bg-background p-6 sm:p-8 font-sans">
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
                        <p className="text-muted-foreground text-sm">Insights into your subscription spending</p>
                    </div>
                </div>

                <SummaryCards
                    totalMonthly={totalMonthly}
                    totalYearly={totalYearly}
                    avgCost={avgCost}
                    topCategory={topCategory}
                    currency={currency}
                />

                <ChartsSection
                    categoryData={categoryData}
                    projectionData={projectionData}
                    currency={currency}
                />
            </div>
        </div>
    );
}
