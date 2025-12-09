import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { SettingsForm } from "@/components/settings/settings-form";
import { ExportButton } from "@/components/settings/export-button";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default async function SettingsPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const user = await db.user.findUnique({
        where: { id: session.user.id },
    });

    const subscriptions = await db.subscription.findMany({
        where: { userId: session.user.id },
    });

    if (!user) redirect("/login");

    return (
        <div className="min-h-screen bg-background font-sans text-foreground">
            <DashboardHeader user={session.user} />
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground text-sm">Manage your account preferences</p>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Profile & Preferences</h2>
                    <SettingsForm
                        initialName={user.name || ""}
                        initialCurrency={user.currency || "USD"}
                    />
                </div>

                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-2">Data Management</h2>
                    <p className="text-sm text-muted-foreground mb-4">Download a copy of your subscription data.</p>
                    <ExportButton data={subscriptions} />
                </div>
            </main>
        </div>
    );
}
