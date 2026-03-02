import { useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/api";
import type { User } from "@/types";

interface UseAuthReturn {
  user: User | null;
  handleLogout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const { user, setUser, logout } = useAuthStore();
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (user || hasFetchedRef.current) return;

    hasFetchedRef.current = true;

    authService.getCurrentUser()
      .then(setUser)
      .catch(() => {
        logout();
        router.replace("/");
      });
  }, [user, router, setUser, logout]);

  const handleLogout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      logout();
      router.replace("/");
    }
  }, [logout, router]);

  return { user, handleLogout };
}
