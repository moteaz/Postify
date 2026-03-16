"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/api";
import { useAuthStore } from "@/store/useAuthStore";

export function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        setUser(user);
        router.replace('/dashboard');
      } catch {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router, setUser]);

  if (isChecking) {
    return null;
  }

  return <>{children}</>;
}
