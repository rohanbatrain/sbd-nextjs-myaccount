"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { Loader2, Users, Plus, Mail, Shield, ShoppingBag, Check, X } from "lucide-react";
import { motion } from "framer-motion";

interface FamilyMember {
    user_id: string;
    username: string;
    email: string;
    role: "admin" | "member" | "child";
    joined_at: string;
    avatar_url?: string;
}

interface Family {
    family_id: string;
    name: string;
    role: "admin" | "member" | "child";
    members: FamilyMember[];
    sbd_account_id: string;
}

interface PurchaseRequest {
    request_id: string;
    requester_username: string;
    item_name: string;
    amount: number;
    status: "pending" | "approved" | "denied";
    created_at: string;
}

export default function FamilyPage() {
    const [families, setFamilies] = useState<Family[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeFamily, setActiveFamily] = useState<Family | null>(null);
    const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([]);

    useEffect(() => {
        fetchFamilies();
    }, []);

    const fetchFamilies = async () => {
        try {
            const res = await apiClient.get("/family/my-families");
            const familyList = res.data; // Assuming direct list return or check response structure
            // Adjust based on actual API response structure if wrapped
            setFamilies(familyList || []);
            if (familyList && familyList.length > 0) {
                setActiveFamily(familyList[0]);
                if (familyList[0].role === "admin") {
                    fetchPurchaseRequests(familyList[0].family_id);
                }
            }
        } catch (error) {
            console.error("Failed to fetch families", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPurchaseRequests = async (familyId: string) => {
        try {
            const res = await apiClient.get(`/family/${familyId}/purchase-requests`);
            setPurchaseRequests(res.data || []);
        } catch (error) {
            console.error("Failed to fetch purchase requests", error);
        }
    };

    const handleCreateFamily = async () => {
        const name = prompt("Enter family name:");
        if (!name) return;

        try {
            await apiClient.post("/family/create", { name });
            fetchFamilies();
        } catch (error) {
            console.error("Failed to create family", error);
            alert("Failed to create family");
        }
    };

    const handleInvite = async () => {
        if (!activeFamily) return;
        const email = prompt("Enter email to invite:");
        if (!email) return;

        try {
            await apiClient.post(`/family/${activeFamily.family_id}/invite`, {
                invitee_email: email,
                role: "member"
            });
            alert("Invitation sent!");
        } catch (error) {
            console.error("Failed to invite member", error);
            alert("Failed to send invitation");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (families.length === 0) {
        return (
            <div className="max-w-2xl mx-auto text-center space-y-6 py-20">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                    <Users className="w-10 h-10" />
                </div>
                <h1 className="text-3xl font-bold">Create your Family Group</h1>
                <p className="text-muted-foreground text-lg max-w-md mx-auto">
                    Share digital assets, manage subscriptions, and handle purchase requests in one place.
                </p>
                <button
                    onClick={handleCreateFamily}
                    className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold text-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Create Family
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{activeFamily?.name || "My Family"}</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage members and shared resources.
                    </p>
                </div>
                {activeFamily?.role === "admin" && (
                    <button
                        onClick={handleInvite}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                    >
                        <Mail className="w-4 h-4" />
                        Invite Member
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Members List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card border border-border rounded-xl overflow-hidden">
                        <div className="p-6 border-b border-border">
                            <h2 className="font-semibold text-lg flex items-center gap-2">
                                <Users className="w-5 h-5 text-primary" />
                                Family Members
                            </h2>
                        </div>
                        <div className="divide-y divide-border">
                            {activeFamily?.members.map((member) => (
                                <div key={member.user_id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-primary font-bold">
                                            {(member.username[0] || "?").toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium">{member.username}</p>
                                            <p className="text-xs text-muted-foreground">{member.email}</p>
                                        </div>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${member.role === "admin"
                                            ? "bg-purple-500/10 text-purple-500"
                                            : "bg-blue-500/10 text-blue-500"
                                        }`}>
                                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Purchase Requests (Admin Only) */}
                    {activeFamily?.role === "admin" && (
                        <div className="bg-card border border-border rounded-xl overflow-hidden">
                            <div className="p-6 border-b border-border">
                                <h2 className="font-semibold text-lg flex items-center gap-2">
                                    <ShoppingBag className="w-5 h-5 text-orange-500" />
                                    Purchase Requests
                                </h2>
                            </div>
                            {purchaseRequests.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground">
                                    No pending requests.
                                </div>
                            ) : (
                                <div className="divide-y divide-border">
                                    {purchaseRequests.map((req) => (
                                        <div key={req.request_id} className="p-4 flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">{req.item_name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Requested by <span className="text-foreground">{req.requester_username}</span> • {req.amount} SBD
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 transition-colors">
                                                    <Check className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-card border border-border rounded-xl p-6">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-green-500" />
                            Family Benefits
                        </h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                Shared SBD Token Wallet
                            </li>
                            <li className="flex items-start gap-2">
                                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                Parental Controls & Monitoring
                            </li>
                            <li className="flex items-start gap-2">
                                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                Shared Digital Assets Library
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
