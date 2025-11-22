"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/error-utils";
import { Users, Plus, Crown, UserMinus, LogOut, Settings as SettingsIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FamilyMember {
    user_id: string;
    username: string;
    email: string;
    role: "admin" | "member" | "child";
    joined_at: string;
}

interface Family {
    family_id: string;
    name: string;
    created_at: string;
    member_count: number;
}

export default function EnhancedFamilyPage() {
    const [family, setFamily] = useState<Family | null>(null);
    const [members, setMembers] = useState<FamilyMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUserRole, setCurrentUserRole] = useState<string>("");
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        fetchFamilyData().catch(console.error);
    }, []);

    const fetchFamilyData = async () => {
        setIsLoading(true);
        try {
            const [familyRes, membersRes] = await Promise.all([
                apiClient.get("/family/my-family"),
                apiClient.get("/family/members"),
            ]);

            if (familyRes.data) {
                setFamily(familyRes.data);
                setMembers(membersRes.data.members || []);

                // Find current user's role
                const currentUser = membersRes.data.members?.find((m: FamilyMember) => m.user_id === familyRes.data.current_user_id);
                setCurrentUserRole(currentUser?.role || "member");
            }
        } catch (error: unknown) {
            console.error("Failed to fetch family data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const createFamily = async () => {
        const name = prompt("Enter family name:");
        if (!name) return;

        try {
            await apiClient.post("/family/create", { name });
            setMessage({ type: "success", text: "Family created successfully" });
            await fetchFamilyData();
        } catch (error: unknown) {
            setMessage({ type: "error", text: getErrorMessage(error, "Failed to create family") });
        }
    };

    const inviteMember = async () => {
        if (!inviteEmail) {
            setMessage({ type: "error", text: "Email is required" });
            return;
        }

        try {
            await apiClient.post("/family/invite", {
                invitee_email: inviteEmail,
                role: "member",
            });
            setMessage({ type: "success", text: "Invitation sent successfully" });
            setShowInviteModal(false);
            setInviteEmail("");
        } catch (error: unknown) {
            setMessage({ type: "error", text: getErrorMessage(error, "Failed to send invitation") });
        }
    };

    const leaveFamily = async () => {
        if (!confirm("Are you sure you want to leave this family? You'll need to be invited again to rejoin.")) {
            return;
        }

        try {
            await apiClient.post("/family/leave");
            setMessage({ type: "success", text: "You have left the family" });
            setFamily(null);
            setMembers([]);
        } catch (error: unknown) {
            setMessage({ type: "error", text: getErrorMessage(error, "Failed to leave family") });
        }
    };

    const transferOwnership = async (newOwnerId: string) => {
        if (!confirm("Are you sure you want to transfer family ownership? You will lose admin privileges.")) {
            return;
        }

        try {
            await apiClient.post("/family/transfer-ownership", { new_owner_id: newOwnerId });
            setMessage({ type: "success", text: "Ownership transferred successfully" });
            setShowTransferModal(false);
            await fetchFamilyData();
        } catch (error: unknown) {
            setMessage({ type: "error", text: getErrorMessage(error, "Failed to transfer ownership") });
        }
    };

    const removeMember = async (memberId: string) => {
        if (!confirm("Are you sure you want to remove this member from the family?")) {
            return;
        }

        try {
            await apiClient.post("/family/remove-member", { member_id: memberId });
            setMessage({ type: "success", text: "Member removed successfully" });
            await fetchFamilyData();
        } catch (error: unknown) {
            setMessage({ type: "error", text: getErrorMessage(error, "Failed to remove member") });
        }
    };

    const updateMemberRole = async (memberId: string, newRole: string) => {
        try {
            await apiClient.post("/family/update-role", { member_id: memberId, role: newRole });
            setMessage({ type: "success", text: "Member role updated successfully" });
            await fetchFamilyData();
        } catch (error: unknown) {
            setMessage({ type: "error", text: getErrorMessage(error, "Failed to update role") });
        }
    };

    const isAdmin = currentUserRole === "admin";

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Family</h1>
                    <p className="text-muted-foreground mt-2">Manage your family members and settings.</p>
                </div>
                {family && (
                    <div className="flex gap-2">
                        <button
                            onClick={leaveFamily}
                            className="flex items-center gap-2 px-4 py-2 bg-background border border-red-500/20 text-red-500 rounded-lg font-medium hover:bg-red-500/10 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Leave Family
                        </button>
                        {isAdmin && (
                            <button
                                onClick={() => setShowInviteModal(true)}
                                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Invite Member
                            </button>
                        )}
                    </div>
                )}
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
            ) : !family ? (
                <div className="text-center py-12">
                    <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h2 className="text-xl font-semibold mb-2">No Family Yet</h2>
                    <p className="text-muted-foreground mb-6">Create a family to share resources and manage together</p>
                    <button
                        onClick={createFamily}
                        className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                        Create Family
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Family Members */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">Members ({members.length})</h2>
                            {isAdmin && (
                                <button
                                    onClick={() => setShowTransferModal(true)}
                                    className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                                >
                                    <Crown className="w-4 h-4" />
                                    Transfer Ownership
                                </button>
                            )}
                        </div>
                        <div className="space-y-3">
                            {members.map((member) => (
                                <motion.div
                                    key={member.user_id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                            <Users className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium">{member.username}</p>
                                                {member.role === "admin" && (
                                                    <Crown className="w-4 h-4 text-yellow-500" />
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground capitalize">{member.role}</p>
                                        </div>
                                    </div>
                                    {isAdmin && member.role !== "admin" && (
                                        <div className="flex gap-2">
                                            <select
                                                value={member.role}
                                                onChange={(e) => updateMemberRole(member.user_id, e.target.value)}
                                                className="text-sm bg-background border border-border rounded px-2 py-1"
                                            >
                                                <option value="member">Member</option>
                                                <option value="child">Child</option>
                                            </select>
                                            <button
                                                onClick={() => removeMember(member.user_id)}
                                                className="text-sm text-red-500 hover:underline flex items-center gap-1"
                                            >
                                                <UserMinus className="w-4 h-4" />
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Family Info */}
                    <div className="space-y-4">
                        <div className="bg-card border border-border rounded-xl p-6">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <SettingsIcon className="w-4 h-4 text-primary" />
                                Family Info
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Name</p>
                                    <p className="font-medium">{family.name}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Members</p>
                                    <p className="font-medium">{members.length}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Your Role</p>
                                    <p className="font-medium capitalize">{currentUserRole}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Created</p>
                                    <p className="font-medium">{new Date(family.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Invite Modal */}
            <AnimatePresence>
                {showInviteModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-card border border-border rounded-xl p-6 max-w-md w-full"
                        >
                            <h2 className="text-xl font-bold mb-4">Invite Family Member</h2>
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
                                        onClick={inviteMember}
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

            {/* Transfer Ownership Modal */}
            <AnimatePresence>
                {showTransferModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-card border border-border rounded-xl p-6 max-w-md w-full"
                        >
                            <h2 className="text-xl font-bold mb-4">Transfer Ownership</h2>
                            <p className="text-sm text-muted-foreground mb-4">
                                Select a member to transfer family ownership to. You will lose admin privileges.
                            </p>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {members
                                    .filter((m) => m.role !== "admin")
                                    .map((member) => (
                                        <button
                                            key={member.user_id}
                                            onClick={() => transferOwnership(member.user_id)}
                                            className="w-full text-left p-3 border border-border rounded-lg hover:bg-muted transition-colors"
                                        >
                                            <p className="font-medium">{member.username}</p>
                                            <p className="text-sm text-muted-foreground">{member.email}</p>
                                        </button>
                                    ))}
                            </div>
                            <button
                                onClick={() => setShowTransferModal(false)}
                                className="w-full mt-4 bg-background border border-border px-4 py-2 rounded-lg font-medium hover:bg-muted transition-colors"
                            >
                                Cancel
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
