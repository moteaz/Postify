import { useState, useCallback } from "react";
import { adminService } from "@/services/api";
import { handleApiError } from "@/utils/errorHandler";
import type { AdminUser, AdminUserDetails, PaginationMeta } from "@/types";

interface UseAdminReturn {
  users: AdminUser[];
  isLoading: boolean;
  selectedUser: AdminUserDetails | null;
  fetchUsers: (page?: number) => Promise<void>;
  viewUser: (id: string, page?: number) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  exportUsers: () => Promise<void>;
  closeDetails: () => void;
  pagination: PaginationMeta | null;
}

export function useAdmin(
  onSuccess: (message: string) => void,
  onError: (message: string) => void
): UseAdminReturn {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUserDetails | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);

  const fetchUsers = useCallback(async (page = 1): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await adminService.getAllUsers(page);
      setUsers(response.data);
      setPagination(response.pagination);
    } catch (error) {
      onError(handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  }, [onError]);

  const viewUser = useCallback(async (id: string, page = 1): Promise<void> => {
    try {
      const data = await adminService.getUserDetails(id, page);
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

  const exportUsers = useCallback(async (): Promise<void> => {
    try {
      await adminService.exportUsers();
      onSuccess("Users exported successfully");
    } catch (error) {
      onError(handleApiError(error));
    }
  }, [onSuccess, onError]);

  return {
    users,
    isLoading,
    selectedUser,
    fetchUsers,
    viewUser,
    deleteUser,
    exportUsers,
    closeDetails,
    pagination
  };
}
