import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { checkAndRolloverSubscriptions } from "@/actions/subscription";
import { SubscriptionList } from "@/components/dashboard/subscription-list";
import { AddSubscriptionButton } from "@/components/dashboard/add-subscription-button";
import { AddCategoryButton } from "@/components/dashboard/add-category-button";
import { FilterBar } from "@/components/dashboard/filter-bar";
import { PieChart, Calendar } from "lucide-react";
import { convertCurrency, getExchangeRates } from "@/lib/currency";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DollarSign } from "lucide-react";
import { DashboardTutorial } from "@/components/dashboard/dashboard-tutorial";


export default async function DashboardPage(props: { searchParams: Promise<any> }) {
    const searchParams = await props.searchParams;
    const session = await auth();
    const rates = await getExchangeRates();
    const query = searchParams?.query || "";
    const filter = searchParams?.filter || "all";
    const sort = searchParams?.sort || "date_asc";
    const categoryParam = searchParams?.category || "all";

    if (!session?.user?.id) {
        redirect("/login");
    }

    await checkAndRolloverSubscriptions(session.user.id);

    const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { currency: true, hasSeenTutorial: true }
    });
    const userCurrency = user?.currency || "USD";
    const hasSeenTutorial = user?.hasSeenTutorial || false;

    let orderBy: any = { nextRenewalDate: 'asc' };
    if (sort === 'date_desc') orderBy = { nextRenewalDate: 'desc' };
    else if (sort === 'price_asc') orderBy = { price: 'asc' };
    else if (sort === 'price_desc') orderBy = { price: 'desc' };
    else if (sort === 'name_asc') orderBy = { name: 'asc' };
    else if (sort === 'name_desc') orderBy = { name: 'desc' };

    let where: any = {
        userId: session.user.id,
        name: { contains: query }
    };

    if (categoryParam !== 'all') {
        where.category = categoryParam;
    }

    if (filter === 'active') where.status = 'Active';
    else if (filter === 'inactive') where.status = 'Inactive';

    const subscriptions = await db.subscription.findMany({
        where,
        orderBy
    });

    const categoriesData = await db.category.findMany({
        where: { userId: session.user.id },
        select: { name: true },
        orderBy: { name: 'asc' }
    });
    const categories = categoriesData.map(c => c.name);

    const allActiveSubscriptions = await db.subscription.findMany({
        where: {
            userId: session.user.id,
            status: 'Active'
        }
    });

    let totalMonthlySpend = 0;
    allActiveSubscriptions.forEach(sub => {
        let price = sub.price;

        if (sub.isShared && sub.sharedCount > 1) {
            price = price / sub.sharedCount;
        }

        if (sub.currency !== userCurrency) {
            price = convertCurrency(price, sub.currency, userCurrency, rates);
        }

        let monthly = price;
        const unit = sub.frequencyUnit || 'Monthly';
        const val = sub.frequencyValue || 1;

        if (unit === 'Yearly') monthly = price / (12 * val);
        else if (unit === 'Monthly') monthly = price / val;
        else if (unit === 'Weekly') monthly = (price * 52) / (12 * val);
        else if (unit === 'Daily') monthly = (price * 365) / (12 * val);

        totalMonthlySpend += monthly;
    });

    const totalActiveCount = allActiveSubscriptions.length;

    let nextRenewalDays = "N/A";
    if (allActiveSubscriptions.length > 0) {
        const sortedActive = [...allActiveSubscriptions].sort((a, b) => a.nextRenewalDate.getTime() - b.nextRenewalDate.getTime());
        const nextDate = sortedActive[0].nextRenewalDate;
        const today = new Date();
        const diffTime = nextDate.getTime() - today.getTime();
        const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        nextRenewalDays = `${Math.max(0, daysUntil)} Days`;
    }



    return (
        <div className="min-h-screen bg-background font-sans text-foreground">
            {/* Header */}
            <DashboardHeader user={session.user} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Stats Grid */}
                <div id="dashboard-stats" className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-muted-foreground">Monthly Spend</h3>
                            <div className="p-2 bg-green-500/10 rounded-full">
                                <DollarSign size={16} className="text-green-500" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold tracking-tight">
                            {userCurrency === 'EUR' ? '€' : userCurrency === 'GBP' ? '£' : '$'}
                            {totalMonthlySpend.toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 text-green-600 flex items-center gap-1">
                            For {totalActiveCount} active subs
                        </p>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-muted-foreground">Active Subscriptions</h3>
                            <div className="p-2 bg-blue-500/10 rounded-full">
                                <PieChart size={16} className="text-blue-500" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold tracking-tight">{totalActiveCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Tracking {allActiveSubscriptions.length} items
                        </p>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-muted-foreground">Next Renewal</h3>
                            <div className="p-2 bg-orange-500/10 rounded-full">
                                <Calendar size={16} className="text-orange-500" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold tracking-tight">{nextRenewalDays}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Days until next payment
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="space-y-6 pb-24">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <h2 className="text-xl font-semibold tracking-tight">Your Subscriptions</h2>
                        <FilterBar categories={categories} />
                    </div>

                    <SubscriptionList
                        initialSubscriptions={subscriptions}
                        userCurrency={userCurrency}
                    />
                </div>
            </main>
            <DashboardTutorial hasSeenTutorial={hasSeenTutorial} />
        </div>
    );
}
