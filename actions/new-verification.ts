"use server";

import { db } from "@/lib/db";

export const newVerification = async (token: string) => {
    const existingToken = await db.verificationToken.findUnique({
        where: { token },
    });

    if (!existingToken) {
        return { error: "Token does not exist!" };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
        return { error: "Token has expired!" };
    }

    const existingUser = await db.user.findUnique({
        where: { email: existingToken.identifier },
    });

    if (!existingUser) {
        return { error: "Email does not exist!" };
    }

    await db.user.update({
        where: { id: existingUser.id },
        data: { 
            emailVerified: new Date(),
            email: existingToken.identifier,
        },
    });

    await db.verificationToken.delete({
        where: { 
             identifier_token: {
                identifier: existingToken.identifier,
                token: existingToken.token
            }
        }
    });
    
    return { success: "Email verified!" };
};
