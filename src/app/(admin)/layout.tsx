"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                <AppSidebar />
                <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
                    <div className="container mx-auto p-6">{children}</div>
                </main>
            </div>
        </SidebarProvider>
    );
}
