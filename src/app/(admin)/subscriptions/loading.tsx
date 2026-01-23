import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  HeaderSkeleton,
  StatsRowSkeleton,
  ChartSkeleton,
} from "@/components/dashboard/stats-skeleton";

export default function SubscriptionsLoading() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <HeaderSkeleton />

      {/* Stats Grid - 4 cards */}
      <StatsRowSkeleton count={4} columns="lg:grid-cols-4" />

      {/* Chart + Info Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Status Distribution Chart */}
        <ChartSkeleton />

        {/* Payment Integration Card */}
        <Card className="border-dashed">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 animate-pulse rounded bg-muted" />
              <div className="h-5 w-40 animate-pulse rounded bg-muted" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-4 w-48 animate-pulse rounded bg-muted" />
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted" />
                  <div className="h-4 w-40 animate-pulse rounded bg-muted" />
                </div>
              ))}
            </div>
            <div className="h-3 w-44 animate-pulse rounded bg-muted pt-2" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
