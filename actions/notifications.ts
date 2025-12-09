"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export const addGlobalRule = async (value: number, unit: string) => {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    try {
        await db.notificationRule.create({
            data: {
                userId: session.user.id,
                value,
                unit,
                type: "GLOBAL"
            }
        });
        revalidatePath("/dashboard/notifications");
        return { success: "Rule added" };
    } catch (e) {
        return { error: "Failed to add rule" };
    }
};

export const deleteRule = async (id: string) => {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    try {
        await db.notificationRule.delete({
            where: { id, userId: session.user.id }
        });
        revalidatePath("/dashboard/notifications");
        revalidatePath("/dashboard"); 
        return { success: "Rule deleted" };
    } catch (e) {
        return { error: "Failed to delete rule" };
    }
};

export const addSpecificRule = async (value: number, unit: string, subscriptionIds: string[]) => {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    try {
        await db.notificationRule.create({
            data: {
                userId: session.user.id,
                value,
                unit,
                type: "SPECIFIC",
                subscriptions: {
                    connect: subscriptionIds.map(id => ({ id }))
                }
            }
        });
        revalidatePath("/dashboard/notifications");
        return { success: "Rule added" };
    } catch (e) {
        return { error: "Failed to add rule" };
    }
};
