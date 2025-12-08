"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export const login = async (prevState: any, formData: FormData) => {
    const email = formData.get("email");
    const password = formData.get("password");

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: "/dashboard",
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials!" };
                default:
                    return { error: "Something went wrong!" };
            }
        }
        throw error;
    }
};
