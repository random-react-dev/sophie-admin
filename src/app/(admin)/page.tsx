import { EngagementChart } from "@/components/dashboard/engagement-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import { getDashboardStats, getEngagementData } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Activity,
    BookOpen,
    ExternalLink,
    Percent,
    TrendingUp,
    UserCheck,
    UserPlus,
    Users,
    Zap
} from "lucide-react";

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

            {/* Primary Stats - User Counts */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Active Today"
                    value={stats.activeToday}
                    icon={Activity}
                    description="Users signed in today"
                />
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={Users}
                />
                <StatCard
                    title="Active (30d)"
                    value={stats.activeUsers}
                    icon={UserCheck}
                    description="Monthly active users"
                />
                <StatCard
                    title="New This Week"
                    value={stats.newUsersThisWeek}
                    icon={UserPlus}
                />
            </div>

            {/* Secondary Stats - Engagement & Conversion */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Stickiness"
                    value={`${stats.stickinessRatio}%`}
                    icon={Percent}
                    description="DAU / MAU ratio"
                />
                <StatCard
                    title="Retention D7"
                    value={`${stats.retentionD7}%`}
                    icon={TrendingUp}
                    description="7-day return rate"
                />
                <StatCard
                    title="Retention D30"
                    value={`${stats.retentionD30}%`}
                    icon={TrendingUp}
                    description="30-day return rate"
                />
                <StatCard
                    title="Trial → Paid"
                    value={`${stats.trialConversionRate}%`}
                    icon={Percent}
                    description="Conversion rate"
                />
            </div>

            {/* Content Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    title="Vocab Items"
                    value={stats.totalVocabItems}
                    icon={BookOpen}
                    description="Total saved vocabulary"
                />
                <StatCard
                    title="Trial Users"
                    value={stats.trialUsers}
                    icon={Users}
                    description="On free trial"
                />
                <StatCard
                    title="Paid Users"
                    value={stats.paidUsers}
                    icon={Users}
                    description="Active subscriptions"
                />
            </div>

            {/* API Usage Card */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Gemini API Usage</CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                        API token usage is tracked via Google Cloud Console billing.
                        Token logging in the mobile app is not yet implemented.
                    </p>
                    <a
                        href="https://console.cloud.google.com/billing"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                    >
                        View in Google Cloud Console
                        <ExternalLink className="h-3 w-3" />
                    </a>
                </CardContent>
            </Card>

            {/* Engagement Chart */}
            <EngagementChart data={engagementData} />
        </div>
    );
}
