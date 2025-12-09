"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateSettings(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const currency = formData.get("currency") as string;
    const name = formData.get("name") as string;

    try {
        await db.user.update({
            where: { id: session.user.id },
            data: { currency, name }
        });

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/settings");
        return { success: "Settings updated!" };
    } catch (error) {
        return { error: "Failed to update settings." };
    }
}

export async function completeTutorial() {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        await db.user.update({
            where: { id: session.user.id },
            data: { hasSeenTutorial: true }
        });
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("[Server Action] Failed to update tutorial status:", error);
        return { error: "Failed to update tutorial status" };
    }
}
