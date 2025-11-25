"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const exportSchema = z.object({
    description: z.string().optional(),
    include_indexes: z.boolean(),
    compression: z.enum(["gzip", "none"]),
    collections: z.array(z.string()).optional(),
});

type ExportFormValues = z.infer<typeof exportSchema>;

export function ExportCard() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [downloadUrl, setDownloadUrl] = useState("");

    const form = useForm<ExportFormValues>({
        resolver: zodResolver(exportSchema),
        defaultValues: {
            description: "",
            include_indexes: true,
            compression: "gzip",
        },
    });

    const onSubmit = async (data: ExportFormValues) => {
        setIsLoading(true);
        setError("");
        setSuccess("");
        setDownloadUrl("");

        try {
            const res = await apiClient.post("/migration/export", data);
            if (res.data) {
                setSuccess("Export created successfully!");
                setDownloadUrl(res.data.download_url);
            }
        } catch (err: any) {
            setError(err.response?.data?.detail || "Failed to create export");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl p-6 h-full"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Download className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-semibold text-lg">Export Data</h3>
                    <p className="text-sm text-muted-foreground">Create a backup of your data.</p>
                </div>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Description (Optional)</label>
                    <input
                        {...form.register("description")}
                        placeholder="e.g. Monthly Backup"
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="include_indexes"
                        {...form.register("include_indexes")}
                        className="rounded border-border bg-background text-primary focus:ring-primary/20"
                    />
                    <label htmlFor="include_indexes" className="text-sm">Include Indexes</label>
                </div>

                {error && (
                    <div className="p-3 bg-red-500/10 text-red-500 rounded-lg text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                {success && (
                    <div className="p-3 bg-green-500/10 text-green-500 rounded-lg text-sm flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        {success}
                    </div>
                )}

                <div className="pt-2">
                    {downloadUrl ? (
                        <a
                            href={downloadUrl}
                            className="block w-full text-center bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                        >
                            Download Package
                        </a>
                    ) : (
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                            Start Export
                        </button>
                    )}
                </div>
            </form>
        </motion.div>
    );
}
