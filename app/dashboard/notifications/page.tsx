import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Bell } from "lucide-react";
import { GlobalRulesSection } from "@/components/dashboard/notifications/global-rules-section";
import { SpecificRulesList } from "@/components/dashboard/notifications/specific-rules-list";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default async function NotificationsPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const globalRules = await db.notificationRule.findMany({
        where: { userId: session.user.id, type: "GLOBAL" },
        orderBy: { value: 'asc' }
    });

    const specificRules = await db.notificationRule.findMany({
        where: { userId: session.user.id, type: "SPECIFIC" },
        include: { subscriptions: true },
        orderBy: { createdAt: 'desc' }
    });

    const subscriptions = await db.subscription.findMany({
        where: { userId: session.user.id, status: 'Active' },
        select: { id: true, name: true, logoUrl: true }
    });

    return (
        <div className="min-h-screen bg-background font-sans text-foreground">
            <DashboardHeader user={session.user} />
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Notification Manager</h1>
                    <p className="text-muted-foreground text-sm">Manage your comprehensive alert settings</p>
                </div>

                {/* Global Rules Section */}
                <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-primary/10 text-primary rounded-lg">
                            <Bell size={20} />
                        </div>
                        <div>
                            <h2 className="font-semibold text-lg">Global Alerts</h2>
                            <p className="text-sm text-muted-foreground">These alerts apply to ALL your subscriptions.</p>
                        </div>
                    </div>

                    <GlobalRulesSection initialRules={globalRules} />
                </div>

                {/* Specific Rules Section */}
                <div className="space-y-4">
                    <h2 className="font-semibold text-lg ml-1">Subscription Specific Alerts</h2>
                    <SpecificRulesList rules={specificRules} subscriptions={subscriptions} />
                </div>
            </main>
        </div>
    );
}
