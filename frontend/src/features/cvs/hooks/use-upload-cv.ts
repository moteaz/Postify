import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cvService, authService } from '@/services/api';
import { cvKeys } from './use-cvs-query';
import { handleApiError } from '@/shared/utils/error-handler';
import { useAuthStore } from '@/store/useAuthStore';

export function useUploadCV(
  onSuccess: (message: string) => void,
  onError: (message: string) => void
) {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (file: File) => cvService.upload(file),
    
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: cvKeys.lists() });
      const user = await authService.getCurrentUser();
      setUser(user);
      onSuccess('CV uploaded successfully!');
    },
    
    onError: (error) => {
      onError(handleApiError(error));
    },
  });
}
