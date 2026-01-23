import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  HeaderSkeleton,
  InfoCardSkeleton,
} from "@/components/dashboard/stats-skeleton";

export default function SystemLoading() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <HeaderSkeleton />

      {/* Environment + Supabase Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <InfoCardSkeleton rows={3} />
        <InfoCardSkeleton rows={3} />
      </div>

      {/* Gemini API Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 animate-pulse rounded bg-muted" />
            <div>
              <div className="h-5 w-48 animate-pulse rounded bg-muted" />
              <div className="mt-1 h-4 w-40 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="h-10 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-16 animate-pulse rounded bg-muted" />
              <div className="flex gap-2">
                <div className="h-6 w-20 animate-pulse rounded bg-muted" />
                <div className="h-6 w-16 animate-pulse rounded bg-muted" />
                <div className="h-6 w-20 animate-pulse rounded bg-muted" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-4 w-32 animate-pulse rounded bg-muted" />
              <div className="h-12 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-44 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Users */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 animate-pulse rounded bg-muted" />
            <div>
              <div className="h-5 w-32 animate-pulse rounded bg-muted" />
              <div className="mt-1 h-4 w-64 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div>
                <div className="h-4 w-48 animate-pulse rounded bg-muted" />
                <div className="mt-1 h-3 w-24 animate-pulse rounded bg-muted" />
              </div>
              <div className="h-5 w-14 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* API Keys Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 animate-pulse rounded bg-muted" />
            <div className="h-5 w-28 animate-pulse rounded bg-muted" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
              >
                <div className="h-4 w-28 animate-pulse rounded bg-muted" />
                <div className="h-5 w-14 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
