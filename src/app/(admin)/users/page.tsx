import { UserTable } from "@/components/users/user-table";
import { getUsersWithMetrics } from "@/lib/data";

export const dynamic = "force-dynamic";

interface UsersPageProps {
  searchParams: Promise<{ page?: string; perPage?: string }>;
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1", 10);
  const perPage = parseInt(params.perPage ?? "20", 10);

  const { users, total } = await getUsersWithMetrics(page, perPage);
  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">
          Manage and view all Sophie app users.
        </p>
      </div>

      <UserTable
        users={users}
        page={page}
        perPage={perPage}
        total={total}
        totalPages={totalPages}
      />
    </div>
  );
}
