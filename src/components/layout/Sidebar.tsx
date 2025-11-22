"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    User,
    Shield,
    Users,
    CreditCard,
    Info,
    Settings,
} from "lucide-react";

const sidebarItems = [
    {
        title: "Home",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Personal Info",
        href: "/dashboard/profile",
        icon: User,
    },
    {
        title: "Security",
        href: "/dashboard/security",
        icon: Shield,
    },
    {
        title: "People & Sharing",
        href: "/dashboard/family",
        icon: Users,
    },
    {
        title: "Payments & Subscriptions",
        href: "/dashboard/payments",
        icon: CreditCard,
    },
    {
        title: "About",
        href: "/dashboard/about",
        icon: Info,
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card h-screen sticky top-0">
            <div className="p-6 flex items-center gap-2 border-b border-border">
                <div className="w-8 h-8 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-lg" />
                <span className="text-xl font-bold tracking-tight">My Account</span>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                {sidebarItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                            pathname === item.href
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                    >
                        <item.icon className="w-5 h-5" />
                        {item.title}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-border">
                <Link
                    href="/dashboard/settings"
                    className={cn(
                        "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                >
                    <Settings className="w-5 h-5" />
                    Settings
                </Link>
            </div>
        </aside>
    );
}
