import { createAdminClient } from "@/lib/supabase/server";
import type {
    UserListItem,
    UserListResponse,
    UserDetail,
    LearningProfile,
    UserMetadata,
} from "@/lib/database.types";

/**
 * Get paginated list of users
 */
export async function getUsers(
    page: number = 1,
    perPage: number = 20,
    search?: string
): Promise<UserListResponse> {
    const supabase = await createAdminClient();

    // Fetch users from auth admin API
    const { data, error } = await supabase.auth.admin.listUsers({
        page,
        perPage,
    });

    if (error || !data) {
        console.error("Error fetching users:", error);
        return {
            users: [],
            total: 0,
            page,
            perPage,
        };
    }

    let users = data.users;

    // Filter by search if provided
    if (search) {
        const searchLower = search.toLowerCase();
        users = users.filter(user => {
            const email = user.email?.toLowerCase() ?? "";
            const fullName = ((user.user_metadata as UserMetadata)?.full_name ?? "").toLowerCase();
            return email.includes(searchLower) || fullName.includes(searchLower);
        });
    }

    // Map to UserListItem
    const mappedUsers: UserListItem[] = users.map(user => {
        const metadata = user.user_metadata as UserMetadata | undefined;
        const status = metadata?.subscription_status ?? "unknown";

        return {
            id: user.id,
            email: user.email ?? "",
            fullName: metadata?.full_name,
            country: metadata?.country,
            status: status === "active" ? "active" : status === "expired" ? "expired" : status === "trial" ? "trial" : "unknown",
            lastActiveAt: user.last_sign_in_at ?? undefined,
            createdAt: user.created_at,
        };
    });

    return {
        users: mappedUsers,
        total: data.total ?? users.length,
        page,
        perPage,
    };
}

/**
 * Get single user details with all related data
 */
export async function getUserById(userId: string): Promise<UserDetail | null> {
    const supabase = await createAdminClient();

    // Get user from auth admin API
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);

    if (userError || !userData.user) {
        console.error("Error fetching user:", userError);
        return null;
    }

    const user = userData.user;
    const metadata = user.user_metadata as UserMetadata;

    // Get learning profiles for this user
    const { data: profiles, error: profilesError } = await supabase
        .from("learning_profiles")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (profilesError) {
        console.error("Error fetching learning profiles:", profilesError);
    }

    // Get vocabulary count
    const { count: vocabCount, error: vocabError } = await supabase
        .from("vocabulary")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

    if (vocabError) {
        console.error("Error fetching vocabulary count:", vocabError);
    }

    return {
        id: user.id,
        email: user.email ?? "",
        createdAt: user.created_at,
        lastSignInAt: user.last_sign_in_at ?? undefined,
        metadata: metadata,
        learningProfiles: (profiles as LearningProfile[]) ?? [],
        vocabularyCount: vocabCount ?? 0,
    };
}

/**
 * Get count of users by status
 */
export async function getUserCountsByStatus(): Promise<{
    trial: number;
    active: number;
    expired: number;
}> {
    const supabase = await createAdminClient();

    const { data, error } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
    });

    if (error || !data) {
        return { trial: 0, active: 0, expired: 0 };
    }

    let trial = 0;
    let active = 0;
    let expired = 0;

    data.users.forEach(user => {
        const metadata = user.user_metadata as UserMetadata | undefined;
        const status = metadata?.subscription_status;

        if (status === "active") {
            active++;
        } else if (status === "expired") {
            expired++;
        } else {
            trial++; // Default to trial
        }
    });

    return { trial, active, expired };
}
