import { createAdminClient } from "@/lib/supabase/server";
import type {
    ApiUsageStats,
    DailyApiUsage,
    ModelUsageBreakdown,
} from "@/lib/database.types";

/**
 * Get aggregated API usage statistics
 */
export async function getApiUsageStats(): Promise<ApiUsageStats> {
    const supabase = await createAdminClient();

    const { data, error } = await supabase
        .from("api_usage_logs")
        .select("input_tokens, output_tokens, cost_cents, user_id");

    if (error || !data || data.length === 0) {
        return {
            totalCalls: 0,
            totalInputTokens: 0,
            totalOutputTokens: 0,
            totalCostCents: 0,
            averageTokensPerUser: 0,
            hasData: false,
        };
    }

    const totalCalls = data.length;
    const totalInputTokens = data.reduce((sum, row) => sum + (row.input_tokens ?? 0), 0);
    const totalOutputTokens = data.reduce((sum, row) => sum + (row.output_tokens ?? 0), 0);
    const totalCostCents = data.reduce((sum, row) => sum + Number(row.cost_cents ?? 0), 0);

    const uniqueUsers = new Set(data.map(row => row.user_id)).size;
    const averageTokensPerUser = uniqueUsers > 0
        ? Math.round((totalInputTokens + totalOutputTokens) / uniqueUsers)
        : 0;

    return {
        totalCalls,
        totalInputTokens,
        totalOutputTokens,
        totalCostCents,
        averageTokensPerUser,
        hasData: true,
    };
}

/**
 * Get daily API usage for the last N days
 */
export async function getDailyApiUsage(days: number = 14): Promise<DailyApiUsage[]> {
    const supabase = await createAdminClient();

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
        .from("api_usage_logs")
        .select("input_tokens, output_tokens, cost_cents, created_at")
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: true });

    if (error || !data) {
        return [];
    }

    const dailyMap = new Map<string, DailyApiUsage>();

    for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (days - 1 - i));
        const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        dailyMap.set(dateStr, {
            date: dateStr,
            calls: 0,
            inputTokens: 0,
            outputTokens: 0,
            costCents: 0,
        });
    }

    data.forEach(row => {
        const date = new Date(row.created_at);
        const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

        const existing = dailyMap.get(dateStr);
        if (existing) {
            existing.calls += 1;
            existing.inputTokens += row.input_tokens ?? 0;
            existing.outputTokens += row.output_tokens ?? 0;
            existing.costCents += Number(row.cost_cents ?? 0);
        }
    });

    return Array.from(dailyMap.values());
}

/**
 * Get API usage breakdown by model
 */
export async function getModelUsageBreakdown(): Promise<ModelUsageBreakdown[]> {
    const supabase = await createAdminClient();

    const { data, error } = await supabase
        .from("api_usage_logs")
        .select("model, input_tokens, output_tokens, cost_cents");

    if (error || !data || data.length === 0) {
        return [];
    }

    const modelMap = new Map<string, ModelUsageBreakdown>();

    data.forEach(row => {
        const model = row.model ?? "unknown";
        const existing = modelMap.get(model);

        if (existing) {
            existing.calls += 1;
            existing.totalTokens += (row.input_tokens ?? 0) + (row.output_tokens ?? 0);
            existing.costCents += Number(row.cost_cents ?? 0);
        } else {
            modelMap.set(model, {
                model,
                calls: 1,
                totalTokens: (row.input_tokens ?? 0) + (row.output_tokens ?? 0),
                costCents: Number(row.cost_cents ?? 0),
            });
        }
    });

    return Array.from(modelMap.values()).sort((a, b) => b.calls - a.calls);
}

/**
 * Get top users by token consumption
 */
export async function getTopUsersByTokens(limit: number = 10): Promise<Array<{
    userId: string;
    email: string;
    totalTokens: number;
    totalCalls: number;
}>> {
    const supabase = await createAdminClient();

    const { data, error } = await supabase
        .from("api_usage_logs")
        .select("user_id, input_tokens, output_tokens");

    if (error || !data || data.length === 0) {
        return [];
    }

    const userMap = new Map<string, { totalTokens: number; totalCalls: number }>();

    data.forEach(row => {
        const existing = userMap.get(row.user_id);
        const tokens = (row.input_tokens ?? 0) + (row.output_tokens ?? 0);

        if (existing) {
            existing.totalTokens += tokens;
            existing.totalCalls += 1;
        } else {
            userMap.set(row.user_id, { totalTokens: tokens, totalCalls: 1 });
        }
    });

    const sortedUsers = Array.from(userMap.entries())
        .sort((a, b) => b[1].totalTokens - a[1].totalTokens)
        .slice(0, limit);

    const { data: usersData } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    const userEmailMap = new Map<string, string>();
    usersData?.users.forEach(user => {
        userEmailMap.set(user.id, user.email ?? "Unknown");
    });

    return sortedUsers.map(([userId, stats]) => ({
        userId,
        email: userEmailMap.get(userId) ?? "Unknown",
        totalTokens: stats.totalTokens,
        totalCalls: stats.totalCalls,
    }));
}
