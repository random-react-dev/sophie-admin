import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { HeaderSkeleton } from "@/components/dashboard/stats-skeleton";

export default function SubmissionsLoading() {
  return (
    <div className="space-y-6">
      <HeaderSkeleton />

      <Card>
        <CardHeader>
          <div className="h-5 w-40 animate-pulse rounded bg-muted" />
          <div className="mt-1 h-4 w-64 animate-pulse rounded bg-muted" />
        </CardHeader>
        <CardContent>
          <div className="h-[320px] w-full animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    </div>
  );
}
