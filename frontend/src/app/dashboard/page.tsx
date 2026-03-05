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
            className="lg:hidden fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[var(--accent-primary)] text-white shadow-[var(--shadow-card)] flex items-center justify-center hover:scale-110 transition-transform"
            aria-label="Open menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>

          <DashboardHeader activeTab={activeTab} />

          {activeTab === "new" && (
            <NewApplicationTab
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
              cvs={cvs}
              isLoading={isLoadingCvs}
              isUpdating={isUpdatingCV}
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
