"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export const createCategory = async (prevState: any, formData: FormData) => {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Not authenticated" };
    }

    const name = formData.get("name") as string;
    
    if (!name) {
        return { error: "Name is required" };
    }

    try {
        // Check if exists
        const existing = await db.category.findFirst({
            where: { name, userId: session.user.id }
        });

        if (existing) {
             return { error: "Category already exists" };
        }

        await db.category.create({
            data: {
                name,
                userId: session.user.id
            }
        });
        
        revalidatePath("/dashboard");
        return { success: "Category created!" };
    } catch (error) {
        console.error("Failed to create category:", error);
        return { error: "Failed to create category" };
    }
}
