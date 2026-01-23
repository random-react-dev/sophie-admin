import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { HeaderSkeleton } from "@/components/dashboard/stats-skeleton";

export default function AnalyticsLoading() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <HeaderSkeleton />

      {/* Charts Grid - mimics AnalyticsCharts component */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Language Distribution Chart */}
        <Card>
          <CardHeader>
            <div className="h-5 w-40 animate-pulse rounded bg-muted" />
            <div className="h-4 w-56 animate-pulse rounded bg-muted" />
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full animate-pulse rounded bg-muted" />
          </CardContent>
        </Card>

        {/* Accent Popularity Chart */}
        <Card>
          <CardHeader>
            <div className="h-5 w-36 animate-pulse rounded bg-muted" />
            <div className="h-4 w-48 animate-pulse rounded bg-muted" />
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full animate-pulse rounded bg-muted" />
          </CardContent>
        </Card>
      </div>

      {/* Onboarding Funnel */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="h-5 w-36 animate-pulse rounded bg-muted" />
              <div className="mt-1 h-4 w-64 animate-pulse rounded bg-muted" />
            </div>
            <div className="h-10 w-24 animate-pulse rounded bg-muted" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>

      {/* Drop-off Analysis Card */}
      <Card>
        <CardHeader>
          <div className="h-5 w-48 animate-pulse rounded bg-muted" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                <div className="h-4 w-4 animate-pulse rounded bg-muted" />
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              </div>
              <div className="flex items-center gap-4">
                <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                <div className="h-4 w-12 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
