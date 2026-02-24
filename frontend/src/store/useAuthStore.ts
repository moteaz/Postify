import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
    id: string;
    email: string;
    name: string;
    avatarUrl?: string;
}

interface AuthState {
    token: string | null;
    user: User | null;
    setAuth: (token: string, user: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            setAuth: (token, user) => set({ token, user }),
            logout: () => {
                localStorage.removeItem("postify_token");
                set({ token: null, user: null });
            },
        }),
        {
            name: "postify-auth",
        }
    )
);
