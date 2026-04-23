import { useMutation, useQueryClient } from '@tanstack/react-query';
import { contactService } from '@/services/api';
import { contactKeys } from './use-contacts-query';
import { handleApiError } from '@/shared/utils/error-handler';

export function useAddContact(
  onSuccess: (message: string) => void,
  onError: (message: string) => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ type, value }: { type: string; value: string }) =>
      contactService.create(type, value),
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.all });
      onSuccess('Contact added successfully!');
    },
    
    onError: (error) => {
      onError(handleApiError(error));
    },
  });
}

export function useUpdateContact(
  onSuccess: (message: string) => void,
  onError: (message: string) => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, value }: { id: string; value: string }) =>
      contactService.update(id, value),
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.all });
      onSuccess('Contact updated successfully!');
    },
    
    onError: (error) => {
      onError(handleApiError(error));
    },
  });
}

export function useDeleteContact(
  onSuccess: (message: string) => void,
  onError: (message: string) => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => contactService.delete(id),
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.all });
      onSuccess('Contact deleted successfully!');
    },
    
    onError: (error) => {
      onError(handleApiError(error));
    },
  });
}
