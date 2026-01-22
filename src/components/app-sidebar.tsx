"use client";

import { Button } from "@/components/ui/button";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
    BarChart3,
    CreditCard,
    LayoutDashboard,
    LogOut,
    Shield,
    Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
    {
        title: "Dashboard",
        url: "/",
        icon: LayoutDashboard,
    },
    {
        title: "Users",
        url: "/users",
        icon: Users,
    },
    {
        title: "Subscriptions",
        url: "/subscriptions",
        icon: CreditCard,
    },
    {
        title: "Analytics",
        url: "/analytics",
        icon: BarChart3,
    },
    {
        title: "System",
        url: "/system",
        icon: Shield,
    },
];

export function AppSidebar() {
    const pathname = usePathname();

    const handleLogout = async () => {
        // TODO: Implement logout
        window.location.href = "/login";
    };

    return (
        <Sidebar className="border-r">
            <SidebarHeader className="border-b px-6 py-4">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
                        <span className="text-sm font-bold text-white">S</span>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Sophie Admin</h2>
                        <p className="text-xs text-muted-foreground">Dashboard</p>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                                        <Link href={item.url}>
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t p-4">
                <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={handleLogout}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </SidebarFooter>
        </Sidebar>
    );
}
