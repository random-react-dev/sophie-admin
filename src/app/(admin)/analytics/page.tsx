import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticsCharts } from "@/components/analytics/analytics-charts";
import {
    getLanguageDistribution,
    getAccentPopularity,
    getOnboardingFunnel,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
    // Fetch real data from Supabase
    const [languages, accents, onboardingFunnel] = await Promise.all([
        getLanguageDistribution(),
        getAccentPopularity(),
        getOnboardingFunnel(),
    ]);

    // Calculate completion rate
    const totalUsers = onboardingFunnel.length > 0 ? onboardingFunnel[0].usersCompleted : 0;
    const completedUsers = onboardingFunnel.length > 0
        ? onboardingFunnel[onboardingFunnel.length - 1].usersCompleted
        : 0;
    const completionRate = totalUsers > 0
        ? ((completedUsers / totalUsers) * 100).toFixed(1)
        : "0.0";

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                <p className="text-muted-foreground">
                    Insights into language learning patterns and user behavior.
                </p>
            </div>

            {/* Charts - Client Component for Recharts */}
            <AnalyticsCharts
                languages={languages}
                accents={accents}
                onboardingFunnel={onboardingFunnel}
                completionRate={completionRate}
            />

            {/* Drop-off Analysis */}
            <Card>
                <CardHeader>
                    <CardTitle>Onboarding Drop-off Points</CardTitle>
                </CardHeader>
                <CardContent>
                    {onboardingFunnel.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                            No onboarding data available yet.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {onboardingFunnel.slice(0, -1).map((step, index) => {
                                const nextStep = onboardingFunnel[index + 1];
                                const dropoff = step.usersCompleted - nextStep.usersCompleted;
                                const dropoffPercent = step.usersCompleted > 0
                                    ? ((dropoff / step.usersCompleted) * 100).toFixed(1)
                                    : "0.0";
                                return (
                                    <div key={step.step} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{step.step}</span>
                                            <span className="text-muted-foreground">→</span>
                                            <span className="font-medium">{nextStep.step}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm text-muted-foreground">
                                                {dropoff} users dropped
                                            </span>
                                            <span
                                                className={`text-sm font-medium ${parseFloat(dropoffPercent) > 10
                                                        ? "text-red-600"
                                                        : "text-green-600"
                                                    }`}
                                            >
                                                -{dropoffPercent}%
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
