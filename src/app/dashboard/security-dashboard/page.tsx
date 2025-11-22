"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/error-utils";
import { Shield, AlertTriangle, CheckCircle, Info, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface SecurityEvent {
    id: string;
    type: string;
    description: string;
    timestamp: string;
    severity: "info" | "warning" | "critical";
}

interface SecurityRecommendation {
    id: string;
    title: string;
    description: string;
    action: string;
    link: string;
    priority: "low" | "medium" | "high";
}

export default function SecurityDashboardPage() {
    const [securityScore, setSecurityScore] = useState(0);
    const [recentEvents, setRecentEvents] = useState<SecurityEvent[]>([]);
    const [recommendations, setRecommendations] = useState<SecurityRecommendation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        fetchSecurityDashboard().catch(console.error);
    }, []);

    const fetchSecurityDashboard = async () => {
        setIsLoading(true);
        setMessage(null);
        try {
            // TODO: Replace with actual endpoint when backend implements it
            // const res = await apiClient.get("/auth/security-dashboard");
            // setSecurityScore(res.data.security_score || 0);
            // setRecentEvents(res.data.recent_events || []);
            // setRecommendations(res.data.recommendations || []);

            // Calculate security score based on current settings
            const user = await apiClient.get("/profile/info");
            const twoFAStatus = await apiClient.get("/auth/2fa/status");

            let score = 50; // Base score
            if (twoFAStatus.data.is_enabled) score += 30;
            if (user.data.profile?.user_email) score += 10;
            if (user.data.profile?.user_first_name) score += 5;
            if (user.data.profile?.user_last_name) score += 5;

            setSecurityScore(Math.min(score, 100));

            // Placeholder data
            setRecentEvents([
                {
                    id: "1",
                    type: "login",
                    description: "Successful login from new device",
                    timestamp: new Date().toISOString(),
                    severity: "info",
                },
            ]);

            // Generate recommendations based on current state
            const recs: SecurityRecommendation[] = [];

            if (!twoFAStatus.data.is_enabled) {
                recs.push({
                    id: "2fa",
                    title: "Enable Two-Factor Authentication",
                    description: "Add an extra layer of security to your account with 2FA",
                    action: "Enable 2FA",
                    link: "/dashboard/security",
                    priority: "high",
                });
            } else {
                recs.push({
                    id: "backup-codes",
                    title: "Generate Backup Codes",
                    description: "Create backup codes in case you lose access to your authenticator",
                    action: "Generate Codes",
                    link: "/dashboard/security",
                    priority: "medium",
                });
            }

            recs.push({
                id: "password",
                title: "Update Your Password",
                description: "It's been a while since you changed your password",
                action: "Change Password",
                link: "/dashboard/security",
                priority: "low",
            });

            setRecommendations(recs);
        } catch (error: unknown) {
            setMessage({ type: "error", text: getErrorMessage(error, "Failed to fetch security dashboard") });
        } finally {
            setIsLoading(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-500";
        if (score >= 60) return "text-yellow-500";
        return "text-red-500";
    };

    const getScoreLabel = (score: number) => {
        if (score >= 80) return "Excellent";
        if (score >= 60) return "Good";
        if (score >= 40) return "Fair";
        return "Needs Improvement";
    };

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case "critical":
                return <AlertTriangle className="w-4 h-4 text-red-500" />;
            case "warning":
                return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
            default:
                return <Info className="w-4 h-4 text-blue-500" />;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high":
                return "border-red-500/20 bg-red-500/5";
            case "medium":
                return "border-yellow-500/20 bg-yellow-500/5";
            default:
                return "border-blue-500/20 bg-blue-500/5";
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Security Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                    Monitor your account security and get personalized recommendations.
                </p>
            </div>

            {message && (
                <div
                    className={`p-3 rounded-lg text-sm ${message.type === "success" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                        }`}
                >
                    {message.text}
                </div>
            )}

            {/* Security Score */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-xl p-8"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold mb-2">Security Score</h2>
                        <p className="text-muted-foreground">
                            Your account security rating based on enabled features
                        </p>
                    </div>
                    <div className="text-center">
                        <div className={`text-6xl font-bold ${getScoreColor(securityScore)}`}>
                            {securityScore}
                        </div>
                        <p className={`text-sm font-medium mt-1 ${getScoreColor(securityScore)}`}>
                            {getScoreLabel(securityScore)}
                        </p>
                    </div>
                </div>
                <div className="mt-6 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-500 ${securityScore >= 80 ? "bg-green-500" : securityScore >= 60 ? "bg-yellow-500" : "bg-red-500"
                            }`}
                        style={{ width: `${securityScore}%` }}
                    />
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Security Events */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-card border border-border rounded-xl p-6"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Shield className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-semibold">Recent Security Events</h2>
                    </div>
                    <div className="space-y-3">
                        {recentEvents.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>No recent security events</p>
                            </div>
                        ) : (
                            recentEvents.map((event) => (
                                <div
                                    key={event.id}
                                    className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                                >
                                    {getSeverityIcon(event.severity)}
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">{event.description}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {new Date(event.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>

                {/* Security Recommendations */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-card border border-border rounded-xl p-6"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        <h2 className="text-lg font-semibold">Recommendations</h2>
                    </div>
                    <div className="space-y-3">
                        {recommendations.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>All security measures enabled!</p>
                            </div>
                        ) : (
                            recommendations.map((rec) => (
                                <div
                                    key={rec.id}
                                    className={`p-4 rounded-lg border ${getPriorityColor(rec.priority)}`}
                                >
                                    <h3 className="font-medium text-sm mb-1">{rec.title}</h3>
                                    <p className="text-xs text-muted-foreground mb-3">{rec.description}</p>
                                    <Link
                                        href={rec.link}
                                        className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                                    >
                                        {rec.action}
                                        <ArrowRight className="w-3 h-3" />
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
