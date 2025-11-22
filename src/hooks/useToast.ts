import { useState, useCallback } from "react";

interface ToastMessage {
    id: string;
    type: "success" | "error" | "warning" | "info";
    message: string;
}

export function useToast() {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const showToast = useCallback((type: ToastMessage["type"], message: string) => {
        const id = Math.random().toString(36).substring(7);
        const newToast: ToastMessage = { id, type, message };

        setToasts((prev) => [...prev, newToast]);

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 5000);

        return id;
    }, []);

    const dismissToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const success = useCallback((message: string) => showToast("success", message), [showToast]);
    const error = useCallback((message: string) => showToast("error", message), [showToast]);
    const warning = useCallback((message: string) => showToast("warning", message), [showToast]);
    const info = useCallback((message: string) => showToast("info", message), [showToast]);

    return {
        toasts,
        showToast,
        dismissToast,
        success,
        error,
        warning,
        info,
    };
}
