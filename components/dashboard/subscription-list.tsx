import { db } from "@/lib/db";
import { auth } from "@/auth";
import { SubscriptionItem } from "./subscription-item";

export async function SubscriptionList() {
    const session = await auth();
    if (!session?.user?.id) return null;

    const subscriptions = await db.subscription.findMany({
        where: { userId: session.user.id },
        orderBy: { nextRenewalDate: 'asc' }
    });

    if (subscriptions.length === 0) {
        return (
            <div className="text-center p-8">
                <p className="text-muted-foreground text-sm">No subscriptions yet.</p>
            </div>
        )
    }

    return (
        <>
            {subscriptions.map((sub) => (
                <SubscriptionItem key={sub.id} subscription={sub} />
            ))}
        </>
    );
}
