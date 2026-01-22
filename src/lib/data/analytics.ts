import { createAdminClient } from "@/lib/supabase/server";
import type {
    LanguageCount,
    AccentCount,
    OnboardingStep,
    UserMetadata,
    OnboardingData,
} from "@/lib/database.types";

/**
 * Get distribution of target languages from learning profiles
 */
export async function getLanguageDistribution(): Promise<LanguageCount[]> {
    const supabase = await createAdminClient();

    const { data, error } = await supabase
        .from("learning_profiles")
        .select("target_language");

    if (error || !data) {
        console.error("Error fetching language distribution:", error);
        return [];
    }

    // Count occurrences of each language
    const counts = new Map<string, number>();

    data.forEach(profile => {
        const lang = profile.target_language;
        if (lang) {
            counts.set(lang, (counts.get(lang) ?? 0) + 1);
        }
    });

    // Convert to array and sort by count
    const result: LanguageCount[] = Array.from(counts.entries())
        .map(([language, count]) => ({ language, count }))
        .sort((a, b) => b.count - a.count);

    return result;
}

/**
 * Get distribution of preferred accents from learning profiles
 */
export async function getAccentPopularity(): Promise<AccentCount[]> {
    const supabase = await createAdminClient();

    const { data, error } = await supabase
        .from("learning_profiles")
        .select("preferred_accent");

    if (error || !data) {
        console.error("Error fetching accent popularity:", error);
        return [];
    }

    // Count occurrences of each accent
    const counts = new Map<string, number>();

    data.forEach(profile => {
        const accent = profile.preferred_accent ?? "Not specified";
        counts.set(accent, (counts.get(accent) ?? 0) + 1);
    });

    // Convert to array and sort by count
    const result: AccentCount[] = Array.from(counts.entries())
        .map(([accent, count]) => ({ accent, count }))
        .sort((a, b) => b.count - a.count);

    return result;
}

/**
 * Analyze onboarding funnel - find drop-off points
 */
export async function getOnboardingFunnel(): Promise<OnboardingStep[]> {
    const supabase = await createAdminClient();

    // Get all users with their onboarding data
    const { data, error } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
    });

    if (error || !data) {
        console.error("Error fetching users for onboarding funnel:", error);
        return [];
    }

    const totalUsers = data.users.length;
    if (totalUsers === 0) return [];

    // Define onboarding steps based on onboarding_data fields
    const steps = [
        "main_goal",
        "fluency_speed",
        "speaking_level",
        "confidence_level",
        "barriers",
        "focus_areas",
        "learning_duration",
        "discovery_source",
    ];

    const stepLabels: Record<string, string> = {
        main_goal: "Main Goal",
        fluency_speed: "Fluency Speed",
        speaking_level: "Speaking Level",
        confidence_level: "Confidence Level",
        barriers: "Barriers",
        focus_areas: "Focus Areas",
        learning_duration: "Learning Duration",
        discovery_source: "Discovery Source",
    };

    // Count users who completed each step
    const stepCounts = new Map<string, number>();

    data.users.forEach(user => {
        const metadata = user.user_metadata as UserMetadata | undefined;
        const onboarding = metadata?.onboarding_data as OnboardingData | undefined;

        if (!onboarding) return;

        steps.forEach(step => {
            const value = onboarding[step as keyof OnboardingData];
            if (value !== undefined && value !== null) {
                if (Array.isArray(value) && value.length > 0) {
                    stepCounts.set(step, (stepCounts.get(step) ?? 0) + 1);
                } else if (!Array.isArray(value)) {
                    stepCounts.set(step, (stepCounts.get(step) ?? 0) + 1);
                }
            }
        });
    });

    // Build funnel data
    const result: OnboardingStep[] = steps.map(step => {
        const usersCompleted = stepCounts.get(step) ?? 0;
        return {
            step: stepLabels[step] ?? step,
            usersCompleted,
            percentage: Math.round((usersCompleted / totalUsers) * 100),
        };
    });

    return result;
}

/**
 * Get admin users list
 */
export async function getAdminUsers(): Promise<Array<{ id: string; email: string; createdAt: string }>> {
    const supabase = await createAdminClient();

    const { data, error } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
    });

    if (error || !data) {
        console.error("Error fetching admin users:", error);
        return [];
    }

    // Filter to only admin users
    const adminUsers = data.users
        .filter(user => {
            const metadata = user.user_metadata as UserMetadata | undefined;
            return metadata?.is_admin === true;
        })
        .map(user => ({
            id: user.id,
            email: user.email ?? "",
            createdAt: user.created_at,
        }));

    return adminUsers;
}
