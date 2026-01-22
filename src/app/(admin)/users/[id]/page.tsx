import { notFound } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, BookOpen, MessageSquare, Globe } from "lucide-react";

export const dynamic = "force-dynamic";

interface UserDetailPageProps {
    params: Promise<{ id: string }>;
}

async function getUserDetails(userId: string) {
    const supabase = await createAdminClient();

    // Get user from auth
    const { data: userData, error: userError } =
        await supabase.auth.admin.getUserById(userId);

    if (userError || !userData.user) {
        return null;
    }

    // Get learning profiles
    const { data: profiles } = await supabase
        .from("learning_profiles")
        .select("*")
        .eq("user_id", userId);

    // Get vocabulary count
    const { count: vocabCount } = await supabase
        .from("vocabulary")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

    return {
        user: userData.user,
        profiles: profiles ?? [],
        vocabCount: vocabCount ?? 0,
    };
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
    const { id } = await params;
    const data = await getUserDetails(id);

    if (!data) {
        notFound();
    }

    const { user, profiles, vocabCount } = data;
    const metadata = user.user_metadata;
    const onboardingData = metadata?.onboarding_data;

    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return "—";
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/users">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Users
                    </Link>
                </Button>
            </div>

            {/* User Profile Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarFallback className="text-xl">
                                {getInitials(metadata?.full_name, user.email ?? "")}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-2xl">
                                {metadata?.full_name || "No Name"}
                            </CardTitle>
                            <p className="text-muted-foreground">{user.email}</p>
                            <div className="flex gap-2 mt-2">
                                <Badge variant="secondary">{metadata?.country || "—"}</Badge>
                                <Badge variant="outline">Trial</Badge>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div>
                            <p className="text-sm text-muted-foreground">Created</p>
                            <p className="font-medium">{formatDate(user.created_at)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Last Sign In</p>
                            <p className="font-medium">{formatDate(user.last_sign_in_at)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Native Language</p>
                            <p className="font-medium">{metadata?.native_language || "—"}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Language Profiles</CardTitle>
                        <Globe className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{profiles.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Vocabulary Items</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{vocabCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Conversations</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">—</div>
                    </CardContent>
                </Card>
            </div>

            {/* Onboarding Answers */}
            {onboardingData && (
                <Card>
                    <CardHeader>
                        <CardTitle>Onboarding Answers</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-sm text-muted-foreground">Main Goal</p>
                                <p className="font-medium">{onboardingData.main_goal || "—"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Fluency Speed</p>
                                <p className="font-medium">{onboardingData.fluency_speed || "—"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Learning Duration</p>
                                <p className="font-medium">{onboardingData.learning_duration || "—"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Speaking Level</p>
                                <p className="font-medium">{onboardingData.speaking_level || "—"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Confidence Level</p>
                                <p className="font-medium">{onboardingData.confidence_level || "—"}/5</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Discovery Source</p>
                                <p className="font-medium">{onboardingData.discovery_source || "—"}</p>
                            </div>
                        </div>
                        <Separator />
                        <div>
                            <p className="text-sm text-muted-foreground mb-2">Barriers</p>
                            <div className="flex flex-wrap gap-2">
                                {onboardingData.barriers?.map((barrier: string) => (
                                    <Badge key={barrier} variant="outline">{barrier}</Badge>
                                )) || <span className="text-muted-foreground">—</span>}
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-2">Focus Areas</p>
                            <div className="flex flex-wrap gap-2">
                                {onboardingData.focus_areas?.map((area: string) => (
                                    <Badge key={area} variant="outline">{area}</Badge>
                                )) || <span className="text-muted-foreground">—</span>}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Language Profiles */}
            {profiles.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Language Profiles</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            {profiles.map((profile) => (
                                <div
                                    key={profile.id}
                                    className="rounded-lg border p-4 space-y-2"
                                >
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium">{profile.name}</h4>
                                        {profile.is_active && (
                                            <Badge variant="default">Active</Badge>
                                        )}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        <p>Target: {profile.target_language}</p>
                                        <p>Native: {profile.native_language}</p>
                                        {profile.preferred_accent && (
                                            <p>Accent: {profile.preferred_accent}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
