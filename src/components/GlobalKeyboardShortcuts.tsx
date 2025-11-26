"use client";

import { usePathname } from "next/navigation";
import { useHotkeys } from "@/hooks/useHotkeys";

export function GlobalKeyboardShortcuts() {
    const pathname = usePathname();

    // Navigation shortcuts
    useHotkeys("ctrl+shift+d", () => {
        window.location.href = "/dashboard";
    });

    useHotkeys("ctrl+shift+p", () => {
        window.location.href = "/dashboard/profile";
    });

    useHotkeys("ctrl+shift+s", () => {
        window.location.href = "/dashboard/security";
    });

    useHotkeys("ctrl+shift+f", () => {
        window.location.href = "/dashboard/family";
    });

    useHotkeys("ctrl+shift+t", () => {
        window.location.href = "/dashboard/tenants";
    });

    useHotkeys("ctrl+shift+h", () => {
        window.location.href = "/dashboard/help";
    });

    // ESC to go back
    useHotkeys("escape", () => {
        if (pathname !== "/dashboard") {
            window.history.back();
        }
    }, { enableOnFormTags: false });

    // Show keyboard shortcuts help
    useHotkeys("ctrl+/", () => {
        alert(`Keyboard Shortcuts:
    
Navigation:
• Ctrl+Shift+D - Dashboard
• Ctrl+Shift+P - Profile
• Ctrl+Shift+S - Security
• Ctrl+Shift+F - Family
• Ctrl+Shift+T - Tenants
• Ctrl+Shift+H - Help
• ESC - Go Back

Other:
• Ctrl+/ - Show this help`);
    });

    return null;
}
