/**
 * Database types for Sophie Admin Dashboard
 * These types match the Supabase database schema
 */

export interface User {
    id: string;
    email: string;
    created_at: string;
    last_sign_in_at: string | null;
    user_metadata: {
        full_name?: string;
        country?: string;
        native_language?: string;
        app_language?: string;
        is_admin?: boolean;
        onboarding_data?: OnboardingData;
    };
}

export interface OnboardingData {
    main_goal?: string;
    fluency_speed?: string;
    learning_duration?: string;
    speaking_level?: string;
    confidence_level?: number;
    barriers?: string[];
    focus_areas?: string[];
    discovery_source?: string;
    completed_at?: string;
}

export interface LearningProfile {
    id: string;
    user_id: string;
    name: string;
    native_language: string;
    target_language: string;
    medium_language?: string;
    preferred_accent?: string;
    is_active: boolean;
    created_at: string;
}

export interface VocabularyItem {
    id: string;
    user_id: string;
    phrase: string;
    translation?: string;
    context?: string;
    created_at: string;
    language?: string;
    folder_id?: string;
}

export interface VocabularyFolder {
    id: string;
    user_id: string;
    name: string;
    created_at: string;
}

export interface ApiUsageLog {
    id: string;
    user_id: string;
    created_at: string;
    input_tokens: number;
    output_tokens: number;
    model: string;
    function_name?: string;
}

export interface AdminDailyMetrics {
    id: string;
    date: string;
    total_users: number;
    new_users: number;
    active_users: number;
    total_vocab_items: number;
    total_conversations: number;
    api_tokens_used: number;
    created_at: string;
}

// Dashboard Stats
export interface DashboardStats {
    totalUsers: number;
    activeUsers: number;
    newUsersThisWeek: number;
    totalVocabItems: number;
    totalApiTokens: number;
    trialUsers: number;
    paidUsers: number;
}

// User list with pagination
export interface UserListResponse {
    users: User[];
    total: number;
    page: number;
    perPage: number;
}
