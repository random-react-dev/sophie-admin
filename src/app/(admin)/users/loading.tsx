import {
  HeaderSkeleton,
  TableSkeleton,
} from "@/components/dashboard/stats-skeleton";

export default function UsersLoading() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <HeaderSkeleton />

      {/* Users Table */}
      <TableSkeleton rows={10} />
    </div>
  );
}
