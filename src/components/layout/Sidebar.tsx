"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Shield, Users, Wallet, Building2, History, LayoutDashboard } from "lucide-react";

export function Sidebar() {
    const pathname = usePathname();

    const navItems = [
        { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
        { href: "/dashboard/profile", label: "Profile", icon: User },
        { href: "/dashboard/security", label: "Security", icon: Shield },
        { href: "/dashboard/login-history", label: "Login History", icon: History },
        { href: "/dashboard/security-dashboard", label: "Security Dashboard", icon: Shield },
        { href: "/dashboard/api-tokens", label: "API Tokens", icon: Shield },
        { href: "/dashboard/family", label: "Family", icon: Users },
        { href: "/dashboard/payments", label: "SBD Tokens", icon: Wallet },
        { href: "/dashboard/tenants", label: "Tenants", icon: Building2 },
    ];

    return (
        <aside className="w-64 bg-card border-r border-border h-screen sticky top-0 flex flex-col">
            <div className="p-6 border-b border-border">
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                    My Account
                </h1>
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
