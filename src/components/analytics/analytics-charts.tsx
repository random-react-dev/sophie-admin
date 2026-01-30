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
    Legend,
    Line,
    LineChart,
    CartesianGrid,
} from "recharts";
import type { LanguageCount, AccentCount, OnboardingStep, DailyApiUsage, ModelUsageBreakdown } from "@/lib/database.types";

const COLORS = ["#8b5cf6", "#06b6d4", "#22c55e", "#f59e0b", "#ef4444", "#ec4899", "#6366f1", "#14b8a6"];

interface AnalyticsChartsProps {
    languages: LanguageCount[];
    accents: AccentCount[];
    onboardingFunnel: OnboardingStep[];
    completionRate: string;
}

interface ApiUsageChartsProps {
    dailyUsage: DailyApiUsage[];
    modelBreakdown: ModelUsageBreakdown[];
    hasData: boolean;
}

export function AnalyticsCharts({
    languages,
    accents,
    onboardingFunnel,
    completionRate,
}: AnalyticsChartsProps) {
    // Transform data for charts - limit to top 8
    const languageData = languages.slice(0, 8).map((item, index) => ({
        ...item,
        color: COLORS[index % COLORS.length],
    }));

    const accentData = accents.slice(0, 6).map((item, index) => ({
        name: item.accent,
        value: item.count,
        color: COLORS[index % COLORS.length],
    }));

    const funnelData = onboardingFunnel.map((item) => ({
        step: item.step,
        users: item.usersCompleted,
        percentage: item.percentage,
    }));

    return (
        <>
            <div className="grid gap-6 md:grid-cols-2">
                {/* Language Distribution - Horizontal Bar */}
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
                                    <BarChart
                                        data={languageData}
                                        layout="vertical"
                                        margin={{ left: 10, right: 30 }}
                                    >
                                        <XAxis type="number" />
                                        <YAxis
                                            type="category"
                                            dataKey="language"
                                            width={100}
                                            tick={{ fontSize: 12 }}
                                        />
                                        <Tooltip
                                            formatter={(value: number) => [`${value} profiles`, "Count"]}
                                        />
                                        <Bar
                                            dataKey="count"
                                            radius={[0, 4, 4, 0]}
                                            label={{ position: 'right', fontSize: 11 }}
                                        >
                                            {languageData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Accent Popularity - Donut Chart */}
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
                                    <PieChart>
                                        <Pie
                                            data={accentData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={2}
                                        >
                                            {accentData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value: number) => [`${value} users`, "Count"]}
                                        />
                                        <Legend
                                            layout="vertical"
                                            align="right"
                                            verticalAlign="middle"
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Onboarding Funnel - With Progress Bars */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Onboarding Funnel</span>
                        <span className="text-sm font-normal text-muted-foreground">
                            {completionRate}% completion rate
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {funnelData.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                            No onboarding data available yet.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {funnelData.map((item, index) => {
                                // Color based on drop-off rate
                                const bgColor = item.percentage >= 80
                                    ? "bg-green-500"
                                    : item.percentage >= 50
                                        ? "bg-yellow-500"
                                        : "bg-red-500";

                                return (
                                    <div key={item.step} className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium">
                                                {index + 1}. {item.step}
                                            </span>
                                            <span className="text-muted-foreground">
                                                {item.users} users ({item.percentage}%)
                                            </span>
                                        </div>
                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${bgColor} transition-all`}
                                                style={{ width: `${item.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    );
}

export function ApiUsageCharts({ dailyUsage, modelBreakdown, hasData }: ApiUsageChartsProps) {
    if (!hasData) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>API Token Usage</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        <p>API usage tracking is not yet enabled.</p>
                        <p className="text-sm mt-2">Enable logging in the mobile app to see token usage analytics here.</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const modelData = modelBreakdown.map((item, index) => ({
        name: item.model,
        value: item.totalTokens,
        calls: item.calls,
        cost: item.costCents / 100,
        color: COLORS[index % COLORS.length],
    }));

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Daily Token Usage</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={dailyUsage} margin={{ left: 0, right: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                                <YAxis tick={{ fontSize: 11 }} />
                                <Tooltip
                                    formatter={(value: number, name: string) => [
                                        value.toLocaleString(),
                                        name === "inputTokens" ? "Input Tokens" : "Output Tokens"
                                    ]}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="inputTokens"
                                    stroke="#8b5cf6"
                                    strokeWidth={2}
                                    dot={false}
                                    name="Input Tokens"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="outputTokens"
                                    stroke="#06b6d4"
                                    strokeWidth={2}
                                    dot={false}
                                    name="Output Tokens"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Usage by Model</CardTitle>
                </CardHeader>
                <CardContent>
                    {modelData.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                            No model data available yet.
                        </p>
                    ) : (
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={modelData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={80}
                                        paddingAngle={2}
                                    >
                                        {modelData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value: number) => [
                                            `${value.toLocaleString()} tokens`,
                                            "Usage"
                                        ]}
                                    />
                                    <Legend layout="vertical" align="right" verticalAlign="middle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
