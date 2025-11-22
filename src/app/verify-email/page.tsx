"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/error-utils";
import { Loader2, CheckCircle, XCircle, Mail } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const [isVerifying, setIsVerifying] = useState(true);
    const [isVerified, setIsVerified] = useState(false);
    const [message, setMessage] = useState("");
    const [canResend, setCanResend] = useState(false);
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {
        const token = searchParams.get("token");
        const username = searchParams.get("username");

        if (token || username) {
            verifyEmail(token, username).catch(console.error);
        } else {
            setIsVerifying(false);
            setMessage("No verification token provided");
        }
    }, [searchParams]);

    const verifyEmail = async (token: string | null, username: string | null) => {
        try {
            const params = new URLSearchParams();
            if (token) params.append("token", token);
            if (username) params.append("username", username);

            await apiClient.get(`/auth/verify-email?${params.toString()}`);
            setIsVerified(true);
            setMessage("Your email has been verified successfully!");
        } catch (error: unknown) {
            setIsVerified(false);
            setMessage(getErrorMessage(error, "Email verification failed"));
            setCanResend(true);
        } finally {
            setIsVerifying(false);
        }
    };

    const resendVerification = async () => {
        setIsResending(true);
        try {
            await apiClient.post("/auth/resend-verification-email");
            setMessage("Verification email sent! Please check your inbox.");
            setCanResend(false);
        } catch (error: unknown) {
            setMessage(getErrorMessage(error, "Failed to resend verification email"));
        } finally {
            setIsResending(false);
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
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center">
                        {isVerifying ? (
                            <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
                        ) : isVerified ? (
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-10 h-10 text-green-500" />
                            </div>
                        ) : (
                            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                                <XCircle className="w-10 h-10 text-red-500" />
                            </div>
                        )}
                    </div>

                    <h1 className="text-2xl font-bold mb-4">
                        {isVerifying ? "Verifying your email..." : isVerified ? "Email Verified!" : "Verification Failed"}
                    </h1>

                    <p className={`mb-6 ${isVerified ? "text-green-500" : "text-white/70"}`}>
                        {message}
                    </p>

                    {isVerified ? (
                        <Link
                            href="/login"
                            className="inline-block w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-white/90 transition-colors"
                        >
                            Continue to login
                        </Link>
                    ) : !isVerifying && canResend ? (
                        <div className="space-y-4">
                            <button
                                onClick={resendVerification}
                                disabled={isResending}
                                className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-white/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isResending ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Mail className="w-5 h-5" />
                                        Resend verification email
                                    </>
                                )}
                            </button>
                            <Link
                                href="/login"
                                className="block text-center text-sm text-white/50 hover:text-white transition-colors"
                            >
                                Back to login
                            </Link>
                        </div>
                    ) : !isVerifying ? (
                        <Link
                            href="/login"
                            className="inline-block w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-white/90 transition-colors"
                        >
                            Back to login
                        </Link>
                    ) : null}
                </div>
            </motion.div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}
