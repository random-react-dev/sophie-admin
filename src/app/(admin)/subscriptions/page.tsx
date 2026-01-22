import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CreditCard, Users, AlertTriangle, TrendingUp, Info } from "lucide-react";
import { getUserCountsByStatus } from "@/lib/data";
import { SubscriptionStatusChart } from "@/components/subscriptions/status-chart";

export const dynamic = "force-dynamic";

export default async function SubscriptionsPage() {
    // Fetch real user counts by subscription status
    const { trial, active, expired } = await getUserCountsByStatus();
    const total = trial + active + expired;

    // Calculate conversion rate
    const conversionRate = total > 0
        ? ((active / (active + trial)) * 100).toFixed(1)
        : "0.0";

    const statusData = [
        { name: "Trial", value: trial, color: "#f59e0b" },
        { name: "Active", value: active, color: "#22c55e" },
        { name: "Expired", value: expired, color: "#ef4444" },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
                <p className="text-muted-foreground">
                    Manage subscription plans and billing.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
                        <CreditCard className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{active}</div>
                        <p className="text-xs text-muted-foreground">Paid subscriptions</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Trial Users</CardTitle>
                        <Users className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{trial}</div>
                        <p className="text-xs text-muted-foreground">On free trial</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Expired</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{expired}</div>
                        <p className="text-xs text-muted-foreground">Expired subscriptions</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{conversionRate}%</div>
                        <p className="text-xs text-muted-foreground">Trial to paid</p>
                    </CardContent>
                </Card>
            </div>

            {/* Status Distribution Chart */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Subscription Status Distribution</CardTitle>
                        <CardDescription>Current breakdown of all user subscriptions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SubscriptionStatusChart data={statusData} />
                    </CardContent>
                </Card>

                {/* Payment Integration Notice */}
                <Card className="border-dashed">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Info className="h-5 w-5 text-blue-500" />
                            Payment Integration
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Connect a payment provider to unlock:
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-2">
                            <li className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                                Revenue tracking and MRR
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                                Failed payment monitoring
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                                Refund management
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                                Subscription plan management
                            </li>
                        </ul>
                        <p className="text-xs text-muted-foreground pt-2 border-t">
                            Recommended: RevenueCat or Stripe
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

