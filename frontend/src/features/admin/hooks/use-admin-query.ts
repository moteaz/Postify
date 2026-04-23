import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/services/api';
import type { PaginatedResponse, AdminUser, AdminUserDetails } from '@/types';

export const adminKeys = {
  all: ['admin'] as const,
  users: () => [...adminKeys.all, 'users'] as const,
  usersList: (page: number) => [...adminKeys.users(), page] as const,
  userDetails: (id: string, page: number) => [...adminKeys.all, 'user', id, page] as const,
};

export function useAdminUsersQuery(page: number, enabled: boolean) {
  return useQuery({
    queryKey: adminKeys.usersList(page),
    queryFn: () => adminService.getAllUsers(page),
    enabled,
    staleTime: 0, // Always fetch fresh data
    gcTime: 0, // Don't cache
    refetchOnMount: 'always', // Always refetch when component mounts
  });
}

export function useAdminUserDetailsQuery(userId: string | null, page: number) {
  return useQuery({
    queryKey: adminKeys.userDetails(userId!, page),
    queryFn: () => adminService.getUserDetails(userId!, page),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
