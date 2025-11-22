"use client";

import { useState } from "react";
import { User, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function UserNav() {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    if (!user) {
        return (
            <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
                Sign In
            </Link>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 hover:bg-muted rounded-full pl-2 pr-1 py-1 transition-colors border border-transparent hover:border-border"
            >
                <span className="text-sm font-medium hidden md:block">
                    {user.first_name || user.username}
                </span>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white">
                    {user.avatar_url ? (
                        <img
                            src={user.avatar_url}
                            alt={user.username}
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        <span className="text-xs font-bold">
                            {(user.first_name?.[0] || user.username[0]).toUpperCase()}
                        </span>
                    )}
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.1 }}
                            className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden"
                        >
                            <div className="p-4 border-b border-border">
                                <p className="font-medium truncate">
                                    {user.first_name} {user.last_name}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                    {user.email}
                                </p>
                            </div>
                            <div className="p-1">
                                <Link
                                    href="/dashboard/profile"
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <User className="w-4 h-4" />
                                    Profile
                                </Link>
                                <Link
                                    href="/dashboard/settings"
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Settings className="w-4 h-4" />
                                    Settings
                                </Link>
                            </div>
                            <div className="p-1 border-t border-border">
                                <button
                                    onClick={() => {
                                        logout();
                                        setIsOpen(false);
                                    }}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign out
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
