import {
  HeaderSkeleton,
  StatsRowSkeleton,
  ApiCardSkeleton,
  ChartSkeleton,
} from "@/components/dashboard/stats-skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <HeaderSkeleton />

      {/* Primary Stats - Row 1: 4 cards */}
      <StatsRowSkeleton count={4} columns="lg:grid-cols-4" />

      {/* Secondary Stats - Row 2: 4 cards */}
      <StatsRowSkeleton count={4} columns="lg:grid-cols-4" />

      {/* Content Stats - Row 3: 3 cards */}
      <StatsRowSkeleton count={3} columns="lg:grid-cols-3" />

      {/* API Usage Card */}
      <ApiCardSkeleton />

      {/* Engagement Chart */}
      <ChartSkeleton />
    </div>
  );
}
