"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { apiClient } from "@/lib/apiClient";
import type { User } from "@/types";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setUser } = useAuthStore();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            localStorage.setItem('auth_token', token);
        }

        apiClient.get<{ data: { user: User } }>("/auth/me")
            .then((res) => {
                setUser(res.data.data.user);
                router.push("/dashboard");
            })
            .catch(() => {
                router.push("/auth?mode=login&error=auth_failed");
            });
    }, [router, setUser, searchParams]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30">
            <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-lg font-medium text-muted-foreground animate-pulse">
                    Authenticating...
                </p>
            </div>
        </div>
    );
}
