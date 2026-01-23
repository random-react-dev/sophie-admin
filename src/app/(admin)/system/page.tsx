import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Key,
  Server,
  Users,
  ExternalLink,
  Database,
  Sparkles,
} from "lucide-react";
import { getAdminUsers } from "@/lib/data";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { iconVariants } from "@/components/dashboard/stat-card";

export const dynamic = "force-dynamic";

export default async function SystemPage() {
  // Fetch admin users
  const adminUsers = await getAdminUsers();

  // System info - some values from environment
  const systemInfo = {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "Not configured",
    environment: process.env.NODE_ENV ?? "development",
    nextVersion: "15.3.3",
    geminiModel: "gemini-2.5-flash-native-audio-preview-09-2025",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          System & Security
        </h1>
        <p className="text-muted-foreground">
          System configuration and admin access management.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Environment Info */}
        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className={cn(iconVariants({ color: "blue" }))}>
                <Server className="h-5 w-5" />
              </div>
              <CardTitle>Environment</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <span className="text-sm text-muted-foreground">Environment</span>
              <Badge
                variant={
                  systemInfo.environment === "production"
                    ? "default"
                    : "secondary"
                }
              >
                {systemInfo.environment}
              </Badge>
            </div>
            <div className="flex flex-wrap justify-between items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Next.js Version
              </span>
              <span className="text-sm font-medium">
                {systemInfo.nextVersion}
              </span>
            </div>
            <div className="flex flex-wrap justify-between items-center gap-2">
              <span className="text-sm text-muted-foreground">Deployment</span>
              <Badge variant="outline">Vercel</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Supabase Info */}
        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className={cn(iconVariants({ color: "green" }))}>
                <Database className="h-5 w-5" />
              </div>
              <CardTitle>Supabase Connection</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="min-w-0">
              <span className="text-sm text-muted-foreground">Project URL</span>
              <p
                className="text-sm font-mono mt-1 truncate"
                title={systemInfo.supabaseUrl}
              >
                {systemInfo.supabaseUrl}
              </p>
            </div>
            <div className="flex flex-wrap justify-between items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Service Role Key
              </span>
              <Badge variant="outline" className="text-green-600 shrink-0">
                Configured
              </Badge>
            </div>
            <div className="flex flex-wrap justify-between items-center gap-2">
              <span className="text-sm text-muted-foreground">RLS Status</span>
              <Badge variant="default" className="shrink-0">
                Enabled
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gemini API Configuration */}
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className={cn(iconVariants({ color: "yellow" }))}>
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Gemini API Configuration</CardTitle>
              <CardDescription>AI model and usage monitoring</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <span className="text-sm text-muted-foreground">
                  Current Model
                </span>
                <p className="text-sm font-medium mt-1 font-mono bg-muted p-2 rounded">
                  {systemInfo.geminiModel}
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Features</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="secondary">Native Audio</Badge>
                  <Badge variant="secondary">Real-time</Badge>
                  <Badge variant="secondary">WebSocket</Badge>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-sm text-muted-foreground">
                  Usage Monitoring
                </span>
                <p className="text-sm text-muted-foreground mt-1">
                  Monitor API usage, costs, and quotas directly in Google Cloud
                  Console.
                </p>
              </div>
              <Link
                href="https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/metrics"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                Open Google Cloud Console
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Users */}
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className={cn(iconVariants({ color: "violet" }))}>
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Admin Users ({adminUsers.length})</CardTitle>
              <CardDescription>
                Users with full dashboard access (via{" "}
                <code className="bg-muted px-1 rounded text-xs">is_admin</code>{" "}
                metadata)
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {adminUsers.length === 0 ? (
            <div className="rounded-lg border border-dashed p-4">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="font-medium">No Admin Users Found</p>
                  <p className="text-sm text-muted-foreground">
                    Set{" "}
                    <code className="bg-muted px-1 rounded">
                      is_admin = true
                    </code>{" "}
                    in user metadata via Supabase dashboard.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {adminUsers.map((admin) => (
                <div
                  key={admin.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3"
                >
                  <div className="min-w-0">
                    <p className="font-medium truncate">{admin.email}</p>
                    <p className="text-xs text-muted-foreground">
                      Added: {new Date(admin.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="default" className="shrink-0">
                    Admin
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Keys Status */}
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className={cn(iconVariants({ color: "orange" }))}>
              <Key className="h-5 w-5" />
            </div>
            <CardTitle>API Keys Status</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg bg-muted/50">
              <span className="text-sm">Supabase Anon Key</span>
              <Badge variant="outline" className="text-green-600 shrink-0">
                Active
              </Badge>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg bg-muted/50">
              <span className="text-sm">Service Role Key</span>
              <Badge variant="outline" className="text-green-600 shrink-0">
                Active
              </Badge>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg bg-muted/50">
              <span className="text-sm">Gemini API Key</span>
              <Badge variant="outline" className="text-green-600 shrink-0">
                Active
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
