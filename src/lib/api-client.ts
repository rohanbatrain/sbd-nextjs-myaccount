import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to add token and tenant ID
apiClient.interceptors.request.use(
    (config) => {
        const token = Cookies.get("access_token");
        const tenantId = Cookies.get("current_tenant_id");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (tenantId) {
            config.headers["X-Tenant-ID"] = tenantId;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for token refresh
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = Cookies.get("refresh_token");
                if (!refreshToken) {
                    throw new Error("No refresh token");
                }

                // Call refresh endpoint
                const response = await axios.post(`${API_URL}/auth/refresh-token`, {
                    refresh_token: refreshToken,
                });

                const { access_token } = response.data;
                Cookies.set("access_token", access_token);

                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${access_token}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Logout if refresh fails
                Cookies.remove("access_token");
                Cookies.remove("refresh_token");
                Cookies.remove("current_tenant_id");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
