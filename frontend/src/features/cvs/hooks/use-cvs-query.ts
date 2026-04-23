import { useQuery } from '@tanstack/react-query';
import { cvService } from '@/services/api';
import type { CV } from '@/types';

export const cvKeys = {
  all: ['cvs'] as const,
  lists: () => [...cvKeys.all, 'list'] as const,
};

export function useCVsQuery(enabled: boolean) {
  return useQuery({
    queryKey: cvKeys.lists(),
    queryFn: cvService.getAll,
    enabled,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}
