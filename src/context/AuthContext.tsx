"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { apiClient } from "@/lib/api-client";
import { useRouter, usePathname } from "next/navigation";

interface User {
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (token: string, refreshToken: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const initAuth = async () => {
            const token = Cookies.get("access_token");
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await apiClient.get("/profile/info");
                if (response.data.status === "success") {
                    // Map profile fields to User interface
                    const profile = response.data.profile;
                    setUser({
                        username: profile.user_username,
                        email: profile.user_email,
                        first_name: profile.user_first_name,
                        last_name: profile.user_last_name,
                    });
                }
            } catch (error) {
                console.error("Failed to fetch user profile", error);
                // If profile fetch fails but we have token, we might want to clear it or let interceptor handle it
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = (token: string, refreshToken: string) => {
        Cookies.set("access_token", token);
        Cookies.set("refresh_token", refreshToken);
        // Fetch user info immediately after login
        apiClient.get("/profile/info").then((response) => {
            if (response.data.status === "success") {
                const profile = response.data.profile;
                setUser({
                    username: profile.user_username,
                    email: profile.user_email,
                    first_name: profile.user_first_name,
                    last_name: profile.user_last_name,
                });
                router.push("/dashboard");
            }
        });
    };

    const logout = () => {
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        Cookies.remove("current_tenant_id");
        setUser(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
