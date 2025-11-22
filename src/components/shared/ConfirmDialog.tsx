"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "info";
}

export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "danger",
}: ConfirmDialogProps) {
    const variantStyles = {
        danger: "bg-red-500 hover:bg-red-600",
        warning: "bg-yellow-500 hover:bg-yellow-600",
        info: "bg-blue-500 hover:bg-blue-600",
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card border border-border rounded-xl p-6 z-50 shadow-xl"
                    >
                        <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-full ${variant === "danger" ? "bg-red-500/10" : variant === "warning" ? "bg-yellow-500/10" : "bg-blue-500/10"} flex items-center justify-center shrink-0`}>
                                <AlertTriangle className={`w-6 h-6 ${variant === "danger" ? "text-red-500" : variant === "warning" ? "text-yellow-500" : "text-blue-500"}`} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                                <p className="text-sm text-muted-foreground mb-6">{description}</p>
                                <div className="flex gap-3 justify-end">
                                    <button
                                        onClick={onClose}
                                        className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
                                    >
                                        {cancelText}
                                    </button>
                                    <button
                                        onClick={() => {
                                            onConfirm();
                                            onClose();
                                        }}
                                        className={`px-4 py-2 rounded-lg text-white transition-colors ${variantStyles[variant]}`}
                                    >
                                        {confirmText}
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="Close dialog"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
