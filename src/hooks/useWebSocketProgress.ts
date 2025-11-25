"use client";

import { useEffect, useRef, useState } from "react";

interface MigrationProgress {
    status: string;
    current_collection?: string;
    percentage: number;
    message?: string;
}

interface UseWebSocketProgressProps {
    transferId: string | null;
    enabled: boolean;
}

export function useWebSocketProgress({ transferId, enabled }: UseWebSocketProgressProps) {
    const [progress, setProgress] = useState<MigrationProgress | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!transferId || !enabled) {
            return;
        }

        // Connect to WebSocket
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const wsUrl = `${protocol}//${window.location.host}/api/migration/ws/${transferId}/progress`;

        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log("WebSocket connected");
            setIsConnected(true);
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setProgress(data);
            } catch (err) {
                console.error("Failed to parse WebSocket message:", err);
            }
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
            setIsConnected(false);
        };

        ws.onclose = () => {
            console.log("WebSocket disconnected");
            setIsConnected(false);
        };

        // Heartbeat to keep connection alive
        const heartbeat = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send("ping");
            }
        }, 30000); // Every 30 seconds

        return () => {
            clearInterval(heartbeat);
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, [transferId, enabled]);

    return { progress, isConnected };
}
