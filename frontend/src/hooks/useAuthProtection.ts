import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/utils/api";
import type { MeResponse } from "@/types";

export function useAuthProtection() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    if (!user) {
      api.get<MeResponse>("/auth/me")
        .then((res) => setUser(res.data.user))
        .catch(() => router.push("/login?error=unauthorized"));
    }
  }, [user, router, setUser]);

  return { user, isAuthenticated: !!user };
}
