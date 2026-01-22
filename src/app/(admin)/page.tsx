import { EngagementChart } from "@/components/dashboard/engagement-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import { BookOpen, TrendingUp, UserCheck, UserPlus, Users, Zap } from "lucide-react";

// Mock data for initial display - will be replaced with real data
const mockChartData = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (13 - i));
    return {
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        activeUsers: Math.floor(Math.random() * 50) + 20,
        newUsers: Math.floor(Math.random() * 10) + 2,
    };
});

export default function DashboardPage() {
    // TODO: Fetch real data from Supabase
    const stats = {
        totalUsers: 1234,
        activeUsers: 456,
        newUsersThisWeek: 78,
        totalVocabItems: 12500,
        totalApiTokens: 1500000,
        trialUsers: 300,
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Overview of Sophie app metrics and user activity.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={Users}
                    trend={{ value: 12, isPositive: true }}
                />
                <StatCard
                    title="Active Users (30d)"
                    value={stats.activeUsers}
                    icon={UserCheck}
                    description="Users active in last 30 days"
                />
                <StatCard
                    title="New This Week"
                    value={stats.newUsersThisWeek}
                    icon={UserPlus}
                    trend={{ value: 8, isPositive: true }}
                />
                <StatCard
                    title="Trial Users"
                    value={stats.trialUsers}
                    icon={TrendingUp}
                    description="Users on free trial"
                />
                <StatCard
                    title="Vocab Items"
                    value={stats.totalVocabItems}
                    icon={BookOpen}
                />
                <StatCard
                    title="API Tokens Used"
                    value={`${(stats.totalApiTokens / 1000000).toFixed(1)}M`}
                    icon={Zap}
                    description="Gemini API tokens"
                />
            </div>

            {/* Engagement Chart */}
            <EngagementChart data={mockChartData} />
        </div>
    );
}
