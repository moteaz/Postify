import { useQuery } from '@tanstack/react-query';
import { contactService } from '@/services/api';
import type { UserContact } from '@/types';

export const contactKeys = {
  all: ['contacts'] as const,
};

export function useContactsQuery(enabled: boolean) {
  return useQuery({
    queryKey: contactKeys.all,
    queryFn: contactService.getAll,
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
