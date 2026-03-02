import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cvService } from '@/services/api';

export const cvKeys = {
  all: ['cvs'] as const,
  list: () => [...cvKeys.all, 'list'] as const,
};

export function useCVs() {
  return useQuery({
    queryKey: cvKeys.list(),
    queryFn: cvService.getAll,
  });
}

export function useUploadCV() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: cvService.upload,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cvKeys.list() });
    },
  });
}

export function useSetActiveCV() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: cvService.setActive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cvKeys.list() });
    },
  });
}

export function useArchiveCV() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: cvService.setArchived,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cvKeys.list() });
    },
  });
}
