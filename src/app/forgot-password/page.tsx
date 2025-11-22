"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/error-utils";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            await apiClient.post("/auth/forgot-password", { email });
            setEmailSent(true);
            setMessage({
                type: "success",
                text: "Password reset instructions have been sent to your email address.",
            });
        } catch (error: unknown) {
            setMessage({
                type: "error",
                text: getErrorMessage(error, "Failed to send reset email. Please try again."),
            });
        } finally {
            setIsLoading(false);
        }
    };

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
                <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to login
                </Link>

                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                        <Mail className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold">Forgot your password?</h1>
                    <p className="text-white/50 mt-2">
                        {emailSent
                            ? "Check your email for reset instructions"
                            : "Enter your email and we'll send you reset instructions"}
                    </p>
                </div>

                {!emailSent ? (
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
                            <label className="text-sm font-medium text-white/70">Email address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-white/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send reset instructions"}
                        </button>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                            <p className="text-sm text-green-500 text-center">
                                We&apos;ve sent password reset instructions to <strong>{email}</strong>
                            </p>
                        </div>

                        <div className="text-center text-sm text-white/50">
                            <p>Didn&apos;t receive the email?</p>
                            <button
                                onClick={() => {
                                    setEmailSent(false);
                                    setMessage(null);
                                }}
                                className="text-purple-400 hover:text-purple-300 transition-colors mt-2"
                            >
                                Try again
                            </button>
                        </div>
                    </div>
                )}

                <div className="mt-6 text-center text-sm text-white/50">
                    <Link href="/login" className="hover:text-white transition-colors">
                        Remember your password? Sign in
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
