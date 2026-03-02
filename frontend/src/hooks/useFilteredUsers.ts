import { useMemo } from "react";
import type { AdminUser } from "@/types";

export const useFilteredUsers = (users: AdminUser[], searchQuery: string) => {
  return useMemo(() => {
    if (!searchQuery) return users;
    const query = searchQuery.toLowerCase();
    return users.filter(user => 
      user.email.toLowerCase().includes(query) ||
      user.name.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);
};
