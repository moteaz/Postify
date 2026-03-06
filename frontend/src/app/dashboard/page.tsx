"use client";

import { useState } from "react";
import { useDashboard } from "@/hooks/useDashboard";
import {
  Sidebar,
  DashboardHeader,
  NewApplicationTab,
  HistoryTab,
  CVsTab,
  AdminTab,
  ApplicationDetailModal,
} from "./components";

// REDESIGNED: Warm base background, generous spacing
export default function Dashboard() {
  const dashboardData = useDashboard();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!dashboardData) {
    return null;
  }

  const {
    user,
    activeTab,
    setActiveTab,
    jobDescription,
    setJobDescription,
    isGenerating,
    generatedContent,
    setGeneratedContent,
    isSending,
    success,
    setSuccess,
    error,
    setError,
    history,
    isLoadingHistory,
    selectedApplication,
    setSelectedApplication,
    cvs,
    isLoadingCvs,
    isUpdatingCV,
    isUploadingCV,
    updatingCvId,
    archiveConfirm,
    setArchiveConfirm,
    handleUploadCV,
    handleSetActiveCV,
    handleSetArchivedCV,
    handleGenerate,
    handleSend,
    handleLogout,
    adminUsers,
    isLoadingAdminUsers,
    selectedAdminUser,
    handleViewUser,
    handleDeleteUser,
    handleExportUsers,
    handleCloseUserDetails,
    historyPagination,
    adminPagination,
    handleHistoryPageChange,
    handleAdminPageChange,
    handleUserDetailsPageChange,
  } = dashboardData;

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[var(--bg-base)] overflow-hidden">
      <Sidebar
        user={user}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-6 sm:p-8">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden fixed top-6 right-6 z-40 w-12 h-12 rounded-xl bg-gradient-to-br from-[#7C9EE8] to-[#6B8DD6] text-white shadow-[0_4px_20px_rgba(124,158,232,0.4)] flex items-center justify-center hover:scale-110 hover:shadow-[0_6px_24px_rgba(124,158,232,0.5)] transition-all duration-300 active:scale-95"
            aria-label="Open menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>

          <DashboardHeader activeTab={activeTab} />

          {activeTab === "new" && (
            <NewApplicationTab
              key="new"
              jobDescription={jobDescription}
              onJobDescriptionChange={setJobDescription}
              generatedContent={generatedContent}
              onGeneratedContentChange={setGeneratedContent}
              isGenerating={isGenerating}
              isSending={isSending}
              onGenerate={handleGenerate}
              onSend={handleSend}
              onDiscard={() => setGeneratedContent(null)}
              success={success}
              onClearSuccess={() => setSuccess(null)}
              error={error}
              onClearError={() => setError(null)}
              cvs={cvs}
              isLoadingCvs={isLoadingCvs}
              onNavigateToCvs={() => setActiveTab("cvs")}
            />
          )}

          {activeTab === "history" && (
            <HistoryTab
              key="history"
              history={history}
              isLoading={isLoadingHistory}
              onViewDetails={setSelectedApplication}
              onCreateNew={() => setActiveTab("new")}
              pagination={historyPagination}
              onPageChange={handleHistoryPageChange}
            />
          )}

          {activeTab === "cvs" && (
            <CVsTab
              key="cvs"
              cvs={cvs}
              isLoading={isLoadingCvs}
              isUpdating={isUpdatingCV}
              isUploading={isUploadingCV}
              updatingCvId={updatingCvId}
              archiveConfirm={archiveConfirm}
              onSetArchiveConfirm={setArchiveConfirm}
              onUpload={handleUploadCV}
              onSetActive={handleSetActiveCV}
              onSetArchived={handleSetArchivedCV}
              success={success}
              onClearSuccess={() => setSuccess(null)}
              error={error}
              onClearError={() => setError(null)}
            />
          )}

          {activeTab === "admin" && (
            <AdminTab
              key="admin"
              users={adminUsers}
              isLoading={isLoadingAdminUsers}
              selectedUser={selectedAdminUser}
              onViewUser={handleViewUser}
              onDeleteUser={handleDeleteUser}
              onExportUsers={handleExportUsers}
              onCloseDetails={handleCloseUserDetails}
              pagination={adminPagination}
              onPageChange={handleAdminPageChange}
              onUserDetailsPageChange={handleUserDetailsPageChange}
            />
          )}
        </div>
      </main>

      {selectedApplication && (
        <ApplicationDetailModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
        />
      )}
    </div>
  );
}
