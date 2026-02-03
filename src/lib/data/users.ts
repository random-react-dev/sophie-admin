import { createAdminClient } from "@/lib/supabase/server";
import type {
  UserListItem,
  UserListResponse,
  UserDetail,
  LearningProfile,
  UserMetadata,
  UserWithMetrics,
} from "@/lib/database.types";

interface UserStatsRow {
  user_id: string;
  total_speaking_seconds: number;
  total_conversations: number;
}

/**
 * Get paginated list of users
 */
export async function getUsers(
  page: number = 1,
  perPage: number = 20,
  search?: string,
): Promise<UserListResponse> {
  const supabase = await createAdminClient();

  // Fetch users from auth admin API
  const { data, error } = await supabase.auth.admin.listUsers({
    page,
    perPage,
  });

  if (error || !data) {
    console.error("Error fetching users:", error);
    return {
      users: [],
      total: 0,
      page,
      perPage,
    };
  }

  let users = data.users;

  // Filter by search if provided
  if (search) {
    const searchLower = search.toLowerCase();
    users = users.filter((user) => {
      const email = user.email?.toLowerCase() ?? "";
      const fullName = (
        (user.user_metadata as UserMetadata)?.full_name ?? ""
      ).toLowerCase();
      return email.includes(searchLower) || fullName.includes(searchLower);
    });
  }

  // Map to UserListItem
  const mappedUsers: UserListItem[] = users.map((user) => {
    const metadata = user.user_metadata as UserMetadata | undefined;
    const status = metadata?.subscription_status ?? "unknown";

    return {
      id: user.id,
      email: user.email ?? "",
      fullName: metadata?.full_name,
      country: metadata?.country,
      status:
        status === "active"
          ? "active"
          : status === "expired"
            ? "expired"
            : status === "trial"
              ? "trial"
              : "unknown",
      lastActiveAt: user.last_sign_in_at ?? undefined,
      createdAt: user.created_at,
    };
  });

  return {
    users: mappedUsers,
    total: data.total ?? users.length,
    page,
    perPage,
  };
}

/**
 * Get single user details with all related data
 */
export async function getUserById(userId: string): Promise<UserDetail | null> {
  const supabase = await createAdminClient();

  // Get user from auth admin API
  const { data: userData, error: userError } =
    await supabase.auth.admin.getUserById(userId);

  if (userError || !userData.user) {
    console.error("Error fetching user:", userError);
    return null;
  }

  const user = userData.user;
  const metadata = user.user_metadata as UserMetadata;

  // Get learning profiles for this user
  const { data: profiles, error: profilesError } = await supabase
    .from("learning_profiles")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (profilesError) {
    console.error("Error fetching learning profiles:", profilesError);
  }

  // Get vocabulary count
  const { count: vocabCount, error: vocabError } = await supabase
    .from("vocabulary")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (vocabError) {
    console.error("Error fetching vocabulary count:", vocabError);
  }

  return {
    id: user.id,
    email: user.email ?? "",
    createdAt: user.created_at,
    lastSignInAt: user.last_sign_in_at ?? undefined,
    metadata: metadata,
    learningProfiles: (profiles as LearningProfile[]) ?? [],
    vocabularyCount: vocabCount ?? 0,
  };
}

/**
 * Get count of users by status
 */
export async function getUserCountsByStatus(): Promise<{
  trial: number;
  active: number;
  expired: number;
}> {
  const supabase = await createAdminClient();

  const { data, error } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (error || !data) {
    return { trial: 0, active: 0, expired: 0 };
  }

  let trial = 0;
  let active = 0;
  let expired = 0;

  data.users.forEach((user) => {
    const metadata = user.user_metadata as UserMetadata | undefined;
    const status = metadata?.subscription_status;

    if (status === "active") {
      active++;
    } else if (status === "expired") {
      expired++;
    } else {
      trial++;
    }
  });

  return { trial, active, expired };
}

/**
 * Calculate user consistency (days active in last 30 days / 30 * 100)
 */
function calculateConsistency(
  lastSignIn: string | null,
  createdAt: string,
): number {
  if (!lastSignIn) return 0;

  const now = new Date();
  const lastActive = new Date(lastSignIn);
  const created = new Date(createdAt);

  const daysSinceLastActive = Math.floor(
    (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (daysSinceLastActive > 30) return 0;

  const accountAgeDays = Math.floor(
    (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24),
  );
  const relevantDays = Math.min(accountAgeDays, 30);

  if (relevantDays <= 0) return 100;

  const activeDaysEstimate = Math.max(1, relevantDays - daysSinceLastActive);
  return Math.min(100, Math.round((activeDaysEstimate / relevantDays) * 100));
}

/**
 * Calculate trial days remaining
 */
function calculateTrialDaysRemaining(
  metadata: UserMetadata | undefined,
  createdAt: string,
): number | null {
  const status = metadata?.subscription_status;
  if (status === "active" || status === "expired") return null;

  const trialEndsAt = metadata?.trial_ends_at;
  const now = new Date();

  if (trialEndsAt) {
    const endDate = new Date(trialEndsAt);
    const daysRemaining = Math.ceil(
      (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );
    return Math.max(0, daysRemaining);
  }

  const created = new Date(createdAt);
  const defaultTrialDays = 7;
  const trialEnd = new Date(
    created.getTime() + defaultTrialDays * 24 * 60 * 60 * 1000,
  );
  const daysRemaining = Math.ceil(
    (trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );
  return Math.max(0, daysRemaining);
}

/**
 * Get users with enhanced metrics (consistency, avg time, profiles)
 */
export async function getUsersWithMetrics(
  page: number = 1,
  perPage: number = 20,
  search?: string,
): Promise<{ users: UserWithMetrics[]; total: number }> {
  const supabase = await createAdminClient();

  let targetUsers = [];
  let total = 0;

  if (search) {
    // Search Mode: Fetch all (up to 1000) to find matches across all pages
    const { data: allUsersData, error: allUsersError } =
      await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
      });

    if (allUsersError || !allUsersData) {
      return { users: [], total: 0 };
    }

    const searchLower = search.toLowerCase();
    const filteredUsers = allUsersData.users.filter((user) => {
      const email = user.email?.toLowerCase() ?? "";
      const fullName = (
        (user.user_metadata as UserMetadata)?.full_name ?? ""
      ).toLowerCase();
      return email.includes(searchLower) || fullName.includes(searchLower);
    });

    total = filteredUsers.length;

    // Manual pagination of filtered results
    const start = (page - 1) * perPage;
    const end = start + perPage;
    targetUsers = filteredUsers.slice(start, end);
  } else {
    // Standard Mode: Efficient DB pagination
    const { data: usersData, error: usersError } =
      await supabase.auth.admin.listUsers({
        page,
        perPage,
      });

    if (usersError || !usersData) {
      return { users: [], total: 0 };
    }

    targetUsers = usersData.users;
    total = usersData.total ?? usersData.users.length;
  }

  // Common: Fetch metrics for the specific users we are displaying
  const userIds = targetUsers.map((u) => u.id);

  if (userIds.length === 0) {
    return { users: [], total };
  }

  const { data: statsData } = await supabase
    .from("user_stats")
    .select("user_id, total_speaking_seconds, total_conversations")
    .in("user_id", userIds);

  const statsMap = new Map<string, UserStatsRow>();
  (statsData ?? []).forEach((row) => {
    statsMap.set(row.user_id, row as UserStatsRow);
  });

  const { data: profilesData } = await supabase
    .from("learning_profiles")
    .select("user_id")
    .in("user_id", userIds);

  const profileCountMap = new Map<string, number>();
  (profilesData ?? []).forEach((row) => {
    const current = profileCountMap.get(row.user_id) ?? 0;
    profileCountMap.set(row.user_id, current + 1);
  });

  const users: UserWithMetrics[] = targetUsers.map((user) => {
    const metadata = user.user_metadata as UserMetadata | undefined;
    const status = metadata?.subscription_status ?? "unknown";
    const stats = statsMap.get(user.id);
    const totalProfiles = profileCountMap.get(user.id) ?? 0;

    const totalSeconds = stats?.total_speaking_seconds ?? 0;
    const totalConversations = stats?.total_conversations ?? 0;
    const avgTimeSpent =
      totalConversations > 0
        ? Math.round(totalSeconds / totalConversations)
        : 0;

    return {
      id: user.id,
      email: user.email ?? "",
      fullName: metadata?.full_name,
      country: metadata?.country,
      status:
        status === "active"
          ? "active"
          : status === "expired"
            ? "expired"
            : status === "trial"
              ? "trial"
              : "unknown",
      lastActiveAt: user.last_sign_in_at ?? undefined,
      createdAt: user.created_at,
      consistency: calculateConsistency(
        user.last_sign_in_at ?? null,
        user.created_at,
      ),
      avgTimeSpent,
      totalProfiles,
      trialDaysRemaining: calculateTrialDaysRemaining(
        metadata,
        user.created_at,
      ),
    };
  });

  return {
    users,
    total,
  };
}
