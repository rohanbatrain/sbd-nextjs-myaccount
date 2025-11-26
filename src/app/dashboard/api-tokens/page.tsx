"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/error-utils";
import { Key, Plus, Trash2, Copy, Check, Calendar, Shield } from "lucide-react";
import { motion } from "framer-motion";

interface ApiToken {
    token_id: string;
    name: string;
    description?: string;
    created_at: string;
    last_used_at?: string;
    expires_at?: string;
    scopes?: string[];
    is_revoked: boolean;
}

export default function ApiTokensPage() {
    const [tokens, setTokens] = useState<ApiToken[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newToken, setNewToken] = useState<{ name: string; description: string; expires_in_days?: number }>({
        name: "",
        description: "",
    });
    const [createdToken, setCreatedToken] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        fetchTokens().catch(console.error);
    }, []);

    const fetchTokens = async () => {
        setIsLoading(true);
        try {
            const res = await apiClient.get("/auth/permanent-tokens");
            setTokens(res.data.tokens || []);
        } catch (error: unknown) {
            setMessage({ type: "error", text: getErrorMessage(error, "Failed to fetch API tokens") });
        } finally {
            setIsLoading(false);
        }
    };

    const createToken = async () => {
        if (!newToken.name.trim()) {
            setMessage({ type: "error", text: "Token name is required" });
            return;
        }

        try {
            const res = await apiClient.post("/auth/permanent-tokens/create", newToken);
            setCreatedToken(res.data.token);
            setMessage({ type: "success", text: "API token created successfully" });
            await fetchTokens();
            setNewToken({ name: "", description: "" });
        } catch (error: unknown) {
            setMessage({ type: "error", text: getErrorMessage(error, "Failed to create API token") });
        }
    };

    const revokeToken = async (tokenId: string) => {
        if (!confirm("Are you sure you want to revoke this token? This action cannot be undone.")) return;

        try {
            await apiClient.post("/auth/permanent-tokens/revoke", { token_id: tokenId });
            setMessage({ type: "success", text: "Token revoked successfully" });
            await fetchTokens();
        } catch (error: unknown) {
            setMessage({ type: "error", text: getErrorMessage(error, "Failed to revoke token") });
        }
    };

    const copyToken = (token: string, id: string) => {
        navigator.clipboard.writeText(token);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "Never";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">API Tokens</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage API tokens for programmatic access to your account.
                    </p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Create Token
                </button>
            </div>

            {message && (
                <div
                    className={`p-3 rounded-lg text-sm ${message.type === "success" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                        }`}
                >
                    {message.text}
                </div>
            )}

            {/* Create Token Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-card border border-border rounded-xl p-6 max-w-md w-full"
                    >
                        <h2 className="text-xl font-bold mb-4">Create API Token</h2>

                        {createdToken ? (
                            <div className="space-y-4">
                                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                                    <p className="text-sm text-yellow-600 dark:text-yellow-500 font-medium mb-2">
                                        ⚠️ Save this token now! You won&apos;t be able to see it again.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Your API Token</label>
                                    <div className="flex items-center gap-2">
                                        <code className="flex-1 bg-muted p-3 rounded-lg text-sm font-mono break-all">
                                            {createdToken}
                                        </code>
                                        <button
                                            onClick={() => copyToken(createdToken, "new")}
                                            className="p-2 hover:bg-muted rounded transition-colors"
                                        >
                                            {copiedId === "new" ? (
                                                <Check className="w-4 h-4 text-green-500" />
                                            ) : (
                                                <Copy className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setCreatedToken(null);
                                    }}
                                    className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                                >
                                    Done
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Token Name *</label>
                                    <input
                                        type="text"
                                        value={newToken.name}
                                        onChange={(e) => setNewToken({ ...newToken, name: e.target.value })}
                                        className="w-full bg-background border border-border rounded-lg px-3 py-2"
                                        placeholder="e.g., Production API"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Description</label>
                                    <textarea
                                        value={newToken.description}
                                        onChange={(e) => setNewToken({ ...newToken, description: e.target.value })}
                                        className="w-full bg-background border border-border rounded-lg px-3 py-2 min-h-[80px]"
                                        placeholder="What will this token be used for?"
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setShowCreateModal(false);
                                            setNewToken({ name: "", description: "" });
                                        }}
                                        className="flex-1 bg-background border border-border px-4 py-2 rounded-lg font-medium hover:bg-muted transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={createToken}
                                        className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                                    >
                                        Create
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}

            {/* Tokens List */}
            <div className="space-y-3">
                {isLoading ? (
                    <div className="text-center py-12 text-muted-foreground">Loading tokens...</div>
                ) : tokens.length === 0 ? (
                    <div className="text-center py-12">
                        <Key className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <p className="text-muted-foreground">No API tokens yet</p>
                        <p className="text-sm text-muted-foreground mt-1">Create your first token to get started</p>
                    </div>
                ) : (
                    tokens.map((token) => (
                        <div
                            key={token.token_id}
                            className={`p-4 border rounded-lg ${token.is_revoked
                                ? "border-red-500/20 bg-red-500/5 opacity-60"
                                : "border-border hover:bg-muted/50"
                                } transition-colors`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold">{token.name}</h3>
                                        {token.is_revoked && (
                                            <span className="text-xs font-medium bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full">
                                                Revoked
                                            </span>
                                        )}
                                    </div>
                                    {token.description && (
                                        <p className="text-sm text-muted-foreground mt-1">{token.description}</p>
                                    )}
                                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            Created: {formatDate(token.created_at)}
                                        </span>
                                        {token.last_used_at && (
                                            <span className="flex items-center gap-1">
                                                <Shield className="w-3 h-3" />
                                                Last used: {formatDate(token.last_used_at)}
                                            </span>
                                        )}
                                        {token.expires_at && (
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                Expires: {formatDate(token.expires_at)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {!token.is_revoked && (
                                    <button
                                        onClick={() => revokeToken(token.token_id)}
                                        className="flex items-center gap-1 text-sm font-medium text-red-500 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                        Revoke
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <h3 className="font-semibold text-sm mb-2">Security Best Practices</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Never share your API tokens with anyone</li>
                    <li>• Store tokens securely (e.g., environment variables)</li>
                    <li>• Revoke tokens immediately if compromised</li>
                    <li>• Use separate tokens for different applications</li>
                    <li>• Regularly rotate your tokens</li>
                </ul>
            </div>
        </div>
    );
}
