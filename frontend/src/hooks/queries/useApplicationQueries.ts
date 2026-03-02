import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationService } from '@/services/api';

export const applicationKeys = {
  all: ['applications'] as const,
  history: () => [...applicationKeys.all, 'history'] as const,
};

export function useApplicationHistory() {
  return useQuery({
    queryKey: applicationKeys.history(),
    queryFn: applicationService.getHistory,
  });
}

export function useGenerateApplication() {
  return useMutation({
    mutationFn: applicationService.generateApplication,
  });
}

export function useSendApplication() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: applicationService.sendApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.history() });
    },
  });
}
