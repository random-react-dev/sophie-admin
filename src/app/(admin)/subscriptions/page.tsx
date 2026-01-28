import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  CreditCard,
  AlertTriangle,
  TrendingUp,
  Info,
  Ticket,
} from "lucide-react";
import { getUserCountsByStatus } from "@/lib/data";
import { SubscriptionStatusChart } from "@/components/subscriptions/status-chart";
import { StatCard } from "@/components/dashboard/stat-card";

export const dynamic = "force-dynamic";

export default async function SubscriptionsPage() {
  // Fetch real user counts by subscription status
  const { trial, active, expired } = await getUserCountsByStatus();
  const total = trial + active + expired;

  // Calculate conversion rate
  const conversionRate =
    total > 0 ? ((active / (active + trial)) * 100).toFixed(1) : "0.0";

  const statusData = [
    { name: "Trial", value: trial, color: "#f59e0b" },
    { name: "Active", value: active, color: "#22c55e" },
    { name: "Expired", value: expired, color: "#ef4444" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Subscriptions
        </h1>
        <p className="text-muted-foreground">
          Manage subscription plans and billing.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Paying Plan"
          value={active}
          icon={CreditCard}
          color="green"
          description="Paid subscriptions"
        />
        <StatCard
          title="Conversion Rate"
          value={`${conversionRate}%`}
          icon={TrendingUp}
          color="blue"
          description="Trial to paid"
        />
        <StatCard
          title="Trial Users"
          value={trial}
          icon={Ticket}
          color="amber"
          description="On free trial"
        />
        <StatCard
          title="Expired"
          value={expired}
          icon={AlertTriangle}
          color="red"
          description="Expired subscriptions"
        />
      </div>

      {/* Status Distribution Chart */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Subscription Status Distribution</CardTitle>
            <CardDescription>
              Current breakdown of all user subscriptions
            </CardDescription>
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
