"use client";

import { Bell, Search } from "lucide-react";
import { UserNav } from "./UserNav";
import { TenantSwitcher } from "./TenantSwitcher";

export function TopBar() {
    return (
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-10">
            <div className="flex items-center gap-4">
                <TenantSwitcher />
            </div>

            <div className="flex items-center gap-4">
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search settings..."
                        className="pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
                    />
                </div>
                <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors">
                    <Bell className="w-5 h-5" />
                </button>
                <UserNav />
            </div>
        </header>
    );
}
