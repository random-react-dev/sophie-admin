/**
 * Database types for Sophie Admin Dashboard
 * These types match the Supabase database schema for the Sophie app
 */

// ============================================
// Auth User Types (from auth.users table)
// ============================================

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

export interface UserMetadata {
    full_name?: string;
    country?: string;
    native_language?: string;
    app_language?: string;
    is_admin?: boolean;
    onboarding_data?: OnboardingData;
    // Subscription-related fields (may be set by RevenueCat or manually)
    subscription_status?: 'trial' | 'active' | 'expired' | 'cancelled';
    subscription_plan?: string;
    trial_ends_at?: string;
}

export interface AuthUser {
    id: string;
    email: string;
    email_confirmed_at?: string;
    created_at: string;
    updated_at?: string;
    last_sign_in_at?: string;
    user_metadata: UserMetadata;
    app_metadata?: Record<string, unknown>;
}

// ============================================
// Learning Profile Types
// ============================================

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

// ============================================
// Vocabulary Types
// ============================================

export interface VocabularyFolder {
    id: string;
    user_id: string;
    name: string;
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

// ============================================
// Dashboard Types
// ============================================

export interface DashboardStats {
    totalUsers: number;
    activeUsers: number;
    newUsersThisWeek: number;
    totalVocabItems: number;
    trialUsers: number;
    paidUsers: number;
    // Enhanced metrics
    activeToday: number;            // Users signed in today
    stickinessRatio: number;        // DAU/MAU percentage (0-100)
    trialConversionRate: number;    // % of trials that converted (0-100)
    retentionD7: number;            // 7-day retention % (0-100)
    retentionD30: number;           // 30-day retention % (0-100)
}

export interface EngagementDataPoint {
    date: string;
    activeUsers: number;
    newUsers: number;
}

// ============================================
// User List Types
// ============================================

export interface UserListItem {
    id: string;
    email: string;
    fullName?: string;
    country?: string;
    status: 'trial' | 'active' | 'expired' | 'unknown';
    lastActiveAt?: string;
    createdAt: string;
}

export interface UserListResponse {
    users: UserListItem[];
    total: number;
    page: number;
    perPage: number;
}

// ============================================
// Analytics Types
// ============================================

export interface LanguageCount {
    language: string;
    count: number;
}

export interface AccentCount {
    accent: string;
    count: number;
}

export interface OnboardingStep {
    step: string;
    usersCompleted: number;
    percentage: number;
}

// ============================================
// User Detail Types
// ============================================

export interface UserDetail {
    id: string;
    email: string;
    createdAt: string;
    lastSignInAt?: string;
    metadata: UserMetadata;
    learningProfiles: LearningProfile[];
    vocabularyCount: number;
}

// ============================================
// Form Submissions / Leads Types
// ============================================

export interface FormSubmissionData {
    language?: string;
    level?: string;
    goal?: string;
    location?: string;
    [key: string]: unknown;
}

export interface FormSubmission {
    id: string;
    form_type: string;
    email: string;
    data: FormSubmissionData;
    source: string | null;
    created_at: string;
}
