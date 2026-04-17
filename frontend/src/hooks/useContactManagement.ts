import { useState } from "react";
import { useContacts } from "./useContacts";

export function useContactManagement(
  setSuccess: (message: string | null) => void,
  setError: (message: string | null) => void
) {
  const {
    contacts,
    isLoading,
    isUpdating,
    updatingContactId,
    createContact,
    updateContact,
    deleteContact,
  } = useContacts();

  const handleAddContact = async (type: string, value: string): Promise<void> => {
    try {
      await createContact({ type, value });
      setSuccess("Contact added successfully");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add contact");
    }
  };

  const handleUpdateContact = async (id: string, value: string): Promise<void> => {
    try {
      await updateContact({ id, value });
      setSuccess("Contact updated successfully");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update contact");
    }
  };

  const handleDeleteContact = async (id: string): Promise<void> => {
    try {
      await deleteContact(id);
      setSuccess("Contact deleted successfully");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete contact");
    }
  };

  return {
    contacts,
    isLoadingContacts: isLoading,
    isUpdatingContact: isUpdating,
    updatingContactId,
    handleAddContact,
    handleUpdateContact,
    handleDeleteContact,
  };
}
