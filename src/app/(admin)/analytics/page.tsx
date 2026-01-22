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

// Mock data - will be replaced with real queries
const languageData = [
    { language: "Spanish", count: 450, color: "#8b5cf6" },
    { language: "French", count: 320, color: "#06b6d4" },
    { language: "German", count: 280, color: "#22c55e" },
    { language: "Japanese", count: 190, color: "#f59e0b" },
    { language: "Korean", count: 150, color: "#ef4444" },
    { language: "Chinese", count: 120, color: "#ec4899" },
];

const accentData = [
    { accent: "American", count: 380 },
    { accent: "British", count: 290 },
    { accent: "Australian", count: 120 },
    { accent: "Spanish (Spain)", count: 200 },
    { accent: "Spanish (Mexico)", count: 150 },
];

const onboardingFunnel = [
    { step: "Profile", users: 1000 },
    { step: "Goal", users: 920 },
    { step: "Speed", users: 850 },
    { step: "Duration", users: 800 },
    { step: "Level", users: 750 },
    { step: "Confidence", users: 700 },
    { step: "Barriers", users: 650 },
    { step: "Focus", users: 600 },
    { step: "Discovery", users: 580 },
    { step: "Complete", users: 550 },
];

export default function AnalyticsPage() {
    const completionRate = ((550 / 1000) * 100).toFixed(1);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                <p className="text-muted-foreground">
                    Insights into language learning patterns and user behavior.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Language Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Most Popular Languages</CardTitle>
                    </CardHeader>
                    <CardContent>
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
                    </CardContent>
                </Card>

                {/* Accent Popularity */}
                <Card>
                    <CardHeader>
                        <CardTitle>Accent Preferences</CardTitle>
                    </CardHeader>
                    <CardContent>
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
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={onboardingFunnel}>
                                <XAxis dataKey="step" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="users" fill="#22c55e" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Drop-off Analysis */}
            <Card>
                <CardHeader>
                    <CardTitle>Drop-off Points</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {onboardingFunnel.slice(0, -1).map((step, index) => {
                            const nextStep = onboardingFunnel[index + 1];
                            const dropoff = step.users - nextStep.users;
                            const dropoffPercent = ((dropoff / step.users) * 100).toFixed(1);
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
                </CardContent>
            </Card>
        </div>
    );
}
