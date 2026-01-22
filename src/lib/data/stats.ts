import { createAdminClient } from "@/lib/supabase/server";
import type { DashboardStats, EngagementDataPoint } from "@/lib/database.types";

/**
 * Get dashboard statistics using real data from Supabase
 */
export async function getDashboardStats(): Promise<DashboardStats> {
    const supabase = await createAdminClient();

    // Get all users via auth admin API
    const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 1000, // Get all users for counting
    });

    if (usersError) {
        console.error("Error fetching users:", usersError);
        return {
            totalUsers: 0,
            activeUsers: 0,
            newUsersThisWeek: 0,
            totalVocabItems: 0,
            trialUsers: 0,
            paidUsers: 0,
        };
    }

    const users = usersData.users;
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Calculate stats
    const totalUsers = users.length;

    const activeUsers = users.filter(user => {
        if (!user.last_sign_in_at) return false;
        return new Date(user.last_sign_in_at) >= thirtyDaysAgo;
    }).length;

    const newUsersThisWeek = users.filter(user => {
        return new Date(user.created_at) >= sevenDaysAgo;
    }).length;

    // Count trial vs paid users based on user_metadata
    let trialUsers = 0;
    let paidUsers = 0;

    users.forEach(user => {
        const metadata = user.user_metadata as Record<string, unknown> | undefined;
        const status = metadata?.subscription_status as string | undefined;

        if (status === 'active') {
            paidUsers++;
        } else if (status === 'trial' || !status) {
            // Default to trial if no status set
            trialUsers++;
        }
    });

    // Get vocabulary count
    const { count: vocabCount } = await supabase
        .from("vocabulary")
        .select("*", { count: "exact", head: true });

    return {
        totalUsers,
        activeUsers,
        newUsersThisWeek,
        totalVocabItems: vocabCount ?? 0,
        trialUsers,
        paidUsers,
    };
}

/**
 * Get engagement data for the last N days
 */
export async function getEngagementData(days: number = 14): Promise<EngagementDataPoint[]> {
    const supabase = await createAdminClient();

    // Get all users
    const { data: usersData, error } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
    });

    if (error || !usersData) {
        console.error("Error fetching users for engagement:", error);
        return [];
    }

    const users = usersData.users;
    const result: EngagementDataPoint[] = [];

    // Generate data for each day
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);

        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        // Count users active on this day (by last_sign_in_at)
        const activeUsers = users.filter(user => {
            if (!user.last_sign_in_at) return false;
            const signIn = new Date(user.last_sign_in_at);
            return signIn >= date && signIn < nextDate;
        }).length;

        // Count new users on this day
        const newUsers = users.filter(user => {
            const created = new Date(user.created_at);
            return created >= date && created < nextDate;
        }).length;

        result.push({
            date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            activeUsers,
            newUsers,
        });
    }

    return result;
}
