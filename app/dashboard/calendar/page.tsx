import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { CalendarView } from "@/components/dashboard/calendar/calendar-view";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default async function CalendarPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const subscriptions = await db.subscription.findMany({
        where: {
            userId: session.user.id,
            status: 'Active'
        }
    });

    return (
        <div className="min-h-screen bg-background font-sans text-foreground">
            <DashboardHeader user={session.user} />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex flex-col h-[calc(100vh-4rem)] pb-24">
                <div className="flex-shrink-0">
                    <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
                    <p className="text-muted-foreground text-sm">Visualize your upcoming renewals</p>
                </div>

                <div className="flex-1 min-h-0">
                    <CalendarView subscriptions={subscriptions} />
                </div>
            </main>
        </div>
    );
}
