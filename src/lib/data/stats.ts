import { createAdminClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import type { DashboardStats, EngagementDataPoint, UserStatsAggregate } from "@/lib/database.types";

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
            activeToday: 0,
            stickinessRatio: 0,
            trialConversionRate: 0,
            retentionD7: 0,
            retentionD30: 0,
        };
    }

    const users = usersData.users;
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Calculate basic stats
    const totalUsers = users.length;

    // Active users in last 30 days (MAU)
    const activeUsers = users.filter(user => {
        if (!user.last_sign_in_at) return false;
        return new Date(user.last_sign_in_at) >= thirtyDaysAgo;
    }).length;

    // Active users today (DAU)
    const activeToday = users.filter(user => {
        if (!user.last_sign_in_at) return false;
        return new Date(user.last_sign_in_at) >= todayStart;
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

    // Calculate stickiness ratio (DAU/MAU * 100)
    const stickinessRatio = activeUsers > 0
        ? Math.round((activeToday / activeUsers) * 100)
        : 0;

    // Calculate trial-to-paid conversion rate
    const totalTrialAndPaid = trialUsers + paidUsers;
    const trialConversionRate = totalTrialAndPaid > 0
        ? Math.round((paidUsers / totalTrialAndPaid) * 100)
        : 0;

    // Calculate D7 retention: % of users created 7+ days ago who were active in last 7 days
    const usersCreatedBeforeD7 = users.filter(user =>
        new Date(user.created_at) < sevenDaysAgo
    );
    const d7RetainedUsers = usersCreatedBeforeD7.filter(user => {
        if (!user.last_sign_in_at) return false;
        return new Date(user.last_sign_in_at) >= sevenDaysAgo;
    });
    const retentionD7 = usersCreatedBeforeD7.length > 0
        ? Math.round((d7RetainedUsers.length / usersCreatedBeforeD7.length) * 100)
        : 0;

    // Calculate D30 retention: % of users created 30+ days ago who were active in last 30 days
    const usersCreatedBeforeD30 = users.filter(user =>
        new Date(user.created_at) < thirtyDaysAgo
    );
    const d30RetainedUsers = usersCreatedBeforeD30.filter(user => {
        if (!user.last_sign_in_at) return false;
        return new Date(user.last_sign_in_at) >= thirtyDaysAgo;
    });
    const retentionD30 = usersCreatedBeforeD30.length > 0
        ? Math.round((d30RetainedUsers.length / usersCreatedBeforeD30.length) * 100)
        : 0;

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
        activeToday,
        stickinessRatio,
        trialConversionRate,
        retentionD7,
        retentionD30,
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

/**
 * Get aggregated user stats from user_stats table (speaking time, conversations)
 */
export async function getUserStatsAggregates(): Promise<UserStatsAggregate> {
    const supabase = await createAdminClient();

    const { data, error } = await supabase
        .from("user_stats")
        .select("total_speaking_seconds, total_conversations, user_id");

    if (error || !data || data.length === 0) {
        return {
            totalSpeakingSeconds: 0,
            totalConversations: 0,
            averageSecondsPerUser: 0,
            usersWithStats: 0,
        };
    }

    const totalSpeakingSeconds = data.reduce(
        (sum, row) => sum + (row.total_speaking_seconds ?? 0),
        0
    );
    const totalConversations = data.reduce(
        (sum, row) => sum + (row.total_conversations ?? 0),
        0
    );
    const usersWithStats = data.length;
    const averageSecondsPerUser = usersWithStats > 0
        ? Math.round(totalSpeakingSeconds / usersWithStats)
        : 0;

    return {
        totalSpeakingSeconds,
        totalConversations,
        averageSecondsPerUser,
        usersWithStats,
    };
}

/**
 * Get form submissions count
 */
export async function getSubmissionsCount(): Promise<{ total: number; thisWeek: number }> {
    const supabase = createServiceRoleClient();

    const { count: total } = await supabase
        .from("form_submissions")
        .select("*", { count: "exact", head: true });

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const { count: thisWeek } = await supabase
        .from("form_submissions")
        .select("*", { count: "exact", head: true })
        .gte("created_at", weekAgo.toISOString());

    return {
        total: total ?? 0,
        thisWeek: thisWeek ?? 0,
    };
}
