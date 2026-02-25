"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/utils/api";
import type { MeResponse } from "@/types";

export default function AuthCallback() {
    const router = useRouter();
    const { setUser } = useAuthStore();

    useEffect(() => {
        api.get<MeResponse>("/auth/me")
            .then((res) => {
                setUser(res.data.user);
                router.push("/dashboard");
            })
            .catch(() => {
                router.push("/login?error=auth_failed");
            });
    }, [router, setUser]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-neutral-50">
            <div className="flex flex-col items-center space-y-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="text-lg font-medium text-neutral-600 animate-pulse">
                    Authenticating...
                </p>
            </div>
        </div>
    );
}
