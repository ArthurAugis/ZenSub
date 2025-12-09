import { SubscriptionItem } from "./subscription-item";

interface SubscriptionListProps {
    initialSubscriptions: any[];
    userCurrency?: string;
}

export function SubscriptionList({ initialSubscriptions, userCurrency }: SubscriptionListProps) {
    if (initialSubscriptions.length === 0) {
        return (
            <div className="text-center p-12 border-2 border-dashed border-border rounded-xl">
                <p className="text-muted-foreground font-medium">No subscriptions found matching your criteria.</p>
            </div>
        )
    }

    return (
        <div id="dashboard-subscription-list" className="grid gap-4">
            {initialSubscriptions.map((sub) => (
                <SubscriptionItem
                    key={sub.id}
                    subscription={sub}
                    userCurrency={userCurrency}
                />
            ))}
        </div>
    );
}
