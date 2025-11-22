"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/error-utils";
import { Building2, Plus, Edit, Trash2, Users, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface Tenant {
    tenant_id: string;
    name: string;
    description?: string;
    created_at: string;
    member_count: number;
    role: string;
}

interface TenantMember {
    user_id: string;
    username: string;
    email: string;
    role: string;
}

export default function EnhancedTenantsPage() {
    const router = useRouter();
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
    const [tenantMembers, setTenantMembers] = useState<TenantMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showMembersModal, setShowMembersModal] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [newTenant, setNewTenant] = useState({ name: "", description: "" });
    const [inviteEmail, setInviteEmail] = useState("");
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        fetchTenants().catch(console.error);
    }, []);

    const fetchTenants = async () => {
        setIsLoading(true);
        try {
            const res = await apiClient.get("/tenants/my-tenants");
            setTenants(res.data.tenants || []);
        } catch (error: unknown) {
            setMessage({ type: "error", text: getErrorMessage(error, "Failed to fetch tenants") });
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTenantDetails = async (tenantId: string) => {
        try {
            const res = await apiClient.get(`/tenants/${tenantId}`);
            setSelectedTenant(res.data);
        } catch (error: unknown) {
            setMessage({ type: "error", text: getErrorMessage(error, "Failed to fetch tenant details") });
        }
    };

    const fetchTenantMembers = async (tenantId: string) => {
        try {
            const res = await apiClient.get(`/tenants/${tenantId}/members`);
            setTenantMembers(res.data.members || []);
            setShowMembersModal(true);
        } catch (error: unknown) {
            setMessage({ type: "error", text: getErrorMessage(error, "Failed to fetch members") });
        }
    };

    const createTenant = async () => {
        if (!newTenant.name) {
            setMessage({ type: "error", text: "Tenant name is required" });
            return;
        }

        try {
            await apiClient.post("/tenants/create", newTenant);
            setMessage({ type: "success", text: "Tenant created successfully" });
            setShowCreateModal(false);
            setNewTenant({ name: "", description: "" });
            await fetchTenants();
        } catch (error: unknown) {
            setMessage({ type: "error", text: getErrorMessage(error, "Failed to create tenant") });
        }
    };

    const updateTenant = async () => {
        if (!selectedTenant) return;

        try {
            await apiClient.put(`/tenants/${selectedTenant.tenant_id}/update`, {
                name: selectedTenant.name,
                description: selectedTenant.description,
            });
            setMessage({ type: "success", text: "Tenant updated successfully" });
            setShowEditModal(false);
            await fetchTenants();
        } catch (error: unknown) {
            setMessage({ type: "error", text: getErrorMessage(error, "Failed to update tenant") });
        }
    };

    const deleteTenant = async (tenantId: string) => {
        if (!confirm("Are you sure you want to delete this tenant? This action cannot be undone.")) {
            return;
        }

        try {
            await apiClient.delete(`/tenants/${tenantId}/delete`);
            setMessage({ type: "success", text: "Tenant deleted successfully" });
            await fetchTenants();
        } catch (error: unknown) {
            setMessage({ type: "error", text: getErrorMessage(error, "Failed to delete tenant") });
        }
    };

    const inviteMember = async (tenantId: string) => {
        if (!inviteEmail) {
            setMessage({ type: "error", text: "Email is required" });
            return;
        }

        try {
            await apiClient.post(`/tenants/${tenantId}/invite`, { email: inviteEmail });
            setMessage({ type: "success", text: "Invitation sent successfully" });
            setShowInviteModal(false);
            setInviteEmail("");
        } catch (error: unknown) {
            setMessage({ type: "error", text: getErrorMessage(error, "Failed to send invitation") });
        }
    };

    const removeMember = async (tenantId: string, userId: string) => {
        if (!confirm("Are you sure you want to remove this member?")) return;

        try {
            await apiClient.post(`/tenants/${tenantId}/remove-member`, { user_id: userId });
            setMessage({ type: "success", text: "Member removed successfully" });
            await fetchTenantMembers(tenantId);
        } catch (error: unknown) {
            setMessage({ type: "error", text: getErrorMessage(error, "Failed to remove member") });
        }
    };

    const switchTenant = async (tenantId: string) => {
        try {
            await apiClient.post("/tenants/switch", { tenant_id: tenantId });
            setMessage({ type: "success", text: "Switched tenant successfully" });
            router.refresh();
        } catch (error: unknown) {
            setMessage({ type: "error", text: getErrorMessage(error, "Failed to switch tenant") });
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Tenants</h1>
                    <p className="text-muted-foreground mt-2">Manage your workspaces and organizations.</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Create Tenant
                </button>
            </div>

            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 rounded-lg text-sm ${message.type === "success" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                        }`}
                >
                    {message.text}
                </motion.div>
            )}

            {isLoading ? (
                <div className="text-center py-12 text-muted-foreground">Loading...</div>
            ) : tenants.length === 0 ? (
                <div className="text-center py-12">
                    <Building2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h2 className="text-xl font-semibold mb-2">No Tenants Yet</h2>
                    <p className="text-muted-foreground mb-6">Create a tenant to organize your work</p>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                        Create Your First Tenant
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tenants.map((tenant) => (
                        <motion.div
                            key={tenant.tenant_id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <Building2 className="w-6 h-6 text-primary" />
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => {
                                            setSelectedTenant(tenant);
                                            setShowEditModal(true);
                                        }}
                                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => deleteTenant(tenant.tenant_id)}
                                        className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <h3 className="font-semibold text-lg mb-2">{tenant.name}</h3>
                            {tenant.description && (
                                <p className="text-sm text-muted-foreground mb-4">{tenant.description}</p>
                            )}
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                                <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    <span>{tenant.member_count || 0} members</span>
                                </div>
                                <div className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                                    {tenant.role}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => switchTenant(tenant.tenant_id)}
                                    className="flex-1 bg-primary text-primary-foreground px-3 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                                >
                                    Switch
                                </button>
                                <button
                                    onClick={() => fetchTenantMembers(tenant.tenant_id)}
                                    className="flex-1 bg-background border border-border px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                                >
                                    Members
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Create Tenant Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-card border border-border rounded-xl p-6 max-w-md w-full"
                        >
                            <h2 className="text-xl font-bold mb-4">Create Tenant</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium">Tenant Name</label>
                                    <input
                                        type="text"
                                        value={newTenant.name}
                                        onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
                                        className="w-full mt-1 bg-background border border-border rounded-lg px-3 py-2"
                                        placeholder="My Organization"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Description (optional)</label>
                                    <textarea
                                        value={newTenant.description}
                                        onChange={(e) => setNewTenant({ ...newTenant, description: e.target.value })}
                                        className="w-full mt-1 bg-background border border-border rounded-lg px-3 py-2 min-h-[80px]"
                                        placeholder="Brief description..."
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setShowCreateModal(false);
                                            setNewTenant({ name: "", description: "" });
                                        }}
                                        className="flex-1 bg-background border border-border px-4 py-2 rounded-lg font-medium hover:bg-muted transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={createTenant}
                                        className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                                    >
                                        Create
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit Tenant Modal */}
            <AnimatePresence>
                {showEditModal && selectedTenant && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-card border border-border rounded-xl p-6 max-w-md w-full"
                        >
                            <h2 className="text-xl font-bold mb-4">Edit Tenant</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium">Tenant Name</label>
                                    <input
                                        type="text"
                                        value={selectedTenant.name}
                                        onChange={(e) => setSelectedTenant({ ...selectedTenant, name: e.target.value })}
                                        className="w-full mt-1 bg-background border border-border rounded-lg px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Description</label>
                                    <textarea
                                        value={selectedTenant.description || ""}
                                        onChange={(e) => setSelectedTenant({ ...selectedTenant, description: e.target.value })}
                                        className="w-full mt-1 bg-background border border-border rounded-lg px-3 py-2 min-h-[80px]"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setShowEditModal(false)}
                                        className="flex-1 bg-background border border-border px-4 py-2 rounded-lg font-medium hover:bg-muted transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={updateTenant}
                                        className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                                    >
                                        Update
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Members Modal */}
            <AnimatePresence>
                {showMembersModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-card border border-border rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold">Tenant Members</h2>
                                <button
                                    onClick={() => setShowMembersModal(false)}
                                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="space-y-3">
                                {tenantMembers.map((member) => (
                                    <div
                                        key={member.user_id}
                                        className="flex items-center justify-between p-3 border border-border rounded-lg"
                                    >
                                        <div>
                                            <p className="font-medium">{member.username}</p>
                                            <p className="text-sm text-muted-foreground">{member.email}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                                                {member.role}
                                            </span>
                                            <button
                                                onClick={() => removeMember(selectedTenant?.tenant_id || "", member.user_id)}
                                                className="text-sm text-red-500 hover:underline"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => setShowInviteModal(true)}
                                className="w-full mt-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                            >
                                Invite Member
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Invite Member Modal */}
            <AnimatePresence>
                {showInviteModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-card border border-border rounded-xl p-6 max-w-md w-full"
                        >
                            <h2 className="text-xl font-bold mb-4">Invite Member</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium">Email Address</label>
                                    <input
                                        type="email"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                        className="w-full mt-1 bg-background border border-border rounded-lg px-3 py-2"
                                        placeholder="member@example.com"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setShowInviteModal(false);
                                            setInviteEmail("");
                                        }}
                                        className="flex-1 bg-background border border-border px-4 py-2 rounded-lg font-medium hover:bg-muted transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => inviteMember(selectedTenant?.tenant_id || "")}
                                        className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                                    >
                                        Send Invite
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
