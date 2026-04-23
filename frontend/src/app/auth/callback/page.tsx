"use client";

import { useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { apiClient } from "@/lib/apiClient";
import type { User } from "@/types";
import { Loader2 } from "lucide-react";

function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setUser } = useAuthStore();
    const attempted = useRef(false);

    useEffect(() => {
        if (attempted.current) return;
        attempted.current = true;

        // Get token from URL (backend should send it for Safari/iOS compatibility)
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
                localStorage.removeItem('auth_token');
                router.push("/auth?mode=login&error=auth_failed");
            });
    }, [router, setUser, searchParams]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30">
            <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-lg font-medium text-muted-foreground animate-pulse">
                    Loading...
                </p>
            </div>
        </div>
    );
}

export default function AuthCallback() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-muted/30">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        }>
            <AuthCallbackContent />
        </Suspense>
    );
}
