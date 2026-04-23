import { useAuthStore } from "@/store/useAuthStore";
import { canAccessAdmin, canDeleteUser } from "@/lib/permissions";
import type { UserRole } from "@/types";

export const usePermissions = () => {
  const { user } = useAuthStore();
  
  return {
    canAccessAdmin: canAccessAdmin(user?.role),
    canDeleteUser: (targetRole?: UserRole) => canDeleteUser(user?.role, targetRole),
  };
};
