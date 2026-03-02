"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmModal } from "@/components/ConfirmModal";
import { AdminStats } from "./AdminStats";
import { AdminUserList } from "./AdminUserList";
import { AdminUserDetailsModal } from "./AdminUserDetailsModal";
import { useAdminStats } from "@/hooks/useAdminStats";
import { useFilteredUsers } from "@/hooks/useFilteredUsers";
import type { AdminUser, AdminUserDetails } from "@/types";

interface AdminTabProps {
  users: AdminUser[];
  isLoading: boolean;
  selectedUser: AdminUserDetails | null;
  onViewUser: (id: string) => void;
  onDeleteUser: (id: string) => void;
  onExportUsers: () => void;
  onCloseDetails: () => void;
}

export function AdminTab({
  users,
  isLoading,
  selectedUser,
  onViewUser,
  onDeleteUser,
  onExportUsers,
  onCloseDetails
}: AdminTabProps) {
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string; email: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const stats = useAdminStats(users);
  const filteredUsers = useFilteredUsers(users, searchQuery);

  const handleDeleteClick = (id: string, email: string) => {
    setDeleteConfirmation({ id, email });
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmation) {
      onDeleteUser(deleteConfirmation.id);
      setDeleteConfirmation(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <AdminStats {...stats} />
      
      <AdminUserList
        users={filteredUsers}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onViewUser={onViewUser}
        onDeleteUser={handleDeleteClick}
        onExportUsers={onExportUsers}
      />

      {selectedUser && (
        <AdminUserDetailsModal
          user={selectedUser}
          onClose={onCloseDetails}
          onDeleteUser={onDeleteUser}
        />
      )}

      {deleteConfirmation && (
        <ConfirmModal
          title="Delete User"
          message={`Are you sure you want to delete ${deleteConfirmation.email}? This will permanently delete all their CVs and applications.`}
          confirmText="Delete"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteConfirmation(null)}
        />
      )}
    </>
  );
}
