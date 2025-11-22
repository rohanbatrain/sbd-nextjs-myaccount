import { useCallback, useEffect } from "react";

interface AnalyticsEvent {
    category: string;
    action: string;
    label?: string;
    value?: number;
}

interface PageViewEvent {
    path: string;
    title: string;
}

export function useAnalytics() {
    const trackEvent = useCallback((event: AnalyticsEvent) => {
        // TODO: Replace with actual analytics service (Google Analytics, Mixpanel, etc.)
        if (process.env.NODE_ENV === "development") {
            console.log("[Analytics] Event:", event);
        }

        // Example: Google Analytics 4
        // if (typeof window !== "undefined" && window.gtag) {
        //   window.gtag("event", event.action, {
        //     event_category: event.category,
        //     event_label: event.label,
        //     value: event.value,
        //   });
        // }
    }, []);

    const trackPageView = useCallback((event: PageViewEvent) => {
        if (process.env.NODE_ENV === "development") {
            console.log("[Analytics] Page View:", event);
        }

        // Example: Google Analytics 4
        // if (typeof window !== "undefined" && window.gtag) {
        //   window.gtag("config", "GA_MEASUREMENT_ID", {
        //     page_path: event.path,
        //     page_title: event.title,
        //   });
        // }
    }, []);

    const trackClick = useCallback((element: string, location?: string) => {
        trackEvent({
            category: "User Interaction",
            action: "Click",
            label: `${element}${location ? ` - ${location}` : ""}`,
        });
    }, [trackEvent]);

    const trackFormSubmit = useCallback((formName: string, success: boolean) => {
        trackEvent({
            category: "Form",
            action: success ? "Submit Success" : "Submit Error",
            label: formName,
        });
    }, [trackEvent]);

    const trackError = useCallback((error: string, context?: string) => {
        trackEvent({
            category: "Error",
            action: error,
            label: context,
        });
    }, [trackEvent]);

    return {
        trackEvent,
        trackPageView,
        trackClick,
        trackFormSubmit,
        trackError,
    };
}

export function usePageTracking(pageName: string) {
    const { trackPageView } = useAnalytics();

    useEffect(() => {
        trackPageView({
            path: window.location.pathname,
            title: pageName,
        });
    }, [pageName, trackPageView]);
}
