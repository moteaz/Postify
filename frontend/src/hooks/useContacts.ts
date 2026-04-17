import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { contactService } from "@/services/api";
import type { UserContact } from "@/types";

export const useContacts = () => {
  const queryClient = useQueryClient();

  const { data: contacts = [], isLoading } = useQuery<UserContact[]>({
    queryKey: ["contacts"],
    queryFn: contactService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: ({ type, value }: { type: string; value: string }) =>
      contactService.create(type, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, value }: { id: string; value: string }) =>
      contactService.update(id, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => contactService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });

  return {
    contacts,
    isLoading,
    isUpdating: updateMutation.isPending || deleteMutation.isPending,
    updatingContactId: updateMutation.variables?.id || deleteMutation.variables,
    createContact: createMutation.mutateAsync,
    updateContact: updateMutation.mutateAsync,
    deleteContact: deleteMutation.mutateAsync,
    error: createMutation.error || updateMutation.error || deleteMutation.error,
  };
};
