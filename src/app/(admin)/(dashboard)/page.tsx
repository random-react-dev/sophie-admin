import { EngagementChart } from "@/components/dashboard/engagement-chart";
import { StatCard, iconVariants } from "@/components/dashboard/stat-card";
import { getDashboardStats, getEngagementData, getUserStatsAggregates, getSubmissionsCount, getApiUsageStats } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Activity,
  BookOpen,
  ExternalLink,
  Gem,
  History,
  Magnet,
  Timer,
  UserPlus,
  Users,
  Zap,
  Ticket,
  ArrowRight,
  Sparkles,
  MessageSquare,
  Clock,
  FileText,
} from "lucide-react";

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

function formatCost(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export default async function DashboardPage() {
  const [stats, engagementData, userStats, submissions, apiUsage] = await Promise.all([
    getDashboardStats(),
    getEngagementData(14),
    getUserStatsAggregates(),
    getSubmissionsCount(),
    getApiUsageStats(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Overview of Sophie app metrics and user activity.
        </p>
      </div>

      {/* Primary Stats - User Counts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Today"
          value={stats.activeToday}
          icon={Zap}
          color="amber"
          description="Users signed in today"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="blue"
          description="Registered accounts"
        />
        <StatCard
          title="Active (30d)"
          value={stats.activeUsers}
          icon={Activity}
          color="green"
          description="Monthly active users"
        />
        <StatCard
          title="New This Week"
          value={stats.newUsersThisWeek}
          icon={UserPlus}
          color="violet"
          description="New sign-ups this week"
        />
      </div>

      {/* Secondary Stats - Engagement & Conversion */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Stickiness"
          value={`${stats.stickinessRatio}%`}
          icon={Magnet}
          color="pink"
          description="DAU / MAU ratio"
        />
        <StatCard
          title="Retention D7"
          value={`${stats.retentionD7}%`}
          icon={Timer}
          color="indigo"
          description="7-day return rate"
        />
        <StatCard
          title="Retention D30"
          value={`${stats.retentionD30}%`}
          icon={History}
          color="indigo"
          description="30-day return rate"
        />
        <StatCard
          title="Vocab Items"
          value={stats.totalVocabItems}
          icon={BookOpen}
          color="orange"
          description="Total saved vocabulary"
        />
      </div>

      {/* Content Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Paying Users"
          value={stats.paidUsers}
          icon={Gem}
          color="fuchsia"
          description="Active subscriptions"
        />
        <StatCard
          title="Trial → Paid"
          value={`${stats.trialConversionRate}%`}
          icon={ArrowRight}
          color="rose"
          description="Conversion rate"
        />
        <StatCard
          title="Trial Users"
          value={stats.trialUsers}
          icon={Ticket}
          color="cyan"
          description="On free trial"
        />
      </div>

      {/* User Activity Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Conversations"
          value={userStats.totalConversations}
          icon={MessageSquare}
          color="cyan"
          description="All-time conversations"
        />
        <StatCard
          title="Speaking Time"
          value={formatDuration(userStats.totalSpeakingSeconds)}
          icon={Clock}
          color="green"
          description="Total speaking practice"
        />
        <StatCard
          title="Avg Per User"
          value={formatDuration(userStats.averageSecondsPerUser)}
          icon={Timer}
          color="blue"
          description="Average speaking time"
        />
        <StatCard
          title="Form Submissions"
          value={submissions.total}
          icon={FileText}
          color="orange"
          description={`${submissions.thisWeek} this week`}
        />
      </div>

      {/* API Usage Card */}
      <Card className="hover:shadow-md transition-all duration-200 border-muted/60">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Gemini API Usage
          </CardTitle>
          <div className={cn(iconVariants({ color: "yellow" }))}>
            <Sparkles className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          {apiUsage.hasData ? (
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <p className="text-2xl font-bold">{apiUsage.totalCalls.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">API Calls</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{apiUsage.totalInputTokens.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Input Tokens</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{apiUsage.totalOutputTokens.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Output Tokens</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCost(apiUsage.totalCostCents)}</p>
                <p className="text-sm text-muted-foreground">Estimated Cost</p>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-3">
                API token usage tracking is not yet enabled. Enable logging in the mobile app to see metrics here.
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
            </>
          )}
        </CardContent>
      </Card>

      {/* Engagement Chart */}
      <EngagementChart data={engagementData} />
    </div>
  );
}
