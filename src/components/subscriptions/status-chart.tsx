"use client";

import {
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from "recharts";

interface StatusDataItem {
    name: string;
    value: number;
    color: string;
}

interface SubscriptionStatusChartProps {
    data: StatusDataItem[];
}

export function SubscriptionStatusChart({ data }: SubscriptionStatusChartProps) {
    const total = data.reduce((sum, item) => sum + item.value, 0);

    if (total === 0) {
        return (
            <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                No subscription data available
            </div>
        );
    }

    return (
        <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: number, name: string) => [
                            `${value} users (${((value / total) * 100).toFixed(1)}%)`,
                            name,
                        ]}
                    />
                    <Legend
                        layout="horizontal"
                        align="center"
                        verticalAlign="bottom"
                        formatter={(value: string) => (
                            <span className="text-sm">{value}</span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
