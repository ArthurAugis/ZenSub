import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { SubscriptionList } from "@/components/dashboard/subscription-list";
import { AddSubscriptionButton } from "@/components/dashboard/add-subscription-button";
import { AddCategoryButton } from "@/components/dashboard/add-category-button";
import { db } from "@/lib/db";
import { PieChart, CheckCircle2, Bell, LogOut } from "lucide-react";

export default async function DashboardPage() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    const subscriptions = await db.subscription.findMany({
        where: { userId: session.user?.id },
        orderBy: { nextRenewalDate: 'asc' }
    });

    const totalMonthlySpend = subscriptions.reduce((acc, sub) => {
        let monthly = sub.price;
        const unit = sub.frequencyUnit || 'Monthly';
        const val = sub.frequencyValue || 1;

        if (unit === 'Yearly') monthly = sub.price / (12 * val);
        else if (unit === 'Monthly') monthly = sub.price / val;
        else if (unit === 'Weekly') monthly = (sub.price * 52) / (12 * val);
        else if (unit === 'Daily') monthly = (sub.price * 365) / (12 * val);

        return acc + monthly;
    }, 0);

    const activeSubscriptions = subscriptions.filter(s => s.status === 'Active').length;

    let nextRenewalDays = "N/A";
    let daysUntil = 0;
    if (subscriptions.length > 0) {
        const nextDate = new Date(subscriptions[0].nextRenewalDate);
        const today = new Date();
        const diffTime = Math.abs(nextDate.getTime() - today.getTime());
        daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        nextRenewalDays = `${daysUntil} Days`;
    }

    const isUrgent = daysUntil <= 3 && subscriptions.length > 0;

    return (
        <div className="min-h-screen bg-background p-6 sm:p-8 font-sans">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                        <p className="text-muted-foreground text-sm">Welcome back, {session.user?.name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <AddCategoryButton />
                        <AddSubscriptionButton />
                        <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}>
                            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-destructive transition-colors bg-card border border-border rounded-md hover:bg-muted h-9">
                                <LogOut size={16} />
                            </button>
                        </form>
                    </div>
                </div>

                <div className="flex flex-col gap-6">

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {/* Card 1: Total Spend */}
                        <div className="bg-card rounded-xl border border-border p-4 flex flex-col justify-between shadow-sm hover:border-primary/20 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <PieChart size={18} />
                                </div>
                                <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-full">Monthly</span>
                            </div>
                            <div>
                                <div className="text-2xl font-bold tracking-tight">${totalMonthlySpend.toFixed(0)}</div>
                                <div className="text-xs text-muted-foreground font-medium mt-1">Total Monthly Spend</div>
                            </div>
                        </div>

                        {/* Card 2: Active Subs */}
                        <div className="bg-card rounded-xl border border-border p-4 flex flex-col justify-between shadow-sm hover:border-primary/20 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                                    <CheckCircle2 size={18} />
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold tracking-tight">{activeSubscriptions}</div>
                                <div className="text-xs text-muted-foreground font-medium mt-1">Active Subscriptions</div>
                            </div>
                        </div>

                        {/* Card 3: Next Renewal */}
                        <div className="bg-card rounded-xl border border-border p-4 flex flex-col justify-between shadow-sm hover:border-primary/20 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                                    <Bell size={18} />
                                </div>
                                {isUrgent && <span className="text-xs font-medium text-destructive bg-destructive/10 px-2 py-1 rounded-full">Urgent</span>}
                            </div>
                            <div>
                                <div className="text-2xl font-bold tracking-tight">{nextRenewalDays}</div>
                                <div className="text-xs text-muted-foreground font-medium mt-1">Next Renewal</div>
                            </div>
                        </div>
                    </div>

                    {/* Subscription List Container (Full Width) */}
                    <div className="bg-card rounded-xl border border-border flex flex-col overflow-visible shadow-sm min-h-[400px]">
                        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
                            <div className="font-semibold text-sm">Recent Activity</div>
                            <div className="text-xs text-muted-foreground">Filter by: <span className="text-foreground font-medium">Date</span></div>
                        </div>
                        <div className="p-2 space-y-1">
                            <SubscriptionList />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
