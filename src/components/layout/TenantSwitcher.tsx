"use client";

import { useState, useEffect } from "react";
import { ChevronsUpDown, Building2, Check, Plus } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Tenant {
    tenant_id: string;
    name: string;
    plan: string;
    role: string;
}

export function TenantSwitcher() {
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const fetchTenants = async () => {
        try {
            const res = await apiClient.get("/tenants/my-tenants");
            const tenantList = res.data; // Adjust based on API response
            setTenants(tenantList || []);

            const currentId = Cookies.get("current_tenant_id");
            if (currentId && tenantList) {
                const current = tenantList.find((t: Tenant) => t.tenant_id === currentId);
                if (current) setCurrentTenant(current);
            } else if (tenantList && tenantList.length > 0) {
                // Default to first if not set
                setCurrentTenant(tenantList[0]);
                Cookies.set("current_tenant_id", tenantList[0].tenant_id);
            }
        } catch (error) {
            console.error("Failed to fetch tenants", error);
        }
    };

    useEffect(() => {
        fetchTenants().catch(console.error);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const switchTenant = (tenant: Tenant) => {
        setCurrentTenant(tenant);
        Cookies.set("current_tenant_id", tenant.tenant_id);
        setIsOpen(false);
        window.location.reload(); // Reload to apply new tenant context globally
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-muted rounded-lg transition-colors border border-transparent hover:border-border"
            >
                <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center text-primary">
                    <Building2 className="w-4 h-4" />
                </div>
                <div className="text-left hidden sm:block">
                    <p className="text-sm font-medium leading-none max-w-[150px] truncate">
                        {currentTenant?.name || "Select Workspace"}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                        {currentTenant?.plan || "Free"} Plan
                    </p>
                </div>
                <ChevronsUpDown className="w-4 h-4 text-muted-foreground ml-2" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.1 }}
                            className="absolute left-0 top-full mt-2 w-64 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden"
                        >
                            <div className="p-2">
                                <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                                    My Workspaces
                                </p>
                                {tenants.map((tenant) => (
                                    <button
                                        key={tenant.tenant_id}
                                        onClick={() => switchTenant(tenant)}
                                        className="w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-lg hover:bg-muted transition-colors group"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded bg-muted flex items-center justify-center text-muted-foreground group-hover:text-foreground">
                                                <Building2 className="w-3 h-3" />
                                            </div>
                                            <span className="truncate max-w-[140px]">{tenant.name}</span>
                                        </div>
                                        {currentTenant?.tenant_id === tenant.tenant_id && (
                                            <Check className="w-4 h-4 text-primary" />
                                        )}
                                    </button>
                                ))}
                            </div>
                            <div className="p-2 border-t border-border">
                                <Link
                                    href="/dashboard/tenants"
                                    className="flex items-center gap-2 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Plus className="w-4 h-4" />
                                    Create Workspace
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
