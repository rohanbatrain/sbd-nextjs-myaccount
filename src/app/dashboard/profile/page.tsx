"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/api-client";
import { Loader2, Save, Camera } from "lucide-react";
import { motion } from "framer-motion";


const profileSchema = z.object({
    user_first_name: z.string().min(1, "First name is required").max(50),
    user_last_name: z.string().min(1, "Last name is required").max(50),
    user_bio: z.string().max(200).optional(),
    user_dob: z.string().optional(),
    user_gender: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            user_first_name: "",
            user_last_name: "",
            user_bio: "",
            user_dob: "",
            user_gender: "",
        },
    });

    useEffect(() => {
        if (user) {
            form.reset({
                user_first_name: user.first_name || "",
                user_last_name: user.last_name || "",
                user_bio: "", // We need to fetch full profile to get bio, dob, gender
                user_dob: "",
                user_gender: "",
            });

            // Fetch full profile details
            apiClient.get("/profile/info").then((res) => {
                if (res.data.status === "success") {
                    const p = res.data.profile;
                    form.reset({
                        user_first_name: p.user_first_name || "",
                        user_last_name: p.user_last_name || "",
                        user_bio: p.user_bio || "",
                        user_dob: p.user_dob || "",
                        user_gender: p.user_gender || "",
                    });
                }
            });
        }
    }, [user, form]);

    const onSubmit = async (data: ProfileFormValues) => {
        setIsLoading(true);
        setSuccessMessage("");
        try {
            await apiClient.post("/profile/update", data);
            setSuccessMessage("Profile updated successfully");
            // Optionally refresh user context
            // login(token, refresh) - strictly we don't have tokens here to call login, 
            // but we can trigger a re-fetch in context if we exposed a method.
            // For now, simple success message is enough.
        } catch (error) {
            console.error("Failed to update profile", error);
        } finally {
            setIsLoading(false);
            setTimeout(() => setSuccessMessage(""), 3000);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Personal Info</h1>
                <p className="text-muted-foreground mt-2">
                    Update your photo and personal details here.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Avatar Section */}
                <div className="lg:col-span-1">
                    <div className="bg-card border border-border rounded-xl p-6 flex flex-col items-center text-center space-y-4">
                        <div className="relative group cursor-pointer">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
                                {user?.avatar_url ? (
                                    <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    (user?.first_name?.[0] || user?.username?.[0] || "?").toUpperCase()
                                )}
                            </div>
                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <div>
                            <h3 className="font-medium">Profile Picture</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                                Click to upload a new photo.
                                <br />
                                JPG, GIF or PNG. Max 1MB.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <div className="lg:col-span-2">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card border border-border rounded-xl p-6"
                    >
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">First Name</label>
                                    <input
                                        {...form.register("user_first_name")}
                                        className="w-full bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                    {form.formState.errors.user_first_name && (
                                        <p className="text-xs text-red-500">{form.formState.errors.user_first_name.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Last Name</label>
                                    <input
                                        {...form.register("user_last_name")}
                                        className="w-full bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                    {form.formState.errors.user_last_name && (
                                        <p className="text-xs text-red-500">{form.formState.errors.user_last_name.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Bio</label>
                                <textarea
                                    {...form.register("user_bio")}
                                    rows={4}
                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                                    placeholder="Tell us a little about yourself..."
                                />
                                <p className="text-xs text-muted-foreground text-right">
                                    {form.watch("user_bio")?.length || 0}/200
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Date of Birth</label>
                                    <input
                                        type="date"
                                        {...form.register("user_dob")}
                                        className="w-full bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Gender</label>
                                    <select
                                        {...form.register("user_gender")}
                                        className="w-full bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    >
                                        <option value="">Select gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                        <option value="prefer_not_to_say">Prefer not to say</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 flex items-center justify-between">
                                <div>
                                    {successMessage && (
                                        <span className="text-green-500 text-sm font-medium animate-pulse">
                                            {successMessage}
                                        </span>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </motion.div>

                    <div className="mt-8 bg-card border border-border rounded-xl p-6">
                        <h3 className="font-medium mb-4">Contact Info</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-2 border-b border-border/50">
                                <div>
                                    <p className="text-sm font-medium">Email</p>
                                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                                </div>
                                <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded-full">Verified</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-border/50">
                                <div>
                                    <p className="text-sm font-medium">Username</p>
                                    <p className="text-sm text-muted-foreground">@{user?.username}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
