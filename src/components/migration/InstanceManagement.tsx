"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Server, Plus, Trash2, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const instanceSchema = z.object({
    instance_name: z.string().min(1, "Name is required").max(100),
    instance_url: z.string().url("Must be a valid URL"),
    api_key: z.string().min(32, "API key must be at least 32 characters"),
});

type InstanceFormValues = z.infer<typeof instanceSchema>;

interface Instance {
    instance_id: string;
    instance_name: string;
    instance_url: string;
    size_gb: number;
    collection_count: number;
    collections: string[];
    status: "online" | "offline";
    last_synced: string;
}

export function InstanceManagement() {
    const [instances, setInstances] = useState<Instance[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const form = useForm<InstanceFormValues>({
        resolver: zodResolver(instanceSchema),
        defaultValues: {
            instance_name: "",
            instance_url: "",
            api_key: "",
        },
    });

    const fetchInstances = async () => {
        setIsLoading(true);
        try {
            const res = await apiClient.get("/migration/instances");
            setInstances(res.data);
        } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            setError(err.response?.data?.detail || "Failed to fetch instances");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddInstance = async (data: InstanceFormValues) => {
        setIsLoading(true);
        setError("");
        try {
            await apiClient.post("/migration/instances", data);
            setShowAddModal(false);
            form.reset();
            await fetchInstances();
        } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            setError(err.response?.data?.detail || "Failed to add instance");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteInstance = async (instanceId: string) => {
        if (!confirm("Are you sure you want to delete this instance?")) return;

        try {
            await apiClient.delete(`/migration/instances/${instanceId}`);
            await fetchInstances();
        } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            setError(err.response?.data?.detail || "Failed to delete instance");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">My Instances</h3>
                <button
                    onClick={() => {
                        setShowAddModal(true);
                        fetchInstances();
                    }}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Instance
                </button>
            </div>

            {error && (
                <div className="p-3 bg-red-500/10 text-red-500 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {instances.map((instance) => (
                    <motion.div
                        key={instance.instance_id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="border border-border rounded-xl p-4 bg-card hover:shadow-sm transition-shadow"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                    <Server className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-semibold">{instance.instance_name}</h4>
                                    <p className="text-xs text-muted-foreground">{instance.instance_url}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {instance.status === "online" ? (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                    <XCircle className="w-4 h-4 text-red-500" />
                                )}
                                <button
                                    onClick={() => handleDeleteInstance(instance.instance_id)}
                                    className="text-red-500 hover:text-red-600"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <span className="text-muted-foreground">Size:</span>{" "}
                                <span className="font-medium">{instance.size_gb.toFixed(2)} GB</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Collections:</span>{" "}
                                <span className="font-medium">{instance.collection_count}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Add Instance Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-card border border-border rounded-xl p-6 max-w-md w-full m-4"
                    >
                        <h3 className="text-xl font-bold mb-4">Add New Instance</h3>
                        <form onSubmit={form.handleSubmit(handleAddInstance)} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Instance Name</label>
                                <input
                                    {...form.register("instance_name")}
                                    placeholder="Production Server"
                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                                {form.formState.errors.instance_name && (
                                    <p className="text-xs text-red-500">{form.formState.errors.instance_name.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Instance URL</label>
                                <input
                                    {...form.register("instance_url")}
                                    placeholder="https://sbd.example.com"
                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                                {form.formState.errors.instance_url && (
                                    <p className="text-xs text-red-500">{form.formState.errors.instance_url.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">API Key</label>
                                <input
                                    {...form.register("api_key")}
                                    type="password"
                                    placeholder="API Key (32+ characters)"
                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                                {form.formState.errors.api_key && (
                                    <p className="text-xs text-red-500">{form.formState.errors.api_key.message}</p>
                                )}
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        form.reset();
                                    }}
                                    className="flex-1 bg-muted text-foreground px-4 py-2 rounded-lg hover:bg-muted/80 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Add Instance
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
