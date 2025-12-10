"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export const addSubscription = async (prevState: any, formData: FormData) => {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "Not authenticated" };
    }

    const name = formData.get("name") as string;
    const priceStr = formData.get("price") as string;
    const price = parseFloat(priceStr);
    const currency = formData.get("currency") as string || "USD";
    
    const frequencyValueStr = formData.get("frequencyValue") as string || "1";
    const frequencyValue = parseInt(frequencyValueStr);
    const frequencyUnit = formData.get("frequencyUnit") as string || "Monthly";

    const nextRenewalDateStr = formData.get("nextRenewalDate") as string;
    if (!nextRenewalDateStr) {
         return { error: "Renewal Date is required" };
    }
    const nextRenewalDate = new Date(nextRenewalDateStr);

    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const website = formData.get("website") as string;
    const reminders = formData.get("reminders") as string;

    const isShared = formData.get("isShared") === "on";
    const sharedCountStr = formData.get("sharedCount") as string;
    let sharedCount = 1;

    if (isShared && sharedCountStr) {
        const parsed = parseInt(sharedCountStr);
        if (!isNaN(parsed) && parsed > 0) {
            sharedCount = parsed;
        }
    }

    let logoUrl = null;
    if (website) {
        try {
            const domain = new URL(website.startsWith('http') ? website : `https://${website}`).hostname;
            logoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
        } catch (e) {
            console.error("Failed to get logo URL", e);
        }
    }

    if (category) {
        try {
            const existingCat = await db.category.findFirst({
                where: { name: category, userId: session.user.id }
            });
            if (!existingCat) {
                await db.category.create({
                    data: { name: category, userId: session.user.id }
                });
            }
        } catch (e) {
            console.error("Failed to save category", e);
        }
    }

    if (!name || isNaN(price)) {
        return { error: "Invalid name or price" };
    }

    let notificationRulesData: any[] = [];
    if (reminders) {
        try {
            const parsed = JSON.parse(reminders);
            if (Array.isArray(parsed)) {
                notificationRulesData = parsed.map((r: any) => ({
                    value: parseInt(r.value),
                    unit: r.unit,
                    type: "SPECIFIC",
                    userId: session.user!.id
                }));
            }
        } catch (e) {
            console.error("Failed to parse reminders", e);
        }
    }

    try {
        await db.subscription.create({
            data: {
                userId: session.user.id,
                name,
                price,
                currency,
                frequencyValue,
                frequencyUnit,
                nextRenewalDate,
                category,
                description,
                website,
                logoUrl,
                status: "Active",
                isShared,
                sharedCount,
                notificationRules: {
                    create: notificationRulesData
                }
            },
        });
        
        revalidatePath("/dashboard");
        return { success: "Subscription added!" };
    } catch (error) {
        console.error("Failed to add subscription:", error);
        return { error: "Failed to add subscription" };
    }
}

export const updateSubscription = async (prevState: any, formData: FormData) => {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "Not authenticated" };
    }

    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const priceStr = formData.get("price") as string;
    const price = parseFloat(priceStr);
    const currency = formData.get("currency") as string || "USD";
    
    const frequencyValueStr = formData.get("frequencyValue") as string || "1";
    const frequencyValue = parseInt(frequencyValueStr);
    const frequencyUnit = formData.get("frequencyUnit") as string || "Monthly";

    const nextRenewalDateStr = formData.get("nextRenewalDate") as string;
    if (!nextRenewalDateStr) {
         return { error: "Renewal Date is required" };
    }
    const nextRenewalDate = new Date(nextRenewalDateStr);

    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const website = formData.get("website") as string;
    const reminders = formData.get("reminders") as string;

    const isShared = formData.get("isShared") === "on";
    const sharedCountStr = formData.get("sharedCount") as string;
    let sharedCount = 1;

    if (isShared && sharedCountStr) {
         const parsed = parseInt(sharedCountStr);
        if (!isNaN(parsed) && parsed > 0) {
            sharedCount = parsed;
        }
    }

    let logoUrl = null;
    if (website) {
        try {
            const domain = new URL(website.startsWith('http') ? website : `https://${website}`).hostname;
            logoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
        } catch (e) {
        }
    }

    if (!id || !name || isNaN(price)) {
        return { error: "Invalid data" };
    }

    const existing = await db.subscription.findUnique({
        where: { id }
    });
    
    if (!existing || existing.userId !== session.user.id) {
        return { error: "Unauthorized" };
    }

    let notificationRulesData: any[] = [];
    if (reminders) {
        try {
            const parsed = JSON.parse(reminders);
            if (Array.isArray(parsed)) {
                notificationRulesData = parsed.map((r: any) => ({
                    value: parseInt(r.value),
                    unit: r.unit,
                    type: "SPECIFIC",
                    userId: session.user!.id
                }));
            }
        } catch (e) {
             console.error("Failed to parse reminders", e);
        }
    }

    try {
        await db.notificationRule.deleteMany({
            where: {
                type: "SPECIFIC",
                subscriptions: {
                    some: { id: id }
                }
            }
        });

        await db.subscription.update({
            where: { id },
            data: {
                name,
                price,
                currency,
                frequencyValue,
                frequencyUnit,
                nextRenewalDate,
                category,
                description,
                website,
                isShared,
                sharedCount,
                ...(logoUrl ? { logoUrl } : {}),
                notificationRules: {
                    create: notificationRulesData
                }
            },
        });
        
        revalidatePath("/dashboard");
        return { success: "Subscription updated!" };
    } catch (error) {
        console.error("Failed to update subscription:", error);
        return { error: "Failed to update subscription" };
    }
}

export const deleteSubscription = async (id: string) => {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    try {
        await db.subscription.delete({
            where: { 
                id,
                userId: session.user.id 
            }
        });
        revalidatePath("/dashboard");
        return { success: "Deleted successfully" };
    } catch (error) {
         return { error: "Failed to delete" };
    }
}

export const getCategories = async () => {
    const session = await auth();
    if (!session?.user?.id) return [];
    
    const categories = await db.category.findMany({
        where: { userId: session.user.id },
        orderBy: { name: 'asc' }
    });
    return categories.map(c => c.name);
}
