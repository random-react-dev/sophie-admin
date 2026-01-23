"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

/**
 * Single card skeleton - reusable for stat cards
 */
export function CardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        <div className="h-9 w-9 animate-pulse rounded-lg bg-muted" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="h-8 w-16 animate-pulse rounded bg-muted" />
          <div className="flex items-center gap-2">
            <div className="h-4 w-12 animate-pulse rounded bg-muted" />
            <div className="h-3 w-24 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Row of stat cards skeleton - configurable count and columns
 */
export function StatsRowSkeleton({
  count = 4,
  columns = "lg:grid-cols-4",
}: {
  count?: number;
  columns?: string;
}) {
  return (
    <div className={`grid gap-4 md:grid-cols-2 ${columns}`}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * API card skeleton
 */
export function ApiCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
        <div className="h-9 w-9 animate-pulse rounded-lg bg-muted" />
      </CardHeader>
      <CardContent>
        <div className="h-10 w-full animate-pulse rounded bg-muted" />
        <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-muted" />
        <div className="mt-3 h-4 w-48 animate-pulse rounded bg-muted" />
      </CardContent>
    </Card>
  );
}

/**
 * Chart skeleton for engagement charts
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

/**
 * Table skeleton for users page
 */
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/**
 * Table skeleton for users page
 */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-md border overflow-x-auto bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Last Active</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRow key={i}>
              {/* User Column: Avatar + Name/Email */}
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
                  <div className="space-y-1">
                    <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-32 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              </TableCell>
              {/* Country Column */}
              <TableCell>
                <div className="h-4 w-16 animate-pulse rounded bg-muted" />
              </TableCell>
              {/* Status Column */}
              <TableCell>
                <div className="h-5 w-12 animate-pulse rounded-full bg-muted" />
              </TableCell>
              {/* Created Column */}
              <TableCell>
                <div className="h-4 w-20 animate-pulse rounded bg-muted" />
              </TableCell>
              {/* Last Active Column */}
              <TableCell>
                <div className="h-4 w-20 animate-pulse rounded bg-muted" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

/**
 * Toolbar skeleton for list pages
 */
export function ToolbarSkeleton() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="h-10 w-full max-w-md animate-pulse rounded-md bg-muted" />
      <div className="flex items-center gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-10 w-20 animate-pulse rounded-md bg-muted"
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Pagination skeleton for list pages
 */
export function PaginationSkeleton() {
  return (
    <div className="flex items-center justify-between">
      <div className="h-4 w-40 animate-pulse rounded bg-muted" />
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 animate-pulse rounded-md bg-muted" />
        <div className="h-8 w-8 animate-pulse rounded-md bg-muted" />
      </div>
    </div>
  );
}

/**
 * Info card skeleton for system page
 */
export function InfoCardSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 animate-pulse rounded bg-muted" />
          <div className="h-5 w-32 animate-pulse rounded bg-muted" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex justify-between items-center">
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="h-5 w-20 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/**
 * Page header skeleton
 */
export function HeaderSkeleton() {
  return (
    <div>
      <div className="h-9 w-40 animate-pulse rounded bg-muted" />
      <div className="mt-2 h-5 w-72 animate-pulse rounded bg-muted" />
    </div>
  );
}

/**
 * Legacy StatsSkeleton - kept for backwards compatibility but deprecated
 * @deprecated Use StatsRowSkeleton instead
 */
export function StatsSkeleton() {
  return (
    <>
      <StatsRowSkeleton count={4} columns="lg:grid-cols-4" />
      <StatsRowSkeleton count={4} columns="lg:grid-cols-4" />
      <StatsRowSkeleton count={3} columns="lg:grid-cols-3" />
    </>
  );
}
