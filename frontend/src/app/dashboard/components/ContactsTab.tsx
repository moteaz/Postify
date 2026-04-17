import { useState } from "react";
import { ToastContainer } from "@/components/ToastContainer";
import { ConfirmModal } from "@/components/ConfirmModal";
import { ContactList } from "./ContactList";
import { AddContactModal } from "./AddContactModal";
import type { UserContact } from "@/types";

interface ContactsTabProps {
  contacts: UserContact[];
  isLoading: boolean;
  isUpdating: boolean;
  updatingContactId?: string;
  onAdd: (type: string, value: string) => void;
  onUpdate: (id: string, value: string) => void;
  onDelete: (id: string) => void;
  success: string | null;
  onClearSuccess: () => void;
  error: string | null;
  onClearError: () => void;
}

export const ContactsTab = ({
  contacts,
  isLoading,
  isUpdating,
  updatingContactId,
  onAdd,
  onUpdate,
  onDelete,
  success,
  onClearSuccess,
  error,
  onClearError,
}: ContactsTabProps) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; type: string } | null>(null);

  return (
    <>
      <ToastContainer
        success={success}
        error={error}
        onClearSuccess={onClearSuccess}
        onClearError={onClearError}
      />
      <div className="space-y-6 page-enter">
        <ContactList
          contacts={contacts}
          isLoading={isLoading}
          isUpdating={isUpdating}
          updatingContactId={updatingContactId}
          onUpdate={onUpdate}
          onDelete={(id, type) => setDeleteConfirm({ id, type })}
          onAdd={() => setShowAddModal(true)}
        />
      </div>
      {showAddModal && (
        <AddContactModal
          onClose={() => setShowAddModal(false)}
          onAdd={(type, value) => {
            onAdd(type, value);
            setShowAddModal(false);
          }}
        />
      )}
      {deleteConfirm && (
        <ConfirmModal
          title="Delete Contact"
          message={`Are you sure you want to delete "${deleteConfirm.type}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={() => {
            onDelete(deleteConfirm.id);
            setDeleteConfirm(null);
          }}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </>
  );
};
