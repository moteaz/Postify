import { useMemo } from "react";
import type { AdminUser } from "@/types";

export const useAdminStats = (users: AdminUser[]) => {
  return useMemo(() => {
    const totalUsers = users.length;
    const totalCVs = users.reduce((sum, u) => sum + u._count.cvs, 0);
    const totalApps = users.reduce((sum, u) => sum + u._count.applications, 0);
    const adminCount = users.filter(u => u.role === "ADMIN").length;
    
    return {
      totalUsers,
      totalCVs,
      totalApps,
      adminCount,
      avgCVsPerUser: totalUsers > 0 ? (totalCVs / totalUsers).toFixed(1) : "0",
      avgAppsPerUser: totalUsers > 0 ? (totalApps / totalUsers).toFixed(1) : "0"
    };
  }, [users]);
};
