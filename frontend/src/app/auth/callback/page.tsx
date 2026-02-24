"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/utils/api";

export default function AuthCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setAuth } = useAuthStore();

    useEffect(() => {
        const token = searchParams.get("token");

        if (token) {
            api.get("/auth/me", {
                headers: { Authorization: `Bearer ${token}` } // Pass manually for the first call
            })
                .then((res) => {
                    setAuth(res.data.user, token);
                    router.push("/dashboard");
                })
                .catch(() => {
                    router.push("/login?error=auth_failed");
                });
        } else {
            router.push("/login?error=no_token");
        }
    }, [router, searchParams, setAuth]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="flex flex-col items-center space-y-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="text-lg font-medium text-muted-foreground animate-pulse">
                    Authenticating you with Google...
                </p>
            </div>
        </div>
    );
}
