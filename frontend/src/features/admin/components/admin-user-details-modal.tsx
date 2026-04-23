import { useState } from "react";
import { ConfirmModal } from "@/shared/components/feedback/confirm-modal";
import { UserDetailsHeader } from "./user-details-header";
import { UserDetailsStats } from "./user-details-stats";
import { UserDetailsTabs, type TabType } from "./user-details-tabs";
import { UserOverviewTab } from "./user-overview-tab";
import { UserCVsTab } from "./user-cvs-tab";
import { UserApplicationsTab } from "./user-applications-tab";
import type { AdminUserDetails } from "@/types";

interface AdminUserDetailsModalProps {
  user: AdminUserDetails;
  onClose: () => void;
  onDeleteUser: (id: string) => void;
  onPageChange: (page: number) => void;
}

export const AdminUserDetailsModal = ({ user, onClose, onDeleteUser, onPageChange }: AdminUserDetailsModalProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    setShowDeleteConfirm(false);
    onClose();
    onDeleteUser(user.id);
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        {/* Modal */}
        <div className="w-full max-w-2xl max-h-[88vh] bg-[#FDFCFB] rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          <UserDetailsHeader 
            user={user} 
            onClose={onClose} 
            onDelete={() => setShowDeleteConfirm(true)} 
          />
          
          <UserDetailsStats 
            cvsCount={user._count.cvs}
            applicationsCount={user._count.applications}
            applications={user.applications.data}
          />
          
          <UserDetailsTabs 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            cvsCount={user._count.cvs}
            applicationsCount={user._count.applications}
          />

          <div className="flex-1 overflow-y-auto animate-in fade-in duration-150">
            {activeTab === 'overview' && <UserOverviewTab user={user} />}
            {activeTab === 'cvs' && <UserCVsTab cvs={user.cvs} />}
            {activeTab === 'applications' && (
              <UserApplicationsTab 
                applications={user.applications.data} 
                pagination={user.applications.pagination}
                onPageChange={onPageChange}
              />
            )}
          </div>
        </div>
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
