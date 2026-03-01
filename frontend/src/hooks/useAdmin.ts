import { useState, useCallback } from "react";
import { adminService } from "@/services/adminApi";
import { handleApiError } from "@/utils/errorHandler";
import type { AdminUser, AdminUserDetails } from "@/types";

interface UseAdminReturn {
  users: AdminUser[];
  isLoading: boolean;
  selectedUser: AdminUserDetails | null;
  fetchUsers: () => Promise<void>;
  viewUser: (id: string) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  closeDetails: () => void;
}

export function useAdmin(
  onSuccess: (message: string) => void,
  onError: (message: string) => void
): UseAdminReturn {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUserDetails | null>(null);

  const fetchUsers = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (error) {
      onError(handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  }, [onError]);

  const viewUser = useCallback(async (id: string): Promise<void> => {
    try {
      const data = await adminService.getUserDetails(id);
      setSelectedUser(data);
    } catch (error) {
      onError(handleApiError(error));
    }
  }, [onError]);

  const deleteUser = useCallback(async (id: string): Promise<void> => {
    try {
      await adminService.deleteUser(id);
      onSuccess("User deleted successfully");
      await fetchUsers();
    } catch (error) {
      onError(handleApiError(error));
    }
  }, [fetchUsers, onSuccess, onError]);

  const closeDetails = useCallback(() => {
    setSelectedUser(null);
  }, []);

  return {
    users,
    isLoading,
    selectedUser,
    fetchUsers,
    viewUser,
    deleteUser,
    closeDetails
  };
}
