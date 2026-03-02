import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ConfirmModal } from "@/components/ConfirmModal";
import { UserDetailsHeader } from "./UserDetailsHeader";
import { UserDetailsStats } from "./UserDetailsStats";
import { UserDetailsTabs, type TabType } from "./UserDetailsTabs";
import { UserOverviewTab } from "./UserOverviewTab";
import { UserCVsTab } from "./UserCVsTab";
import { UserApplicationsTab } from "./UserApplicationsTab";
import type { AdminUserDetails } from "@/types";

interface AdminUserDetailsModalProps {
  user: AdminUserDetails;
  onClose: () => void;
  onDeleteUser: (id: string) => void;
}

export const AdminUserDetailsModal = ({ user, onClose, onDeleteUser }: AdminUserDetailsModalProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    setShowDeleteConfirm(false);
    onClose();
    onDeleteUser(user.id);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4 backdrop-blur-sm">
        <Card className="w-full max-w-5xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
          <UserDetailsHeader 
            user={user} 
            onClose={onClose} 
            onDelete={() => setShowDeleteConfirm(true)} 
          />
          
          <UserDetailsStats 
            cvsCount={user.cvs.length}
            applicationsCount={user.applications.length}
            applications={user.applications}
          />
          
          <UserDetailsTabs 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            cvsCount={user.cvs.length}
            applicationsCount={user.applications.length}
          />

          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {activeTab === 'overview' && <UserOverviewTab user={user} />}
            {activeTab === 'cvs' && <UserCVsTab cvs={user.cvs} />}
            {activeTab === 'applications' && <UserApplicationsTab applications={user.applications} />}
          </div>
        </Card>
      </div>

      {showDeleteConfirm && (
        <ConfirmModal
          title="Delete User"
          message={`Are you sure you want to delete ${user.name} (${user.email})? This will permanently delete all their CVs and applications.`}
          confirmText="Delete User"
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </>
  );
};
