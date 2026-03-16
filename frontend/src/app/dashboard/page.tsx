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
    return (
      <div className="flex flex-col lg:flex-row h-screen bg-[var(--bg-base,#F9F7F4)] overflow-hidden" aria-busy="true" aria-label="Loading dashboard">
        {/* Sidebar skeleton */}
        <div className="hidden lg:flex flex-col w-56 border-r border-[#EAE7E3] bg-white/70 p-4 gap-4">
          <div className="h-8 w-28 rounded-lg bg-[#EAE7E3] animate-pulse mb-4" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-9 w-full rounded-lg bg-[#EAE7E3] animate-pulse" />
          ))}
          <div className="mt-auto h-9 w-full rounded-lg bg-[#EAE7E3] animate-pulse" />
        </div>
        {/* Main content skeleton */}
        <main className="flex-1 overflow-y-auto flex flex-col">
          {/* Mobile topbar skeleton */}
          <div className="lg:hidden h-14 border-b border-[#EAE7E3] bg-white/80 flex items-center px-4">
            <div className="h-8 w-8 rounded-lg bg-[#EAE7E3] animate-pulse" />
          </div>
          <div className="max-w-5xl mx-auto p-6 sm:p-8 w-full space-y-6">
            {/* Header skeleton */}
            <div className="h-8 w-48 rounded-lg bg-[#EAE7E3] animate-pulse" />
            <div className="h-4 w-72 rounded-lg bg-[#EAE7E3] animate-pulse" />
            {/* Content block skeletons */}
            <div className="h-40 w-full rounded-2xl bg-[#EAE7E3] animate-pulse" />
            <div className="h-24 w-full rounded-2xl bg-[#EAE7E3] animate-pulse" />
          </div>
        </main>
      </div>
    );
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

      <main className="flex-1 overflow-y-auto flex flex-col">
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-30 h-14 bg-white/80 backdrop-blur-md border-b border-[#EAE7E3] flex items-center px-4">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={sidebarOpen}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-[#78716C] hover:bg-[#F5F3F0] transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#7C9EE8] focus-visible:outline-none min-w-[44px] min-h-[44px]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>

        <div className="max-w-5xl mx-auto p-6 sm:p-8 w-full">

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
