/**
 * Extract error message from unknown error type
 */
export function getErrorMessage(error: unknown, fallback: string = "An error occurred"): string {
    if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "detail" in error.response.data
    ) {
        return String(error.response.data.detail);
    }

    if (error instanceof Error) {
        return error.message;
    }

    return fallback;
}
