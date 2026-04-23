import { create } from "zustand";
import type { User } from "@/types";

interface AuthState {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    (set) => ({
        user: null,
        setUser: (user) => set({ user }),
        logout: () => {
            set({ user: null });
            if (typeof window !== 'undefined') {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('postify-auth-storage');
                localStorage.removeItem('postify-user');
            }
        },
    })
);
