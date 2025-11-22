import { useCallback, useEffect } from "react";

type KeyboardHandler = (event: KeyboardEvent) => void;

interface HotkeyOptions {
    preventDefault?: boolean;
    enableOnFormTags?: boolean;
}

export function useHotkeys(
    key: string,
    callback: () => void,
    options: HotkeyOptions = {}
) {
    const { preventDefault = true, enableOnFormTags = false } = options;

    const handleKeyPress: KeyboardHandler = useCallback(
        (event: KeyboardEvent) => {
            const target = event.target as HTMLElement;
            const isFormTag = ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);

            if (!enableOnFormTags && isFormTag) {
                return;
            }

            const keys = key.toLowerCase().split("+");
            const pressedKey = event.key.toLowerCase();

            const modifiers = {
                ctrl: event.ctrlKey || event.metaKey,
                alt: event.altKey,
                shift: event.shiftKey,
            };

            const hasCtrl = keys.includes("ctrl") || keys.includes("cmd") || keys.includes("meta");
            const hasAlt = keys.includes("alt");
            const hasShift = keys.includes("shift");
            const mainKey = keys[keys.length - 1];

            if (
                pressedKey === mainKey &&
                (!hasCtrl || modifiers.ctrl) &&
                (!hasAlt || modifiers.alt) &&
                (!hasShift || modifiers.shift)
            ) {
                if (preventDefault) {
                    event.preventDefault();
                }
                callback();
            }
        },
        [key, callback, preventDefault, enableOnFormTags]
    );

    useEffect(() => {
        document.addEventListener("keydown", handleKeyPress);
        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, [handleKeyPress]);
}
