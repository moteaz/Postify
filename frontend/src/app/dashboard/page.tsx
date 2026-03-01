"use client";

import { useDashboard } from "@/hooks/useDashboard";
import {
  Sidebar,
  DashboardHeader,
  NewApplicationTab,
  HistoryTab,
  CVsTab,
  ApplicationDetailModal,
} from "./components";

export default function Dashboard() {
  const dashboardData = useDashboard();

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
  } = dashboardData;

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-neutral-50 overflow-hidden">
      <Sidebar
        user={user}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
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
