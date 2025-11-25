"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { History, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { formatDistanceToNow } from "date-fns";

interface MigrationItem {
    migration_id: string;
    migration_type: "export" | "import";
    status: "completed" | "failed" | "in_progress";
    created_at: string;
    created_by: string;
    metadata?: any;
}

export function MigrationHistory() {
    const [history, setHistory] = useState<MigrationItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await apiClient.get("/migration/history");
                if (res.data && res.data.migrations) {
                    setHistory(res.data.migrations);
                }
            } catch (error) {
                console.error("Failed to fetch migration history", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "completed":
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case "failed":
                return <XCircle className="w-4 h-4 text-red-500" />;
            case "in_progress":
                return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
            default:
                return <Clock className="w-4 h-4 text-muted-foreground" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "completed":
                return <span className="text-green-500 bg-green-500/10 px-2 py-1 rounded-full text-xs font-medium">Completed</span>;
            case "failed":
                return <span className="text-red-500 bg-red-500/10 px-2 py-1 rounded-full text-xs font-medium">Failed</span>;
            case "in_progress":
                return <span className="text-blue-500 bg-blue-500/10 px-2 py-1 rounded-full text-xs font-medium">In Progress</span>;
            default:
                return <span className="text-muted-foreground bg-muted px-2 py-1 rounded-full text-xs font-medium">{status}</span>;
        }
    };

    if (isLoading) {
        return (
            <div className="bg-card border border-border rounded-xl p-6 flex items-center justify-center min-h-[200px]">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-xl p-6"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                    <History className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-semibold text-lg">Migration History</h3>
                    <p className="text-sm text-muted-foreground">Recent export and import operations.</p>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center py-8 text-muted-foreground text-sm">
                                    No migration history found.
                                </td>
                            </tr>
                        ) : (
                            history.map((item) => (
                                <tr key={item.migration_id} className="border-b border-border/50 last:border-0 hover:bg-muted/50 transition-colors">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${item.migration_type === 'export' ? 'bg-blue-500' : 'bg-purple-500'}`} />
                                            <span className="capitalize text-sm font-medium">{item.migration_type}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            {getStatusText(item.status)}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-muted-foreground">
                                        {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                                    </td>
                                    <td className="py-3 px-4 text-sm font-mono text-muted-foreground">
                                        {item.migration_id.substring(0, 8)}...
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}
