import { useState, useEffect, useCallback } from "react";

interface UseDebounceOptions {
    delay?: number;
}

export function useDebounce<T>(value: T, options: UseDebounceOptions = {}): T {
    const { delay = 500 } = options;
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export function useDebouncedCallback<T extends (...args: any[]) => any>(
    callback: T,
    delay: number = 500
): (...args: Parameters<T>) => void {
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

    return useCallback(
        (...args: Parameters<T>) => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            const newTimeoutId = setTimeout(() => {
                callback(...args);
            }, delay);

            setTimeoutId(newTimeoutId);
        },
        [callback, delay, timeoutId]
    );
}
