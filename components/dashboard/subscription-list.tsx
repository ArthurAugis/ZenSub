import { db } from "@/lib/db";
import { auth } from "@/auth";
import { SubscriptionItem } from "./subscription-item";

interface SubscriptionListProps {
    searchParams?: {
        sort?: string;
        category?: string;
    }
}

export async function SubscriptionList({ searchParams }: SubscriptionListProps) {
    const session = await auth();
    if (!session?.user?.id) return null;

    const { sort, category } = searchParams || {};

    let orderBy: any = { nextRenewalDate: 'asc' };
    if (sort === 'date_desc') orderBy = { nextRenewalDate: 'desc' };
    else if (sort === 'price_asc') orderBy = { price: 'asc' };
    else if (sort === 'price_desc') orderBy = { price: 'desc' };
    else if (sort === 'name_asc') orderBy = { name: 'asc' };
    else if (sort === 'name_desc') orderBy = { name: 'desc' };

    let where: any = { userId: session.user.id };
    if (category && category !== 'all') {
        where.category = category;
    }

    const subscriptions = await db.subscription.findMany({
        where,
        orderBy,
        include: { notificationRules: true }
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
