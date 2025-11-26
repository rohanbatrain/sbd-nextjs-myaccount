"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, AlertTriangle, CheckCircle, ServerCrash, Pause, Play, X } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useWebSocketProgress } from "@/hooks/useWebSocketProgress";

interface Instance {
    instance_id: string;
    instance_name: string;
    instance_url: string;
    size_gb: number;
    collection_count: number;
    status: "online" | "offline";
}

interface TransferProgress {
    current_collection: string | null;
    documents_transferred: number;
    total_documents: number;
    percentage: number;
}

export function DirectTransfer() {
    const [instances, setInstances] = useState<Instance[]>([]);
    const [fromInstance, setFromInstance] = useState("");
    const [toInstance, setToInstance] = useState("");
    const [isTransferring, setIsTransferring] = useState(false);
    const [transferId, setTransferId] = useState("");
    const [progress, setProgress] = useState<TransferProgress | null>(null);
    const [error, setError] = useState("");
    const [isPaused, setIsPaused] = useState(false);

    // Use WebSocket for real-time updates (with REST fallback)
    const { isConnected } = useWebSocketProgress({
        transferId,
        enabled: isTransferring,
    });

    useEffect(() => {
        const fetchInstances = async () => {
            try {
                const res = await apiClient.get("/migration/instances");
                setInstances(res.data);
            } catch {
                setError("Failed to fetch instances");
            }
        };

        fetchInstances();
    }, []);

    const handleStartTransfer = async () => {
        if (!fromInstance || !toInstance) {
            setError("Please select both source and target instances");
            return;
        }

        setIsTransferring(true);
        setError("");
        setProgress(null);
        setIsPaused(false);

        try {
            const res = await apiClient.post("/migration/transfer/direct", {
                from_instance_id: fromInstance,
                to_instance_id: toInstance,
            });
            setTransferId(res.data.transfer_id);
        } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            setError(err.response?.data?.detail || "Failed to start transfer");
            setIsTransferring(false);
        }
    };

    const handlePauseResume = async () => {
        if (!transferId) return;

        try {
            const action = isPaused ? "resume" : "pause";
            await apiClient.post(`/migration/transfer/${transferId}/control`, { action });
            setIsPaused(!isPaused);
        } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            setError(err.response?.data?.detail || "Failed to pause/resume transfer");
        }
    };

    const handleCancel = async () => {
        if (!transferId || !confirm("Are you sure you want to cancel this transfer?")) return;

        try {
            await apiClient.post(`/migration/transfer/${transferId}/control`, { action: "cancel" });
            setIsTransferring(false);
            setTransferId("");
        } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            setError(err.response?.data?.detail || "Failed to cancel transfer");
        }
    };

    const getWarningMessage = () => {
        if (!fromInstance || !toInstance) return null;
        const from = instances.find((i) => i.instance_id === fromInstance);
        const to = instances.find((i) => i.instance_id === toInstance);
        if (from && to && from.size_gb > to.size_gb) {
            return `Source instance (${from.size_gb.toFixed(1)}GB) is larger than target (${to.size_gb.toFixed(1)}GB)`;
        }
        return null;
    };

    const warning = getWarningMessage();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl p-6 space-y-6"
        >
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Direct Transfer</h3>
                {isConnected && (
                    <span className="text-xs text-green-500 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        Live updates
                    </span>
                )}
            </div>

            <div className="space-y-4">
                {/* From Instance */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Source Instance</label>
                    <select
                        value={fromInstance}
                        onChange={(e) => setFromInstance(e.target.value)}
                        disabled={isTransferring}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        <option value="">Select source...</option>
                        {instances.map((inst) => (
                            <option key={inst.instance_id} value={inst.instance_id}>
                                {inst.instance_name} - {inst.size_gb.toFixed(1)}GB ({inst.status})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Arrow */}
                <div className="flex justify-center">
                    <ArrowRight className="w-6 h-6 text-muted-foreground" />
                </div>

                {/* To Instance */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Target Instance</label>
                    <select
                        value={toInstance}
                        onChange={(e) => setToInstance(e.target.value)}
                        disabled={isTransferring}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        <option value="">Select target...</option>
                        {instances.map((inst) => (
                            <option key={inst.instance_id} value={inst.instance_id}>
                                {inst.instance_name} - {inst.size_gb.toFixed(1)}GB ({inst.status})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Warning */}
            {warning && (
                <div className="flex items-center gap-2 p-3 bg-yellow-500/10 text-yellow-600 rounded-lg text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{warning}</span>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 text-red-500 rounded-lg text-sm">
                    <ServerCrash className="w-4 h-4" />
                    <span>{error}</span>
                </div>
            )}

            {/* Progress */}
            {progress && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                            {progress.current_collection || "Initializing..."}
                            {isPaused && " (Paused)"}
                        </span>
                        <span className="font-medium">{progress.percentage.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary rounded-full transition-all duration-300"
                            style={{ width: `${progress.percentage}%` }}
                        />
                    </div>
                    {progress.percentage === 100 && (
                        <div className="flex items-center gap-2 text-green-500 text-sm">
                            <CheckCircle className="w-4 h-4" />
                            <span>Transfer completed successfully!</span>
                        </div>
                    )}
                </div>
            )}

            {/* Controls */}
            <div className="flex gap-3">
                {!isTransferring ? (
                    <button
                        onClick={handleStartTransfer}
                        disabled={!fromInstance || !toInstance}
                        className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <ArrowRight className="w-4 h-4" />
                        Start Transfer
                    </button>
                ) : (
                    <>
                        <button
                            onClick={handlePauseResume}
                            className="flex-1 bg-muted text-foreground px-4 py-2 rounded-lg font-medium hover:bg-muted/80 transition-colors flex items-center justify-center gap-2"
                        >
                            {isPaused ? (
                                <>
                                    <Play className="w-4 h-4" />
                                    Resume
                                </>
                            ) : (
                                <>
                                    <Pause className="w-4 h-4" />
                                    Pause
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleCancel}
                            className="bg-red-500/10 text-red-500 px-4 py-2 rounded-lg font-medium hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
                        >
                            <X className="w-4 h-4" />
                            Cancel
                        </button>
                    </>
                )}
            </div>
        </motion.div>
    );
}
