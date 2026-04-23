import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/api';
import { adminKeys } from './use-admin-query';
import { handleApiError } from '@/shared/utils/error-handler';

export function useDeleteUser(
  onSuccess: (message: string) => void,
  onError: (message: string) => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminService.deleteUser(id),
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      onSuccess('User deleted successfully!');
    },
    
    onError: (error) => {
      onError(handleApiError(error));
    },
  });
}

export function useExportUsers(
  onSuccess: (message: string) => void,
  onError: (message: string) => void
) {
  return useMutation({
    mutationFn: () => adminService.exportUsers(),
    
    onSuccess: () => {
      onSuccess('Users exported successfully!');
    },
    
    onError: (error) => {
      onError(handleApiError(error));
    },
  });
}
