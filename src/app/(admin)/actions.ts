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
  password: string,
): Promise<CreateAdminResult> {
  if (!email || !password) {
    return { success: false, error: "Email and password are required" };
  }

  if (password.length < 8) {
    return { success: false, error: "Password must be at least 8 characters" };
  }

  const supabase = await createAdminClient();

  try {
    // 1. Check if user already exists
    // Note: listUsers is not the most efficient search but Supabase Admin API
    // doesn't support getByEmail directly without searching.
    // We fetch a reasonable number of users.
    const { data: usersData, error: listError } =
      await supabase.auth.admin.listUsers({
        perPage: 1000,
      });

    if (listError) {
      console.error("Error listing users:", listError);
      return { success: false, error: "Failed to check existing users" };
    }

    const existingUser = usersData.users.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase(),
    );

    if (existingUser) {
      // 2. User exists: Update them to be an admin
      console.log(`User ${email} exists. Promoting to admin.`);

      const { data: updateData, error: updateError } =
        await supabase.auth.admin.updateUserById(existingUser.id, {
          password: password, // Update password as requested
          user_metadata: {
            ...existingUser.user_metadata,
            is_admin: true,
          },
          email_confirm: true, // Ensure they are confirmed
        });

      if (updateError) {
        console.error("Error updating existing user:", updateError);
        return { success: false, error: updateError.message };
      }

      if (!updateData.user) {
        return { success: false, error: "Failed to update user" };
      }

      revalidatePath("/system");
      return { success: true, userId: updateData.user.id };
    }

    // 3. User does not exist: Create new admin
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
      // Double check if it was a race condition on existence
      if (error.message.includes("already been registered")) {
        return {
          success: false,
          error: "User already exists (race condition). Please try again.",
        };
      }
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: "Failed to create user" };
    }

    revalidatePath("/system");
    return { success: true, userId: data.user.id };
  } catch (err) {
    console.error("Unexpected error in createAdminUser:", err);
    return { success: false, error: "An unexpected error occurred" };
  }
}
