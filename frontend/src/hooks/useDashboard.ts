import { useState, useEffect } from "react";
import { useDashboardState } from "./useDashboardState";
import { useApplications } from "./useApplications";
import { useCVManagement } from "./useCVManagement";
import { useApplicationGenerator } from "./useApplicationGenerator";
import { useAuth } from "./useAuth";
import { useAdmin } from "./useAdmin";
import { DashboardTab, type DashboardTabType } from "@/types/enums";
import type { User, CV, Application, GeneratedContent, AdminUser, AdminUserDetails, PaginationMeta } from "@/types";

interface UseDashboardReturn {
  user: User;
  activeTab: DashboardTabType;
  setActiveTab: (tab: DashboardTabType) => void;
  jobDescription: string;
  setJobDescription: (value: string) => void;
  isGenerating: boolean;
  generatedContent: GeneratedContent | null;
  setGeneratedContent: (content: GeneratedContent | null) => void;
  isSending: boolean;
  success: string | null;
  setSuccess: (message: string | null) => void;
  error: string | null;
  setError: (message: string | null) => void;
  history: Application[];
  isLoadingHistory: boolean;
  selectedApplication: Application | null;
  setSelectedApplication: (app: Application | null) => void;
  cvs: CV[];
  isLoadingCvs: boolean;
  isUpdatingCV: boolean;
  isUploadingCV: boolean;
  updatingCvId?: string;
  archiveConfirm: { id: string; name: string } | null;
  setArchiveConfirm: (confirm: { id: string; name: string } | null) => void;
  handleUploadCV: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleSetActiveCV: (id: string) => Promise<void>;
  handleSetArchivedCV: (id: string) => Promise<void>;
  handleGenerate: () => Promise<void>;
  handleSend: () => Promise<void>;
  handleLogout: () => Promise<void>;
  adminUsers: AdminUser[];
  isLoadingAdminUsers: boolean;
  selectedAdminUser: AdminUserDetails | null;
  handleViewUser: (id: string, page?: number) => Promise<void>;
  handleDeleteUser: (id: string) => Promise<void>;
  handleExportUsers: () => Promise<void>;
  handleCloseUserDetails: () => void;
  historyPagination: PaginationMeta | null;
  adminPagination: PaginationMeta | null;
  handleHistoryPageChange: (page: number) => Promise<void>;
  handleUserDetailsPageChange: (page: number) => Promise<void>;
  handleAdminPageChange: (page: number) => Promise<void>;
}

export function useDashboard(): UseDashboardReturn | null {
  const state = useDashboardState();
  const [hasFetchedHistory, setHasFetchedHistory] = useState(false);
  const [hasFetchedCvs, setHasFetchedCvs] = useState(false);
  const [hasFetchedAdmin, setHasFetchedAdmin] = useState(false);

  const { user, handleLogout } = useAuth();
  const applications = useApplications();
  const cvManagement = useCVManagement(state.setSuccess, state.setError);
  const generator = useApplicationGenerator(
    state.setSuccess,
    state.setError,
    () => state.setActiveTab(DashboardTab.CVS)
  );
  const admin = useAdmin(state.setSuccess, state.setError);

  useEffect(() => {
    if (!user) return;

    if (!hasFetchedHistory) {
      applications.fetchHistory();
      setHasFetchedHistory(true);
    }

    if (!hasFetchedCvs) {
      cvManagement.fetchCvs();
      setHasFetchedCvs(true);
    }
  }, [user, hasFetchedHistory, hasFetchedCvs, applications, cvManagement]);

  const handleGenerateWithRefresh = async (): Promise<void> => {
    await generator.handleGenerate();
    await applications.fetchHistory(1);
    setHasFetchedHistory(true);
  };

  const handleSendWithRefresh = async (): Promise<void> => {
    await generator.handleSend();
    await applications.fetchHistory(1);
    setHasFetchedHistory(true);
  };

  const handleHistoryPageChange = async (page: number): Promise<void> => {
    await applications.fetchHistory(page);
  };

  const handleAdminPageChange = async (page: number): Promise<void> => {
    await admin.fetchUsers(page);
  };

  const handleUserDetailsPageChange = async (page: number): Promise<void> => {
    if (admin.selectedUser) {
      await admin.viewUser(admin.selectedUser.id, page);
    }
  };

  const handleTabChange = (tab: DashboardTabType) => {
    state.setActiveTab(tab);

    if (!user) return;

    if (tab === DashboardTab.HISTORY && !hasFetchedHistory) {
      applications.fetchHistory();
      setHasFetchedHistory(true);
    }

    if (tab === DashboardTab.CVS && !hasFetchedCvs) {
      cvManagement.fetchCvs();
      setHasFetchedCvs(true);
    }

    // Always refresh admin data when opening the Admin tab
    if (tab === DashboardTab.ADMIN && user.role === "ADMIN") {
      admin.fetchUsers();
      setHasFetchedAdmin(true);
    }
  };

  if (!user) return null;

  return {
    user,
    ...state,
    setActiveTab: handleTabChange,
    jobDescription: generator.jobDescription,
    setJobDescription: generator.setJobDescription,
    isGenerating: generator.isGenerating,
    generatedContent: generator.generatedContent,
    setGeneratedContent: generator.setGeneratedContent,
    isSending: generator.isSending,
    history: applications.history,
    isLoadingHistory: applications.isLoadingHistory,
    selectedApplication: applications.selectedApplication,
    setSelectedApplication: applications.setSelectedApplication,
    cvs: cvManagement.cvs,
    isLoadingCvs: cvManagement.isLoadingCvs,
    isUpdatingCV: cvManagement.isUpdatingCV,
    isUploadingCV: cvManagement.isUploadingCV,
    updatingCvId: cvManagement.updatingCvId,
    archiveConfirm: cvManagement.archiveConfirmation,
    setArchiveConfirm: cvManagement.setArchiveConfirmation,
    handleUploadCV: cvManagement.handleUploadCV,
    handleSetActiveCV: cvManagement.handleSetActiveCV,
    handleSetArchivedCV: cvManagement.handleArchiveCV,
    handleGenerate: handleGenerateWithRefresh,
    handleSend: handleSendWithRefresh,
    handleLogout,
    adminUsers: admin.users,
    isLoadingAdminUsers: admin.isLoading,
    selectedAdminUser: admin.selectedUser,
    handleViewUser: admin.viewUser,
    handleDeleteUser: admin.deleteUser,
    handleExportUsers: admin.exportUsers,
    handleCloseUserDetails: admin.closeDetails,
    historyPagination: applications.pagination,
    adminPagination: admin.pagination,
    handleHistoryPageChange,
    handleAdminPageChange,
    handleUserDetailsPageChange,
  };
}
