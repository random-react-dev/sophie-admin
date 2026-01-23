import {
  HeaderSkeleton,
  TableSkeleton,
  ToolbarSkeleton,
  PaginationSkeleton,
} from "@/components/dashboard/stats-skeleton";

export default function UsersLoading() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <HeaderSkeleton />

      <div className="space-y-4">
        {/* Toolbar */}
        <ToolbarSkeleton />

        {/* Users Table */}
        <TableSkeleton rows={10} />

        {/* Pagination */}
        <PaginationSkeleton />
      </div>
    </div>
  );
}
