"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { Loader2, Building2, Plus, Settings, Users } from "lucide-react";
import { motion } from "framer-motion";

interface Tenant {
    tenant_id: string;
    name: string;
    plan: string;
    role: string;
    created_at: string;
}

export default function TenantsPage() {
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchTenants();
    }, []);

    const fetchTenants = async () => {
        try {
            const res = await apiClient.get("/tenants/my-tenants");
            setTenants(res.data || []);
        } catch (error) {
            console.error("Failed to fetch tenants", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateTenant = async () => {
        const name = prompt("Enter workspace name:");
        if (!name) return;

        try {
            await apiClient.post("/tenants/create", { name });
            fetchTenants();
            alert("Workspace created successfully!");
        } catch (error) {
            console.error("Failed to create tenant", error);
            alert("Failed to create workspace");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Workspaces</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your organizations and workspaces.
                    </p>
                </div>
                <button
                    onClick={handleCreateTenant}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Create Workspace
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tenants.map((tenant) => (
                    <motion.div
                        key={tenant.tenant_id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${tenant.role === "owner"
                                    ? "bg-purple-500/10 text-purple-500"
                                    : "bg-blue-500/10 text-blue-500"
                                }`}>
                                {tenant.role.toUpperCase()}
                            </span>
                        </div>

                        <h3 className="font-semibold text-lg mb-1">{tenant.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            {tenant.plan.charAt(0).toUpperCase() + tenant.plan.slice(1)} Plan
                        </p>

                        <div className="flex items-center gap-4 pt-4 border-t border-border">
                            <button className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1">
                                <Settings className="w-4 h-4" />
                                Settings
                            </button>
                            <button className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                Members
                            </button>
                        </div>
                    </motion.div>
                ))}

                {/* Create New Card */}
                <button
                    onClick={handleCreateTenant}
                    className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-muted/50 transition-all group"
                >
                    <div className="w-12 h-12 rounded-full bg-muted group-hover:bg-primary/10 flex items-center justify-center mb-4 transition-colors">
                        <Plus className="w-6 h-6 group-hover:text-primary" />
                    </div>
                    <span className="font-medium">Create New Workspace</span>
                </button>
            </div>
        </div>
    );
}
