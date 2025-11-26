"use client";

import { useState, useEffect } from "react";
import { getErrorMessage } from "@/lib/error-utils";
import { Laptop, Smartphone, Tablet, MapPin, Calendar, LogOut, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface LoginHistoryItem {
    timestamp: string;
    ip_address: string;
    user_agent: string;
    location?: string;
    success: boolean;
}

interface ActiveSession {
    session_id: string;
    device_type: string;
    device_name: string;
    browser: string;
    os: string;
    ip_address: string;
    location?: string;
    last_active: string;
    is_current: boolean;
}

export default function LoginHistoryPage() {
    const [activeTab, setActiveTab] = useState<"history" | "sessions">("history");
    const [loginHistory, setLoginHistory] = useState<LoginHistoryItem[]>([]);
    const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        if (activeTab === "history") {
            fetchLoginHistory().catch(console.error);
        } else {
            fetchActiveSessions().catch(console.error);
        }
    }, [activeTab]);

    const fetchLoginHistory = async () => {
        setIsLoading(true);
        setMessage(null);
        try {
            // TODO: Replace with actual endpoint when backend implements it
            // const res = await apiClient.get("/auth/login-history");
            // setLoginHistory(res.data.history || []);

            // Placeholder data for now
            setLoginHistory([
                {
                    timestamp: new Date().toISOString(),
                    ip_address: "192.168.1.1",
                    user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
                    location: "San Francisco, CA",
                    success: true,
                },
            ]);
        } catch (error: unknown) {
            setMessage({ type: "error", text: getErrorMessage(error, "Failed to fetch login history") });
        } finally {
            setIsLoading(false);
        }
    };

    const fetchActiveSessions = async () => {
        setIsLoading(true);
        setMessage(null);
        try {
            // TODO: Replace with actual endpoint when backend implements it
            // const res = await apiClient.get("/auth/sessions/active");
            // setActiveSessions(res.data.sessions || []);

            // Placeholder data for now
            setActiveSessions([
                {
                    session_id: "current",
                    device_type: "desktop",
                    device_name: "MacBook Pro",
                    browser: "Chrome",
                    os: "macOS",
                    ip_address: "192.168.1.1",
                    location: "San Francisco, CA",
                    last_active: new Date().toISOString(),
                    is_current: true,
                },
            ]);
        } catch (error: unknown) {
            setMessage({ type: "error", text: getErrorMessage(error, "Failed to fetch active sessions") });
        } finally {
            setIsLoading(false);
        }
    };

    const revokeSession = async () => {
        if (!confirm("Are you sure you want to revoke this session?")) return;

        try {
            // TODO: Replace with actual endpoint when backend implements it
            // await apiClient.post("/auth/sessions/revoke", { session_id: sessionId });
            setMessage({ type: "success", text: "Session revoked successfully" });
            await fetchActiveSessions();
        } catch (error: unknown) {
            setMessage({ type: "error", text: getErrorMessage(error, "Failed to revoke session") });
        }
    };

    const getDeviceIcon = (deviceType: string) => {
        switch (deviceType) {
            case "mobile":
                return <Smartphone className="w-5 h-5" />;
            case "tablet":
                return <Tablet className="w-5 h-5" />;
            default:
                return <Laptop className="w-5 h-5" />;
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Login Activity</h1>
                <p className="text-muted-foreground mt-2">
                    View your login history and manage active sessions.
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

            <div className="flex gap-2 border-b border-border">
                <button
                    onClick={() => setActiveTab("history")}
                    className={`px-4 py-2 font-medium transition-colors ${activeTab === "history"
                        ? "text-primary border-b-2 border-primary"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                >
                    Login History
                </button>
                <button
                    onClick={() => setActiveTab("sessions")}
                    className={`px-4 py-2 font-medium transition-colors ${activeTab === "sessions"
                        ? "text-primary border-b-2 border-primary"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                >
                    Active Sessions
                </button>
            </div>

            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
            >
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                ) : activeTab === "history" ? (
                    <div className="space-y-3">
                        {loginHistory.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                No login history available
                            </div>
                        ) : (
                            loginHistory.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-start justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.success ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                                            }`}>
                                            <Laptop className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                {item.success ? "Successful login" : "Failed login attempt"}
                                            </p>
                                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {item.location || item.ip_address}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(item.timestamp).toLocaleString()}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1 font-mono">
                                                {item.user_agent.substring(0, 60)}...
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {activeSessions.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                No active sessions
                            </div>
                        ) : (
                            activeSessions.map((session) => (
                                <div
                                    key={session.session_id}
                                    className="flex items-start justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                            {getDeviceIcon(session.device_type)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium">{session.device_name}</p>
                                                {session.is_current && (
                                                    <span className="text-xs font-medium bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full">
                                                        Current
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {session.browser} • {session.os}
                                            </p>
                                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {session.location || session.ip_address}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    Last active: {new Date(session.last_active).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {!session.is_current && (
                                        <button
                                            onClick={() => revokeSession()}
                                            className="flex items-center gap-1 text-sm font-medium text-red-500 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors"
                                        >
                                            <LogOut className="w-3 h-3" />
                                            Revoke
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </motion.div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <p className="text-sm text-yellow-600 dark:text-yellow-500">
                    <strong>Note:</strong> Login history and session management features are currently in development.
                    The data shown above is placeholder data. Full functionality will be available when backend endpoints are implemented.
                </p>
            </div>
        </div>
    );
}
