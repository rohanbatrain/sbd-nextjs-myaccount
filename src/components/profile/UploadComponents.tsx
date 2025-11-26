"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/error-utils";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import NextImage from "next/image";
import { motion } from "framer-motion";

export function ProfilePhotoUpload() {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setMessage({ type: "error", text: "Please select an image file" });
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setMessage({ type: "error", text: "Image must be less than 5MB" });
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload
        await uploadPhoto(file);
    };

    const uploadPhoto = async (file: File) => {
        setUploading(true);
        setMessage(null);

        try {
            const formData = new FormData();
            formData.append("photo", file);

            await apiClient.post("/profile/upload-photo", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setMessage({ type: "success", text: "Profile photo updated successfully" });
        } catch (error: unknown) {
            setMessage({ type: "error", text: getErrorMessage(error, "Failed to upload photo") });
            setPreview(null);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="relative">
                    {preview ? (
                        <NextImage
                            src={preview}
                            alt="Profile preview"
                            width={96}
                            height={96}
                            className="w-24 h-24 rounded-full object-cover border-2 border-border"
                            unoptimized
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-2 border-border">
                            <ImageIcon className="w-8 h-8 text-muted-foreground" />
                        </div>
                    )}
                    {uploading && (
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                        <Upload className="w-4 h-4" />
                        Upload Photo
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                            disabled={uploading}
                        />
                    </label>
                    <p className="text-sm text-muted-foreground mt-2">
                        JPG, PNG or GIF. Max size 5MB.
                    </p>
                </div>
            </div>

            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 rounded-lg text-sm ${message.type === "success" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                        }`}
                >
                    {message.text}
                </motion.div>
            )}
        </div>
    );
}

export function BannerUpload() {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setMessage({ type: "error", text: "Please select an image file" });
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setMessage({ type: "error", text: "Image must be less than 10MB" });
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        await uploadBanner(file);
    };

    const uploadBanner = async (file: File) => {
        setUploading(true);
        setMessage(null);

        try {
            const formData = new FormData();
            formData.append("banner", file);

            await apiClient.post("/profile/upload-banner", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setMessage({ type: "success", text: "Banner updated successfully" });
        } catch (error: unknown) {
            setMessage({ type: "error", text: getErrorMessage(error, "Failed to upload banner") });
            setPreview(null);
        } finally {
            setUploading(false);
        }
    };

    const removeBanner = () => {
        setPreview(null);
        setMessage(null);
    };

    return (
        <div className="space-y-4">
            <div className="relative">
                {preview ? (
                    <div className="relative">
                        <NextImage
                            src={preview}
                            alt="Banner preview"
                            width={800}
                            height={192}
                            className="w-full h-48 object-cover rounded-lg border-2 border-border"
                            unoptimized
                        />
                        <button
                            onClick={removeBanner}
                            className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                        >
                            <X className="w-4 h-4 text-white" />
                        </button>
                        {uploading && (
                            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="w-full h-48 bg-muted rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                        <div className="text-center">
                            <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">No banner uploaded</p>
                        </div>
                    </div>
                )}
            </div>

            <div>
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                    <Upload className="w-4 h-4" />
                    Upload Banner
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={uploading}
                    />
                </label>
                <p className="text-sm text-muted-foreground mt-2">
                    JPG, PNG or GIF. Max size 10MB. Recommended: 1500x500px
                </p>
            </div>

            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 rounded-lg text-sm ${message.type === "success" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                        }`}
                >
                    {message.text}
                </motion.div>
            )}
        </div>
    );
}
