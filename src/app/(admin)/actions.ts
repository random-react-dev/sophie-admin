"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface CreateAdminResult {
    success: boolean;
    error?: string;
    userId?: string;
}

export async function createAdminUser(
    email: string,
    password: string
): Promise<CreateAdminResult> {
    if (!email || !password) {
        return { success: false, error: "Email and password are required" };
    }

    if (password.length < 8) {
        return { success: false, error: "Password must be at least 8 characters" };
    }

    const supabase = await createAdminClient();

    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
            is_admin: true,
        },
    });

    if (error) {
        console.error("Error creating admin user:", error);
        return { success: false, error: error.message };
    }

    if (!data.user) {
        return { success: false, error: "Failed to create user" };
    }

    revalidatePath("/system");

    return { success: true, userId: data.user.id };
}
