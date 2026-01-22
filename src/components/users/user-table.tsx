"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { User } from "@supabase/supabase-js";
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
  users: User[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

type StatusFilter = "all" | "trial" | "active" | "expired";

export function UserTable({
  users,
  page,
  total,
  totalPages,
}: UserTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");

  const currentStatus = (searchParams.get("status") as StatusFilter) ?? "all";

  const updateParams = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    // Reset to page 1 when filters change
    if (!updates.page) {
      params.set("page", "1");
    }
    router.push(`/users?${params.toString()}`);
  }, [router, searchParams]);

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

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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

  const getStatus = (user: User) => {
    const metadata = user.user_metadata;
    if (metadata?.subscription_status === "active") {
      return { label: "Paid", variant: "default" as const, key: "active" };
    }
    if (metadata?.subscription_status === "expired") {
      return { label: "Expired", variant: "destructive" as const, key: "expired" };
    }
    return { label: "Trial", variant: "secondary" as const, key: "trial" };
  };

  // Client-side filtering based on URL params
  const filteredUsers = users.filter(user => {
    const status = getStatus(user);

    // Status filter
    if (currentStatus !== "all" && status.key !== currentStatus) {
      return false;
    }

    // Search filter (on email and name)
    const searchTerm = searchParams.get("search")?.toLowerCase();
    if (searchTerm) {
      const email = user.email?.toLowerCase() ?? "";
      const name = (user.user_metadata?.full_name as string)?.toLowerCase() ?? "";
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
              className="w-full pl-9 pr-9 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
          <Button size="sm" onClick={handleSearch}>
            Search
          </Button>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1">
          {(["all", "trial", "active", "expired"] as StatusFilter[]).map((status) => (
            <Button
              key={status}
              size="sm"
              variant={currentStatus === status ? "default" : "outline"}
              onClick={() => handleStatusFilter(status)}
              className="capitalize"
            >
              {status === "active" ? "Paid" : status}
            </Button>
          ))}
        </div>
      </div>

      <div className="rounded-md border">
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
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => {
                const status = getStatus(user);
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Link href={`/users/${user.id}`} className="flex items-center gap-3 hover:underline">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {getInitials(user.user_metadata?.full_name as string | undefined, user.email ?? "")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {(user.user_metadata?.full_name as string) || "—"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      {(user.user_metadata?.country as string) || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(user.created_at)}</TableCell>
                    <TableCell>{formatDate(user.last_sign_in_at)}</TableCell>
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
          {(currentStatus !== "all" || searchParams.get("search")) && " (filtered)"}
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

