"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmModal } from "@/components/ConfirmModal";
import { Pagination } from "@/components/Pagination";
import { AdminStats } from "./AdminStats";
import { AdminUserList } from "./AdminUserList";
import { AdminUserDetailsModal } from "./AdminUserDetailsModal";
import { useAdminStats } from "@/hooks/useAdminStats";
import { useFilteredUsers } from "@/hooks/useFilteredUsers";
import type { AdminUser, AdminUserDetails, PaginationMeta } from "@/types";

interface AdminTabProps {
  users: AdminUser[];
  isLoading: boolean;
  selectedUser: AdminUserDetails | null;
  onViewUser: (id: string, page?: number) => void;
  onDeleteUser: (id: string) => void;
  onExportUsers: () => void;
  onCloseDetails: () => void;
  pagination: PaginationMeta | null;
  onPageChange: (page: number) => void;
  onUserDetailsPageChange: (page: number) => void;
}

export function AdminTab({
  users,
  isLoading,
  selectedUser,
  onViewUser,
  onDeleteUser,
  onExportUsers,
  onCloseDetails,
  pagination,
  onPageChange,
  onUserDetailsPageChange
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
        <div className="grid gap-4 sm:gap-5 grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-5 sm:p-6">
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
      {/* Subtle gradient blob */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-[#7C9EE8]/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="page-enter">
        <AdminStats {...stats} />
      </div>
      
      <div className="mt-8 space-y-4">
        <AdminUserList
          users={filteredUsers}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onViewUser={onViewUser}
          onDeleteUser={handleDeleteClick}
          onExportUsers={onExportUsers}
        />
        {pagination && <Pagination pagination={pagination} onPageChange={onPageChange} />}
      </div>

      {selectedUser && (
        <AdminUserDetailsModal
          user={selectedUser}
          onClose={onCloseDetails}
          onDeleteUser={onDeleteUser}
          onPageChange={onUserDetailsPageChange}
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
