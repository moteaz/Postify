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

        // Force check vanilla window.location to bypass any Next.js hydration lag
        let token = searchParams.get('token');
        if (!token && typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            token = urlParams.get('token');
        }

        if (token) {
            localStorage.setItem('auth_token', token);
        } else {
            // Check if it's already in localStorage (e.g., page refresh)
            token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        }

        if (token) {
            attempted.current = true;
            apiClient.get<{ data: { user: User } }>("/auth/me")
                .then((res) => {
                    setUser(res.data.data.user);
                    router.push("/dashboard");
                })
                .catch(() => {
                    localStorage.removeItem('auth_token');
                    router.push("/auth?mode=login&error=auth_failed");
                });
        } else {
            // If genuinely no token, bump back to login after a brief hydration wait
            const timeout = setTimeout(() => {
                if (!localStorage.getItem('auth_token')) {
                    router.push("/auth?mode=login&error=missing_token");
                }
            }, 1000);
            return () => clearTimeout(timeout);
        }
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
