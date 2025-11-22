"use client";

import { TenantSwitcher } from "./TenantSwitcher";
import { Notifications } from "./Notifications";
import { UserNav } from "./UserNav";

export function TopBar() {
    return (
        <div className="h-16 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-10">
            <div className="flex items-center gap-4 flex-1">
                <TenantSwitcher />
            </div>
            <div className="flex items-center gap-4">
                <Notifications />
                <UserNav />
            </div>
        </div>
    );
}
