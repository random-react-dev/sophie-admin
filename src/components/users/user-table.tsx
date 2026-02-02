"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import type { UserWithMetrics } from "@/lib/database.types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";

interface UserTableProps {
  users: UserWithMetrics[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

type StatusFilter = "all" | "trial" | "active" | "expired";

function formatDuration(seconds: number): string {
  if (seconds === 0) return "—";
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

function getConsistencyColor(consistency: number): string {
  if (consistency >= 70) return "bg-green-100 text-green-800";
  if (consistency >= 40) return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
}

export function UserTable({ users, page, total, totalPages }: UserTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") ?? "",
  );

  const currentStatus = (searchParams.get("status") as StatusFilter) ?? "all";

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      if (!updates.page) {
        params.set("page", "1");
      }
      router.push(`/users?${params.toString()}`);
    },
    [router, searchParams],
  );

  const handlePageChange = (newPage: number) => {
    updateParams({ page: newPage.toString() });
  };

  const handleSearch = () => {
    updateParams({ search: searchInput || null });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchInput("");
    updateParams({ search: null });
  };

  const handleStatusFilter = (status: StatusFilter) => {
    updateParams({ status: status === "all" ? null : status });
  };

  const getInitials = (name: string | undefined, email: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return email.slice(0, 2).toUpperCase();
  };

  const getStatus = (user: UserWithMetrics) => {
    if (user.status === "active") {
      return { label: "Paid", variant: "default" as const, key: "active" };
    }
    if (user.status === "expired") {
      return {
        label: "Expired",
        variant: "destructive" as const,
        key: "expired",
      };
    }
    const trialLabel =
      user.trialDaysRemaining !== null && user.trialDaysRemaining >= 0
        ? `Trial (${user.trialDaysRemaining}d)`
        : "Trial";
    return { label: trialLabel, variant: "secondary" as const, key: "trial" };
  };

  const filteredUsers = users.filter((user) => {
    const status = getStatus(user);

    if (currentStatus !== "all" && status.key !== currentStatus) {
      return false;
    }

    const searchTerm = searchParams.get("search")?.toLowerCase();
    if (searchTerm) {
      const email = user.email?.toLowerCase() ?? "";
      const name = user.fullName?.toLowerCase() ?? "";
      if (!email.includes(searchTerm) && !name.includes(searchTerm)) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="space-y-4">
      {/* Search and Filter Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by email or name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pl-9 pr-9 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring h-10"
            />
            {searchInput && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button onClick={handleSearch}>Search</Button>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1">
          {(["all", "trial", "active", "expired"] as StatusFilter[]).map(
            (status) => (
              <Button
                key={status}
                variant={currentStatus === status ? "default" : "outline"}
                onClick={() => handleStatusFilter(status)}
                className="capitalize"
              >
                {status === "active" ? "Paid" : status}
              </Button>
            ),
          )}
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Consistency</TableHead>
              <TableHead>Avg Time</TableHead>
              <TableHead>Profiles</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => {
                const status = getStatus(user);
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Link
                        href={`/users/${user.id}`}
                        className="flex items-center gap-3 hover:underline"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {getInitials(user.fullName, user.email)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {user.fullName || "—"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>{user.country || "—"}</TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getConsistencyColor(user.consistency)}`}
                      >
                        {user.consistency}%
                      </span>
                    </TableCell>
                    <TableCell>{formatDuration(user.avgTimeSpent)}</TableCell>
                    <TableCell>{user.totalProfiles}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredUsers.length} of {total} users
          {(currentStatus !== "all" || searchParams.get("search")) &&
            " (filtered)"}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
