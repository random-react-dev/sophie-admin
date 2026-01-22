import { UserTable } from "@/components/users/user-table";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function getUsers(page: number = 1, perPage: number = 20) {
    const supabase = await createAdminClient();

    // Get paginated users
    const { data, error } = await supabase.auth.admin.listUsers({
        page,
        perPage,
    });

    if (error) {
        console.error("Error fetching users:", error);
        return { users: [], total: 0 };
    }

    // Total count comes from the response - estimate from current page if not available
    const total = data.users.length < perPage && page === 1
        ? data.users.length
        : page * perPage + 1; // Conservative estimate

    return {
        users: data.users,
        total,
    };
}

interface UsersPageProps {
    searchParams: Promise<{ page?: string; perPage?: string }>;
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
    const params = await searchParams;
    const page = parseInt(params.page ?? "1", 10);
    const perPage = parseInt(params.perPage ?? "20", 10);

    const { users, total } = await getUsers(page, perPage);
    const totalPages = Math.ceil(total / perPage);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Users</h1>
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
