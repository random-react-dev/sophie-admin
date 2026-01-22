"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

interface EngagementChartProps {
    data: Array<{
        date: string;
        activeUsers: number;
        newUsers: number;
    }>;
}

export function EngagementChart({ data }: EngagementChartProps) {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>User Engagement</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="activeUsers" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="newUsers" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis
                                dataKey="date"
                                className="text-xs"
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                className="text-xs"
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--card))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "8px",
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="activeUsers"
                                stroke="#8b5cf6"
                                fillOpacity={1}
                                fill="url(#activeUsers)"
                                name="Active Users"
                            />
                            <Area
                                type="monotone"
                                dataKey="newUsers"
                                stroke="#22c55e"
                                fillOpacity={1}
                                fill="url(#newUsers)"
                                name="New Users"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
