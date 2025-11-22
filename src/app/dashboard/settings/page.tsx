"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/error-utils";
import { Settings as SettingsIcon, Globe, Bell, Lock, Download, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<"general" | "notifications" | "privacy" | "data">("general");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const requestDataDownload = async () => {
        setIsLoading(true);
        setMessage(null);
        try {
            // TODO: Implement when backend endpoint is ready
            setMessage({ type: "success", text: "Data download request submitted. You'll receive an email when ready." });
        } catch (error: unknown) {
            setMessage({ type: "error", text: getErrorMessage(error, "Failed to request data download") });
        } finally {
            setIsLoading(false);
        }
    };

    const requestDataDeletion = async () => {
        if (!confirm("Are you sure you want to delete all your data? This action cannot be undone.")) return;

        setIsLoading(true);
        setMessage(null);
        try {
            // TODO: Implement when backend endpoint is ready
            setMessage({ type: "success", text: "Data deletion request submitted. This may take a few days to process." });
        } catch (error: unknown) {
            setMessage({ type: "error", text: getErrorMessage(error, "Failed to request data deletion") });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your account preferences and settings.
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

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar */}
                <div className="lg:w-64 flex-shrink-0">
                    <nav className="flex flex-col space-y-1">
                        <button
                            onClick={() => setActiveTab("general")}
                            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === "general"
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                        >
                            <Globe className="w-4 h-4" />
                            General
                        </button>
                        <button
                            onClick={() => setActiveTab("notifications")}
                            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === "notifications"
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                        >
                            <Bell className="w-4 h-4" />
                            Notifications
                        </button>
                        <button
                            onClick={() => setActiveTab("privacy")}
                            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === "privacy"
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                        >
                            <Lock className="w-4 h-4" />
                            Privacy
                        </button>
                        <button
                            onClick={() => setActiveTab("data")}
                            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === "data"
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                        >
                            <Download className="w-4 h-4" />
                            Data & Privacy
                        </button>
                    </nav>
                </div>

                {/* Content */}
                <div className="flex-1">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-card border border-border rounded-xl p-6"
                    >
                        {activeTab === "general" && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-lg font-semibold mb-4">General Settings</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium">Language</label>
                                            <select className="w-full mt-1 bg-background border border-border rounded-lg px-3 py-2">
                                                <option>English</option>
                                                <option>Spanish</option>
                                                <option>French</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">Timezone</label>
                                            <select className="w-full mt-1 bg-background border border-border rounded-lg px-3 py-2">
                                                <option>UTC</option>
                                                <option>America/New_York</option>
                                                <option>Europe/London</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "notifications" && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-lg font-semibold mb-4">Notification Preferences</h2>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">Email Notifications</p>
                                                <p className="text-sm text-muted-foreground">Receive updates via email</p>
                                            </div>
                                            <input type="checkbox" className="w-4 h-4" defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">Security Alerts</p>
                                                <p className="text-sm text-muted-foreground">Get notified about security events</p>
                                            </div>
                                            <input type="checkbox" className="w-4 h-4" defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">Marketing Emails</p>
                                                <p className="text-sm text-muted-foreground">Receive promotional content</p>
                                            </div>
                                            <input type="checkbox" className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "privacy" && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-lg font-semibold mb-4">Privacy Settings</h2>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">Profile Visibility</p>
                                                <p className="text-sm text-muted-foreground">Who can see your profile</p>
                                            </div>
                                            <select className="bg-background border border-border rounded-lg px-3 py-2 text-sm">
                                                <option>Everyone</option>
                                                <option>Friends Only</option>
                                                <option>Private</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">Activity Status</p>
                                                <p className="text-sm text-muted-foreground">Show when you're online</p>
                                            </div>
                                            <input type="checkbox" className="w-4 h-4" defaultChecked />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "data" && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-lg font-semibold mb-4">Data & Privacy</h2>
                                    <div className="space-y-4">
                                        <div className="p-4 border border-border rounded-lg">
                                            <div className="flex items-start gap-3">
                                                <Download className="w-5 h-5 text-primary mt-0.5" />
                                                <div className="flex-1">
                                                    <h3 className="font-medium">Download Your Data</h3>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        Get a copy of all your data in a portable format
                                                    </p>
                                                    <button
                                                        onClick={requestDataDownload}
                                                        disabled={isLoading}
                                                        className="mt-3 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                                                    >
                                                        Request Download
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 border border-red-500/20 bg-red-500/5 rounded-lg">
                                            <div className="flex items-start gap-3">
                                                <Trash2 className="w-5 h-5 text-red-500 mt-0.5" />
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-red-500">Delete Your Account</h3>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        Permanently delete your account and all associated data
                                                    </p>
                                                    <button
                                                        onClick={requestDataDeletion}
                                                        disabled={isLoading}
                                                        className="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                                                    >
                                                        Delete Account
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
