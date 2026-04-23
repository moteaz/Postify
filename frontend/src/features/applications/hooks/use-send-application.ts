import { useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationService } from '@/services/api';
import { applicationKeys } from './use-applications-query';
import { handleApiError } from '@/shared/utils/error-handler';

export function useSendApplication(
  onSuccess: (message: string) => void,
  onError: (message: string) => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      applicationId: string;
      to: string;
      subject: string;
      body: string;
    }) => applicationService.sendApplication(data),
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.lists() });
      onSuccess('Application sent successfully!');
    },
    
    onError: (error) => {
      onError(handleApiError(error));
    },
  });
}
