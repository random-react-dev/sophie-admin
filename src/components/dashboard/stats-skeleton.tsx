"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Skeleton loading component for dashboard stats
 */
export function StatsSkeleton() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                        </CardTitle>
                        <div className="h-4 w-4 animate-pulse rounded bg-muted" />
                    </CardHeader>
                    <CardContent>
                        <div className="h-8 w-16 animate-pulse rounded bg-muted" />
                        <div className="mt-2 h-3 w-32 animate-pulse rounded bg-muted" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

/**
 * Skeleton loading component for engagement chart
 */
export function ChartSkeleton() {
    return (
        <Card>
            <CardHeader>
                <div className="h-6 w-40 animate-pulse rounded bg-muted" />
                <div className="h-4 w-64 animate-pulse rounded bg-muted" />
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full animate-pulse rounded bg-muted" />
            </CardContent>
        </Card>
    );
}
