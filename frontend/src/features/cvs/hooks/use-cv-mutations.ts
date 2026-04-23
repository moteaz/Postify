import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cvService, authService } from '@/services/api';
import { cvKeys } from './use-cvs-query';
import { handleApiError } from '@/shared/utils/error-handler';
import { useAuthStore } from '@/store/useAuthStore';

export function useSetActiveCV(
  onSuccess: (message: string) => void,
  onError: (message: string) => void
) {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (id: string) => cvService.setActive(id),
    
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: cvKeys.lists() });
      const user = await authService.getCurrentUser();
      setUser(user);
      onSuccess('Active CV updated!');
    },
    
    onError: (error) => {
      onError(handleApiError(error));
    },
  });
}

export function useArchiveCV(
  onSuccess: (message: string) => void,
  onError: (message: string) => void
) {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (id: string) => cvService.setArchived(id),
    
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: cvKeys.lists() });
      const user = await authService.getCurrentUser();
      setUser(user);
      onSuccess('CV archived successfully!');
    },
    
    onError: (error) => {
      onError(handleApiError(error));
    },
  });
}

export function useDeleteCV(
  onSuccess: (message: string) => void,
  onError: (message: string) => void
) {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (id: string) => cvService.delete(id),
    
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: cvKeys.lists() });
      const user = await authService.getCurrentUser();
      setUser(user);
      onSuccess('CV deleted successfully!');
    },
    
    onError: (error) => {
      onError(handleApiError(error));
    },
  });
}
