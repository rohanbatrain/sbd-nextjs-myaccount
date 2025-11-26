"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { apiClient } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/error-utils";
import { Loader2, Shield, Key, Smartphone, Laptop, LogOut } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { BackupCodes } from "@/components/security/BackupCodes";

// Password Change Schema
const passwordSchema = z.object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string().min(8, "Password must be at least 8 characters"),
}).refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function SecurityPage() {
    const [activeTab, setActiveTab] = useState<"password" | "2fa" | "backup" | "sessions">("password");

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Security</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your password, 2FA, backup codes, and active sessions.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:w-64 flex-shrink-0">
                    <nav className="flex flex-col space-y-1">
                        <button
                            onClick={() => setActiveTab("password")}
                            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === "password"
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                        >
                            <Key className="w-4 h-4" />
                            Password
                        </button>
                        <button
                            onClick={() => setActiveTab("2fa")}
                            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === "2fa"
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                        >
                            <Smartphone className="w-4 h-4" />
                            Two-Factor Auth
                        </button>
                        <button
                            onClick={() => setActiveTab("backup")}
                            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === "backup"
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                        >
                            <Shield className="w-4 h-4" />
                            Backup Codes
                        </button>
                        <button
                            onClick={() => setActiveTab("sessions")}
                            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === "sessions"
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                        >
                            <Laptop className="w-4 h-4" />
                            Sessions
                        </button>
                    </nav>
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-card border border-border rounded-xl p-6"
                    >
                        {activeTab === "password" && <ChangePasswordForm />}
                        {activeTab === "2fa" && <TwoFactorAuth />}
                        {activeTab === "backup" && <BackupCodes />}
                        {activeTab === "sessions" && <SessionsList />}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

function ChangePasswordForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const form = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
    });

    const onSubmit = async (data: PasswordFormValues) => {
        setIsLoading(true);
        setMessage(null);
        try {
            await apiClient.post("/auth/change-password", {
                current_password: data.current_password,
                new_password: data.new_password,
            });
            setMessage({ type: "success", text: "Password changed successfully" });
            form.reset();
        } catch (error: unknown) {
            setMessage({
                type: "error",
                text: getErrorMessage(error, "Failed to change password"),
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold">Change Password</h2>
                <p className="text-sm text-muted-foreground">
                    Ensure your account is using a long, random password to stay secure.
                </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
                {message && (
                    <div
                        className={`p-3 rounded-lg text-sm ${message.type === "success"
                            ? "bg-green-500/10 text-green-500"
                            : "bg-red-500/10 text-red-500"
                            }`}
                    >
                        {message.text}
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-medium">Current Password</label>
                    <input
                        type="password"
                        {...form.register("current_password")}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    {form.formState.errors.current_password && (
                        <p className="text-xs text-red-500">{form.formState.errors.current_password.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">New Password</label>
                    <input
                        type="password"
                        {...form.register("new_password")}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    {form.formState.errors.new_password && (
                        <p className="text-xs text-red-500">{form.formState.errors.new_password.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Confirm New Password</label>
                    <input
                        type="password"
                        {...form.register("confirm_password")}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    {form.formState.errors.confirm_password && (
                        <p className="text-xs text-red-500">{form.formState.errors.confirm_password.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Update Password
                </button>
            </form>
        </div>
    );
}

function TwoFactorAuth() {
    const [status, setStatus] = useState<"enabled" | "disabled" | "loading" | "setup">("loading");
    const [setupData, setSetupData] = useState<{ secret: string; otpauth_url: string } | null>(null);
    const [verifyCode, setVerifyCode] = useState("");
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const checkStatus = async () => {
        try {
            const res = await apiClient.get("/auth/2fa/status");
            setStatus(res.data.is_enabled ? "enabled" : "disabled");
        } catch (error: unknown) {
            console.error("Failed to check 2FA status", error);
        }
    };

    const startSetup = async () => {
        try {
            const res = await apiClient.post("/auth/2fa/setup");
            setSetupData(res.data);
            setStatus("setup");
            setMessage(null);
        } catch (error: unknown) {
            console.error("Failed to start 2FA setup", error);
            alert("Failed to start 2FA setup");
        }
    };

    useEffect(() => {
        checkStatus().catch(console.error);
         
    }, []);

    const verifySetup = async () => {
        try {
            await apiClient.post("/auth/2fa/verify", { code: verifyCode });
            setStatus("enabled");
            setSetupData(null);
            setMessage({ type: "success", text: "2FA enabled successfully" });
        } catch (error: unknown) {
            setMessage({
                type: "error",
                text: getErrorMessage(error, "Invalid code"),
            });
        }
    };

    const disable2FA = async () => {
        if (!confirm("Are you sure you want to disable 2FA? This will make your account less secure.")) return;
        try {
            await apiClient.post("/auth/2fa/disable");
            setStatus("disabled");
            setMessage({ type: "success", text: "2FA disabled successfully" });
        } catch (error) {
            console.error("Failed to disable 2FA", error);
        }
    };

    if (status === "loading") return <Loader2 className="w-6 h-6 animate-spin" />;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold">Two-Factor Authentication</h2>
                <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account by requiring a code from your phone.
                </p>
            </div>

            {status === "enabled" ? (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-medium text-green-500">2FA is enabled</p>
                            <p className="text-xs text-green-500/80">Your account is protected.</p>
                        </div>
                    </div>
                    <button
                        onClick={disable2FA}
                        className="text-sm font-medium text-red-500 hover:bg-red-500/10 px-3 py-2 rounded-lg transition-colors"
                    >
                        Disable
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {!setupData ? (
                        <button
                            onClick={startSetup}
                            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                        >
                            Setup 2FA
                        </button>
                    ) : (
                        <div className="space-y-6 border border-border rounded-lg p-6">
                            <div className="flex flex-col items-center space-y-4">
                                <div className="bg-white p-2 rounded-lg">
                                    <QRCodeSVG value={setupData.otpauth_url} size={192} />
                                </div>
                                <p className="text-sm text-center text-muted-foreground max-w-xs">
                                    Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                                </p>
                            </div>

                            <div className="space-y-2 max-w-xs mx-auto">
                                <label className="text-sm font-medium">Enter Code</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={verifyCode}
                                        onChange={(e) => setVerifyCode(e.target.value)}
                                        className="flex-1 bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 text-center tracking-widest font-mono"
                                        placeholder="000000"
                                        maxLength={6}
                                    />
                                    <button
                                        onClick={verifySetup}
                                        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                                    >
                                        Verify
                                    </button>
                                </div>
                                {message && (
                                    <p className={`text-xs text-center ${message.type === "error" ? "text-red-500" : "text-green-500"}`}>
                                        {message.text}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function SessionsList() {
    // Placeholder for sessions list as backend endpoint might vary or need implementation
    // Assuming a hypothetical endpoint or just showing current session
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold">Active Sessions</h2>
                <p className="text-sm text-muted-foreground">
                    Manage devices where you are currently logged in.
                </p>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            <Laptop className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="font-medium">Current Session</p>
                            <p className="text-xs text-muted-foreground">Mac OS • Chrome • Just now</p>
                        </div>
                    </div>
                    <span className="text-xs font-medium bg-green-500/10 text-green-500 px-2 py-1 rounded-full">
                        Active
                    </span>
                </div>

                {/* Example of other sessions */}
                <div className="flex items-center justify-between p-4 border border-border rounded-lg opacity-60">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            <Smartphone className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="font-medium">iPhone 13</p>
                            <p className="text-xs text-muted-foreground">iOS • Safari • 2 days ago</p>
                        </div>
                    </div>
                    <button className="text-xs font-medium text-red-500 hover:bg-red-500/10 px-2 py-1 rounded-lg transition-colors flex items-center gap-1">
                        <LogOut className="w-3 h-3" /> Revoke
                    </button>
                </div>
            </div>
        </div>
    );
}
