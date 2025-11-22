"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/error-utils";
import { Loader2, Lock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [token, setToken] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [resetSuccess, setResetSuccess] = useState(false);

    useEffect(() => {
        const tokenParam = searchParams.get("token");
        if (tokenParam) {
            setToken(tokenParam);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        if (password !== confirmPassword) {
            setMessage({ type: "error", text: "Passwords do not match" });
            setIsLoading(false);
            return;
        }

        if (password.length < 8) {
            setMessage({ type: "error", text: "Password must be at least 8 characters" });
            setIsLoading(false);
            return;
        }

        try {
            await apiClient.post("/auth/reset-password", {
                token,
                new_password: password,
            });
            setResetSuccess(true);
            setMessage({
                type: "success",
                text: "Your password has been reset successfully!",
            });

            // Redirect to login after 3 seconds
            setTimeout(() => {
                router.push("/login");
            }, 3000);
        } catch (error: unknown) {
            setMessage({
                type: "error",
                text: getErrorMessage(error, "Failed to reset password. The link may have expired."),
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Invalid Reset Link</h1>
                    <p className="text-white/50 mb-6">This password reset link is invalid or has expired.</p>
                    <Link
                        href="/forgot-password"
                        className="inline-block bg-white text-black font-semibold px-6 py-3 rounded-lg hover:bg-white/90 transition-colors"
                    >
                        Request a new link
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-xl relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                        {resetSuccess ? <CheckCircle className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                    </div>
                    <h1 className="text-2xl font-bold">
                        {resetSuccess ? "Password Reset!" : "Reset your password"}
                    </h1>
                    <p className="text-white/50 mt-2">
                        {resetSuccess
                            ? "Redirecting you to login..."
                            : "Enter your new password below"}
                    </p>
                </div>

                {!resetSuccess ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {message && (
                            <div
                                className={`p-3 rounded-lg text-sm text-center ${message.type === "success"
                                    ? "bg-green-500/10 border border-green-500/20 text-green-500"
                                    : "bg-red-500/10 border border-red-500/20 text-red-500"
                                    }`}
                            >
                                {message.text}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/70">New password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                                placeholder="Enter new password"
                                required
                                minLength={8}
                            />
                            <p className="text-xs text-white/40">Must be at least 8 characters</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/70">Confirm password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                                placeholder="Confirm new password"
                                required
                                minLength={8}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-white/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Reset password"}
                        </button>
                    </form>
                ) : (
                    <div className="text-center">
                        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg mb-4">
                            <p className="text-sm text-green-500">
                                Your password has been successfully reset. You can now sign in with your new password.
                            </p>
                        </div>
                        <Link
                            href="/login"
                            className="inline-block bg-white text-black font-semibold px-6 py-3 rounded-lg hover:bg-white/90 transition-colors"
                        >
                            Go to login
                        </Link>
                    </div>
                )}
            </motion.div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}
