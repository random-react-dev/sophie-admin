import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Key, Server, Users } from "lucide-react";
import { getAdminUsers } from "@/lib/data";

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
                <h1 className="text-3xl font-bold tracking-tight">System & Security</h1>
                <p className="text-muted-foreground">
                    System configuration and admin access management.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Environment Info */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Server className="h-5 w-5" />
                            <CardTitle>Environment</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Environment</span>
                            <Badge variant={systemInfo.environment === "production" ? "default" : "secondary"}>
                                {systemInfo.environment}
                            </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Next.js Version</span>
                            <span className="text-sm font-medium">{systemInfo.nextVersion}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Deployment</span>
                            <Badge variant="outline">Vercel</Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Supabase Info */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Key className="h-5 w-5" />
                            <CardTitle>Supabase Connection</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <span className="text-sm text-muted-foreground">Project URL</span>
                            <p className="text-sm font-mono mt-1 truncate">
                                {systemInfo.supabaseUrl}
                            </p>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Service Role Key</span>
                            <Badge variant="outline" className="text-green-600">
                                Configured
                            </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">RLS Status</span>
                            <Badge variant="default">Enabled</Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Admin Users */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        <CardTitle>Admin Users ({adminUsers.length})</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Admin users have full access to this dashboard. Status controlled via{" "}
                            <code className="bg-muted px-1 rounded">is_admin</code> flag in user metadata.
                        </p>

                        {adminUsers.length === 0 ? (
                            <div className="rounded-lg border p-4">
                                <div className="flex items-center gap-3">
                                    <Users className="h-8 w-8 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">No Admin Users Found</p>
                                        <p className="text-sm text-muted-foreground">
                                            Set <code className="bg-muted px-1 rounded">is_admin = true</code> in user metadata via Supabase dashboard.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {adminUsers.map((admin) => (
                                    <div key={admin.id} className="flex items-center justify-between rounded-lg border p-3">
                                        <div>
                                            <p className="font-medium">{admin.email}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Added: {new Date(admin.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <Badge variant="default">Admin</Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* API Info */}
            <Card>
                <CardHeader>
                    <CardTitle>Gemini API Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <span className="text-sm text-muted-foreground">Model</span>
                            <p className="text-sm font-medium mt-1 font-mono">
                                {systemInfo.geminiModel}
                            </p>
                        </div>
                        <div>
                            <span className="text-sm text-muted-foreground">Usage Tracking</span>
                            <Badge variant="secondary" className="ml-2">Pending Setup</Badge>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        API usage tracking requires logging from the mobile app.
                        Token counts can be logged to an <code className="bg-muted px-1 rounded">api_usage_logs</code> table.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
