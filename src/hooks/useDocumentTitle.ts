import { useEffect } from "react";

interface UseDocumentTitleOptions {
    restoreOnUnmount?: boolean;
}

export function useDocumentTitle(
    title: string,
    options: UseDocumentTitleOptions = {}
) {
    const { restoreOnUnmount = false } = options;

    useEffect(() => {
        const previousTitle = document.title;
        document.title = title;

        return () => {
            if (restoreOnUnmount) {
                document.title = previousTitle;
            }
        };
    }, [title, restoreOnUnmount]);
}
