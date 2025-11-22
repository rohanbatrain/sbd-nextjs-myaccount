"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/api-client";
import { Info, Calendar, Shield, Zap, Users } from "lucide-react";

export default function AboutPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        accountAge: 0,
        loginCount: 0,
        familyCount: 0,
        tokenBalance: 0,
    });

    useEffect(() => {
        if (user) {
            calculateStats().catch(console.error);
        }
    }, [user]);

    const calculateStats = async () => {
        try {
            // Fetch additional stats
            const [familyRes, tokensRes] = await Promise.all([
                apiClient.get("/family/my-family").catch(() => ({ data: null })),
                apiClient.get("/sbd-tokens/my-tokens").catch(() => ({ data: { balance: 0 } })),
            ]);

            setStats({
                accountAge: 0, // Would need to come from backend
                loginCount: 0, // Placeholder - would come from backend
                familyCount: familyRes.data ? 1 : 0,
                tokenBalance: tokensRes.data?.balance || 0,
            });
        } catch (error) {
            console.error("Failed to fetch stats", error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">About Your Account</h1>
                <p className="text-muted-foreground mt-2">
                    View your account information and usage statistics.
                </p>
            </div>

            {/* Account Info */}
            <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Info className="w-5 h-5 text-primary" />
                    Account Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="text-sm text-muted-foreground">Username</p>
                        <p className="font-medium mt-1">{user?.username || "N/A"}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium mt-1">{user?.email || "N/A"}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Email Verified</p>
                        <p className="font-medium mt-1">
                            {user?.is_email_verified ? (
                                <span className="text-green-500">✓ Verified</span>
                            ) : (
                                <span className="text-yellow-500">⚠ Not Verified</span>
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* Usage Statistics */}
            <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    Usage Statistics
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center p-4 bg-muted rounded-lg">
                        <Calendar className="w-8 h-8 mx-auto mb-2 text-primary" />
                        <p className="text-2xl font-bold">{stats.accountAge}</p>
                        <p className="text-sm text-muted-foreground">Days Active</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                        <Shield className="w-8 h-8 mx-auto mb-2 text-primary" />
                        <p className="text-2xl font-bold">{user?.is_2fa_enabled ? "✓" : "✗"}</p>
                        <p className="text-sm text-muted-foreground">2FA Status</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                        <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                        <p className="text-2xl font-bold">{stats.familyCount}</p>
                        <p className="text-sm text-muted-foreground">Families</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                        <Zap className="w-8 h-8 mx-auto mb-2 text-primary" />
                        <p className="text-2xl font-bold">{stats.tokenBalance}</p>
                        <p className="text-sm text-muted-foreground">SBD Tokens</p>
                    </div>
                </div>
            </div>

            {/* Security Features */}
            <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Security Features</h2>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span className="text-sm">Two-Factor Authentication</span>
                        <span className={`text-sm font-medium ${user?.is_2fa_enabled ? "text-green-500" : "text-muted-foreground"}`}>
                            {user?.is_2fa_enabled ? "Enabled" : "Disabled"}
                        </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span className="text-sm">Email Verification</span>
                        <span className={`text-sm font-medium ${user?.is_email_verified ? "text-green-500" : "text-yellow-500"}`}>
                            {user?.is_email_verified ? "Verified" : "Pending"}
                        </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span className="text-sm">Account Status</span>
                        <span className="text-sm font-medium text-green-500">Active</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
