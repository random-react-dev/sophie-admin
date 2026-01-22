import { EngagementChart } from "@/components/dashboard/engagement-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import { getDashboardStats, getEngagementData } from "@/lib/data";
import { BookOpen, TrendingUp, UserCheck, UserPlus, Users, Zap } from "lucide-react";

export default async function DashboardPage() {
    // Fetch real data from Supabase
    const [stats, engagementData] = await Promise.all([
        getDashboardStats(),
        getEngagementData(14),
    ]);

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
                    title="API Tokens"
                    value="—"
                    icon={Zap}
                    description="Requires mobile app logging"
                />
            </div>

            {/* Engagement Chart */}
            <EngagementChart data={engagementData} />
        </div>
    );
}
