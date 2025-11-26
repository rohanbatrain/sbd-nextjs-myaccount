"use client";

import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/error-utils";
import { Image as ImageIcon, Palette, Check, Loader2 } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

interface Asset {
    id: string;
    name: string;
    preview_url?: string;
    is_owned: boolean;
    is_rented: boolean;
    rental_expires_at?: string;
}

interface CurrentAssets {
    avatar?: Asset;
    banner?: Asset;
    theme?: Asset;
}

export default function PersonalizationPage() {
    const [activeTab, setActiveTab] = useState<"avatars" | "banners" | "themes">("avatars");
    const [avatars, setAvatars] = useState<Asset[]>([]);
    const [banners, setBanners] = useState<Asset[]>([]);
    const [themes, setThemes] = useState<Asset[]>([]);
    const [current, setCurrent] = useState<CurrentAssets>({});
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const fetchAssets = useCallback(async () => {
        setIsLoading(true);
        setMessage(null);
        try {
            if (activeTab === "avatars") {
                const [owned, rented, currentRes] = await Promise.all([
                    apiClient.get("/avatars/owned"),
                    apiClient.get("/avatars/rented"),
                    apiClient.get("/avatars/current"),
                ]);
                setAvatars([...(owned.data.avatars || []), ...(rented.data.avatars || [])]);
                setCurrent((prev) => ({ ...prev, avatar: currentRes.data.avatar }));
            } else if (activeTab === "banners") {
                const [owned, rented, currentRes] = await Promise.all([
                    apiClient.get("/banners/owned"),
                    apiClient.get("/banners/rented"),
                    apiClient.get("/banners/current"),
                ]);
                setBanners([...(owned.data.banners || []), ...(rented.data.banners || [])]);
                setCurrent((prev) => ({ ...prev, banner: currentRes.data.banner }));
            } else {
                const [owned, rented] = await Promise.all([
                    apiClient.get("/themes/owned"),
                    apiClient.get("/themes/rented"),
                ]);
                setThemes([...(owned.data.themes || []), ...(rented.data.themes || [])]);
            }
        } catch (error: unknown) {
            setMessage({ type: "error", text: getErrorMessage(error, "Failed to fetch assets") });
        } finally {
            setIsLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        fetchAssets().catch(console.error);
    }, [fetchAssets]);

    const setCurrentAsset = async (assetId: string, type: "avatar" | "banner") => {
        try {
            await apiClient.post(`/${type}s/set-current`, { [`${type}_id`]: assetId });
            setMessage({ type: "success", text: `${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully` });
            await fetchAssets();
        } catch (error: unknown) {
            setMessage({ type: "error", text: getErrorMessage(error, `Failed to update ${type}`) });
        }
    };

    const renderAssets = () => {
        const assets = activeTab === "avatars" ? avatars : activeTab === "banners" ? banners : themes;
        const currentId = activeTab === "avatars" ? current.avatar?.id : activeTab === "banners" ? current.banner?.id : null;

        if (isLoading) {
            return (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
            );
        }

        if (assets.length === 0) {
            return (
                <div className="text-center py-12">
                    <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">No {activeTab} available</p>
                    <p className="text-sm text-muted-foreground mt-1">Visit the shop to get some!</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {assets.map((asset) => (
                    <motion.div
                        key={asset.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`relative border rounded-lg overflow-hidden cursor-pointer transition-all ${currentId === asset.id
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-border hover:border-primary/50"
                            }`}
                        onClick={() => {
                            if (activeTab !== "themes") {
                                setCurrentAsset(asset.id, activeTab === "avatars" ? "avatar" : "banner").catch(console.error);
                            }
                        }}
                    >
                        {/* Preview */}
                        <div className={`bg-muted ${activeTab === "avatars" ? "aspect-square" : "aspect-video"}`}>
                            {asset.preview_url ? (
                                <Image
                                    src={asset.preview_url}
                                    alt={`${asset.name} preview`}
                                    width={200}
                                    height={200}
                                    className="w-full h-full object-cover"
                                    unoptimized
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <ImageIcon className="w-8 h-8 text-muted-foreground" aria-hidden="true" />
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="p-3">
                            <p className="font-medium text-sm truncate">{asset.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                                {asset.is_owned && (
                                    <span className="text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full">Owned</span>
                                )}
                                {asset.is_rented && (
                                    <span className="text-xs bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full">Rented</span>
                                )}
                            </div>
                        </div>

                        {/* Current Badge */}
                        {currentId === asset.id && (
                            <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                                <Check className="w-4 h-4" />
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        );
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Personalization</h1>
                <p className="text-muted-foreground mt-2">
                    Customize your profile with avatars, banners, and themes.
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

            {/* Tabs */}
            <div className="flex gap-2 border-b border-border">
                <button
                    onClick={() => setActiveTab("avatars")}
                    className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${activeTab === "avatars"
                        ? "text-primary border-b-2 border-primary"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                >
                    <ImageIcon className="w-4 h-4" />
                    Avatars
                </button>
                <button
                    onClick={() => setActiveTab("banners")}
                    className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${activeTab === "banners"
                        ? "text-primary border-b-2 border-primary"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                >
                    <ImageIcon className="w-4 h-4" />
                    Banners
                </button>
                <button
                    onClick={() => setActiveTab("themes")}
                    className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${activeTab === "themes"
                        ? "text-primary border-b-2 border-primary"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                >
                    <Palette className="w-4 h-4" />
                    Themes
                </button>
            </div>

            {/* Assets Grid */}
            {renderAssets()}
        </div>
    );
}
