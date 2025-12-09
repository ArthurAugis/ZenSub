import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { CalendarView } from "@/components/dashboard/calendar/calendar-view";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

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
        <div className="min-h-screen bg-background p-6 sm:p-8 font-sans">
            <div className="max-w-6xl mx-auto space-y-6 h-[calc(100vh-4rem)] flex flex-col">
                <div className="flex items-center gap-4 flex-shrink-0">
                    <Link href="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
                        <p className="text-muted-foreground text-sm">Visualize your upcoming renewals</p>
                    </div>
                </div>

                <div className="flex-1 min-h-0">
                    <CalendarView subscriptions={subscriptions} />
                </div>
            </div>
        </div>
    );
}
