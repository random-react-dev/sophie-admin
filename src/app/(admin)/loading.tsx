import { StatsSkeleton, ChartSkeleton } from "@/components/dashboard/stats-skeleton";

export default function DashboardLoading() {
    return (
        <div className="space-y-6">
            <div>
                <div className="h-9 w-32 animate-pulse rounded bg-muted" />
                <div className="mt-2 h-5 w-64 animate-pulse rounded bg-muted" />
            </div>

            {/* Stats Grid Skeleton */}
            <StatsSkeleton />

            {/* Chart Skeleton */}
            <ChartSkeleton />
        </div>
    );
}
