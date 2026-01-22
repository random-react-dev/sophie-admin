"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Bar,
    BarChart,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";
import type { LanguageCount, AccentCount, OnboardingStep } from "@/lib/database.types";

// Color palette for charts
const COLORS = ["#8b5cf6", "#06b6d4", "#22c55e", "#f59e0b", "#ef4444", "#ec4899", "#6366f1", "#14b8a6"];

interface AnalyticsChartsProps {
    languages: LanguageCount[];
    accents: AccentCount[];
    onboardingFunnel: OnboardingStep[];
    completionRate: string;
}

export function AnalyticsCharts({
    languages,
    accents,
    onboardingFunnel,
    completionRate,
}: AnalyticsChartsProps) {
    // Transform data for charts
    const languageData = languages.map((item, index) => ({
        ...item,
        color: COLORS[index % COLORS.length],
    }));

    const accentData = accents.map((item) => ({
        ...item,
        count: item.count,
    }));

    const funnelData = onboardingFunnel.map((item) => ({
        step: item.step,
        users: item.usersCompleted,
    }));

    return (
        <>
            <div className="grid gap-6 md:grid-cols-2">
                {/* Language Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Most Popular Languages</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {languageData.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">
                                No language data available yet.
                            </p>
                        ) : (
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={languageData}
                                            dataKey="count"
                                            nameKey="language"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            label={({ name, percent }) =>
                                                `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                                            }
                                        >
                                            {languageData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Accent Popularity */}
                <Card>
                    <CardHeader>
                        <CardTitle>Accent Preferences</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {accentData.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">
                                No accent data available yet.
                            </p>
                        ) : (
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={accentData} layout="vertical">
                                        <XAxis type="number" />
                                        <YAxis type="category" dataKey="accent" width={120} />
                                        <Tooltip />
                                        <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Onboarding Funnel */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        Onboarding Funnel
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                            ({completionRate}% completion rate)
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {funnelData.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                            No onboarding data available yet.
                        </p>
                    ) : (
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={funnelData}>
                                    <XAxis dataKey="step" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="users" fill="#22c55e" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    );
}
