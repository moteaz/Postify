import { useQuery } from '@tanstack/react-query';
import { applicationService } from '@/services/api';
import type { PaginatedResponse, Application } from '@/types';

export const applicationKeys = {
  all: ['applications'] as const,
  lists: () => [...applicationKeys.all, 'list'] as const,
  list: (page: number) => [...applicationKeys.lists(), page] as const,
};

export function useApplicationsQuery(page: number, enabled: boolean) {
  return useQuery({
    queryKey: applicationKeys.list(page),
    queryFn: () => applicationService.getHistory(page),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
