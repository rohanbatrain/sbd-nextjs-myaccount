"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/error-utils";
import { Download, RefreshCw, Shield, Copy, Check } from "lucide-react";

interface BackupCode {
    code: string;
    used: boolean;
}

export function BackupCodes() {
    const [codes, setCodes] = useState<BackupCode[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const generateCodes = async () => {
        setIsLoading(true);
        setMessage(null);
        try {
            const res = await apiClient.get("/auth/2fa/backup-codes");
            setCodes(res.data.backup_codes || []);
            setMessage({ type: "success", text: "Backup codes generated successfully" });
        } catch (error: unknown) {
            setMessage({ type: "error", text: getErrorMessage(error, "Failed to generate backup codes") });
        } finally {
            setIsLoading(false);
        }
    };

    const regenerateCodes = async () => {
        if (!confirm("Are you sure? This will invalidate all existing backup codes.")) return;
        setIsLoading(true);
        setMessage(null);
        try {
            const res = await apiClient.post("/auth/2fa/regenerate-backup-codes");
            setCodes(res.data.backup_codes || []);
            setMessage({ type: "success", text: "Backup codes regenerated successfully" });
        } catch (error: unknown) {
            setMessage({ type: "error", text: getErrorMessage(error, "Failed to regenerate backup codes") });
        } finally {
            setIsLoading(false);
        }
    };

    const copyCode = (code: string, index: number) => {
        navigator.clipboard.writeText(code);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const downloadCodes = () => {
        const text = codes.map((c) => c.code).join("\n");
        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "sbd-backup-codes.txt";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Backup Codes
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                    Generate backup codes to access your account if you lose your authenticator device.
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

            {codes.length === 0 ? (
                <button
                    onClick={generateCodes}
                    disabled={isLoading}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                    {isLoading ? "Generating..." : "Generate Backup Codes"}
                </button>
            ) : (
                <div className="space-y-4">
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                        <p className="text-sm text-yellow-600 dark:text-yellow-500 font-medium">
                            ⚠️ Save these codes in a secure location. Each code can only be used once.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 bg-muted/50 p-4 rounded-lg border border-border">
                        {codes.map((backup, index) => (
                            <div
                                key={index}
                                className={`flex items-center justify-between p-3 rounded-lg border ${backup.used
                                        ? "bg-muted/50 border-border opacity-50"
                                        : "bg-background border-border hover:border-primary/50"
                                    }`}
                            >
                                <code className="font-mono text-sm font-semibold tracking-wider">
                                    {backup.code}
                                </code>
                                {!backup.used && (
                                    <button
                                        onClick={() => copyCode(backup.code, index)}
                                        className="ml-2 p-1 hover:bg-muted rounded transition-colors"
                                        title="Copy code"
                                    >
                                        {copiedIndex === index ? (
                                            <Check className="w-4 h-4 text-green-500" />
                                        ) : (
                                            <Copy className="w-4 h-4 text-muted-foreground" />
                                        )}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={downloadCodes}
                            className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg font-medium hover:bg-muted transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Download Codes
                        </button>
                        <button
                            onClick={regenerateCodes}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg font-medium hover:bg-muted transition-colors disabled:opacity-50"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Regenerate Codes
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
