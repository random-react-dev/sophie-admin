"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
import { ChevronLeft, ChevronRight } from "lucide-react";

interface UserTableProps {
  users: User[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export function UserTable({
  users,
  page,
  perPage,
  total,
  totalPages,
}: UserTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/users?${params.toString()}`);
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
    // Placeholder logic - in production, check subscription status
    const metadata = user.user_metadata;
    if (metadata?.subscription_status === "paid") {
      return { label: "Paid", variant: "default" as const };
    }
    if (metadata?.subscription_status === "expired") {
      return { label: "Expired", variant: "destructive" as const };
    }
    return { label: "Trial", variant: "secondary" as const };
  };

  return (
    <div className="space-y-4">
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
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => {
                const status = getStatus(user);
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Link href={`/users/${user.id}`} className="flex items-center gap-3 hover:underline">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {getInitials(user.user_metadata?.full_name, user.email ?? "")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {user.user_metadata?.full_name || "—"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      {user.user_metadata?.country || "—"}
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
          Showing {(page - 1) * perPage + 1} to{" "}
          {Math.min(page * perPage, total)} of {total} users
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
