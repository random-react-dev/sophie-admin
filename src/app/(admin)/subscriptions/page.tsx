import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Users, AlertTriangle, RefreshCw } from "lucide-react";
import { getUserCountsByStatus } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function SubscriptionsPage() {
    // Fetch real user counts by subscription status
    const { trial, active, expired } = await getUserCountsByStatus();

    const stats = {
        activePlans: active,
        trialUsers: trial,
        failedPayments: 0, // Requires payment provider integration
        refunds: 0, // Requires payment provider integration
    };

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
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activePlans}</div>
                        <p className="text-xs text-muted-foreground">Paid subscriptions</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Trial Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.trialUsers}</div>
                        <p className="text-xs text-muted-foreground">On free trial</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Expired</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{expired}</div>
                        <p className="text-xs text-muted-foreground">Expired subscriptions</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Refunds</CardTitle>
                        <RefreshCw className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.refunds}</div>
                        <p className="text-xs text-muted-foreground">This month</p>
                    </CardContent>
                </Card>
            </div>

            {/* Placeholder Notice */}
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">Payment Integration Required</h3>
                    <p className="text-muted-foreground text-center max-w-md mt-2">
                        Connect a payment provider (RevenueCat, Stripe) to view detailed subscription
                        data, manage plans, track revenue, failed payments, and refunds.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
