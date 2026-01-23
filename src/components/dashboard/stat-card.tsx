import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const iconVariants = cva(
  "flex h-9 w-9 items-center justify-center rounded-lg border transition-all duration-200",
  {
    variants: {
      color: {
        default: "bg-primary/10 text-primary border-primary/20",
        blue: "bg-blue-500/10 text-blue-600 border-blue-500/20",
        green: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
        yellow: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
        amber: "bg-amber-500/10 text-amber-600 border-amber-500/20",
        orange: "bg-orange-500/10 text-orange-600 border-orange-500/20",
        red: "bg-red-500/10 text-red-600 border-red-500/20",
        rose: "bg-rose-500/10 text-rose-600 border-rose-500/20",
        pink: "bg-pink-500/10 text-pink-600 border-pink-500/20",
        violet: "bg-violet-500/10 text-violet-600 border-violet-500/20",
        indigo: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
        cyan: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
        fuchsia: "bg-fuchsia-500/10 text-fuchsia-600 border-fuchsia-500/20",
      },
    },
    defaultVariants: {
      color: "default",
    },
  },
);

export type StatCardColor = VariantProps<typeof iconVariants>["color"];

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  color?: StatCardColor;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  color = "default",
  trend,
}: StatCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md border-muted/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground truncate pr-2">
          {title}
        </CardTitle>
        <div className={cn(iconVariants({ color }))}>
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
          <div className="text-2xl font-bold tracking-tight">
            {typeof value === "number" ? value.toLocaleString() : value}
          </div>

          <div className="flex items-center gap-2">
            {trend && (
              <span
                className={cn(
                  "flex items-center text-xs font-medium px-1.5 py-0.5 rounded-md",
                  trend.isPositive
                    ? "bg-green-500/10 text-green-700 dark:text-green-500"
                    : "bg-red-500/10 text-red-700 dark:text-red-500",
                )}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}%
              </span>
            )}

            {description && (
              <p className="text-xs text-muted-foreground truncate">
                {description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
