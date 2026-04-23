import { memo } from "react";
import type { UserContact } from "@/types";
import { ContactCard } from "./contact-card";
import { ContactListSkeleton } from "./contact-list-skeleton";
import { ContactListEmpty } from "./contact-list-empty";
import { ContactListHeader } from "./contact-list-header";

interface ContactListProps {
  contacts: UserContact[];
  isLoading: boolean;
  isUpdating: boolean;
  updatingContactId?: string;
  onUpdate: (id: string, value: string) => void;
  onDelete: (id: string, type: string) => void;
  onAdd: () => void;
}

const ContactListComponent = ({
  contacts,
  isLoading,
  isUpdating,
  updatingContactId,
  onUpdate,
  onDelete,
  onAdd,
}: ContactListProps) => {
  if (isLoading) {
    return <ContactListSkeleton />;
  }

  return (
    <div className="space-y-6">
      <ContactListHeader onAdd={onAdd} />

      {contacts.length === 0 ? (
        <ContactListEmpty onAdd={onAdd} />
      ) : (
        <div className="space-y-3">
          {contacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              isUpdating={isUpdating && updatingContactId === contact.id}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const ContactList = memo(ContactListComponent);

ContactList.displayName = "ContactList";
