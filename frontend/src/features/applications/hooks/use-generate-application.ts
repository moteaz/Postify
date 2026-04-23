import { useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationService } from '@/services/api';
import { applicationKeys } from './use-applications-query';
import { handleApiError } from '@/shared/utils/error-handler';

export function useGenerateApplication(
  onSuccess: (message: string) => void,
  onError: (message: string) => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobDescription: string) =>
      applicationService.generateApplication(jobDescription),
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.lists() });
      onSuccess('Cover letter generated successfully!');
    },
    
    onError: (error) => {
      onError(handleApiError(error));
    },
  });
}
