"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

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
          <div className="flex items-center gap-3 border-b bg-background p-4 md:hidden">
            <SidebarTrigger className="size-8 border bg-gray-100 shadow-md hover:bg-accent hover:text-accent-foreground rounded-md" />
            <span className="font-semibold">Sophie Admin</span>
          </div>
          <div className="container mx-auto p-4 md:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
