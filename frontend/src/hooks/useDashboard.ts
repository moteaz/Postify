import { useState, useEffect, useRef } from "react";
import { useAutoReset } from "./useAutoReset";
import { TIMEOUTS } from "@/config/messages";
import { useApplications } from "./useApplications";
import { useCVManagement } from "./useCVManagement";
import { useApplicationGenerator } from "./useApplicationGenerator";
import { useAuth } from "./useAuth";
import { useAdmin } from "./useAdmin";
import { DashboardTab, type DashboardTabType } from "@/types/enums";
import type { User, CV, Application, GeneratedContent, AdminUser, AdminUserDetails } from "@/types";

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
  handleViewUser: (id: string) => Promise<void>;
  handleDeleteUser: (id: string) => Promise<void>;
  handleExportUsers: () => Promise<void>;
  handleCloseUserDetails: () => void;
}

export function useDashboard(): UseDashboardReturn | null {
  const [activeTab, setActiveTab] = useState<DashboardTabType>(DashboardTab.NEW);
  const [success, setSuccess] = useAutoReset<string | null>(null, TIMEOUTS.TOAST_DURATION, null);
  const [error, setError] = useAutoReset<string | null>(null, TIMEOUTS.TOAST_DURATION, null);
  const [hasFetchedHistory, setHasFetchedHistory] = useState(false);
  const [hasFetchedCvs, setHasFetchedCvs] = useState(false);
  const [hasFetchedAdmin, setHasFetchedAdmin] = useState(false); // kept for future use if needed

  const { user, handleLogout } = useAuth();
  const applications = useApplications();
  const cvManagement = useCVManagement(setSuccess, setError);
  const generator = useApplicationGenerator(
    setSuccess,
    setError,
    () => setActiveTab(DashboardTab.CVS)
  );
  const admin = useAdmin(setSuccess, setError);

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
    await applications.fetchHistory();
    setHasFetchedHistory(true);
  };

  const handleSendWithRefresh = async (): Promise<void> => {
    await generator.handleSend();
    await applications.fetchHistory();
    setHasFetchedHistory(true);
  };

  const handleTabChange = (tab: DashboardTabType) => {
    setActiveTab(tab);

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
    activeTab,
    setActiveTab: handleTabChange,
    jobDescription: generator.jobDescription,
    setJobDescription: generator.setJobDescription,
    isGenerating: generator.isGenerating,
    generatedContent: generator.generatedContent,
    setGeneratedContent: generator.setGeneratedContent,
    isSending: generator.isSending,
    success,
    setSuccess,
    error,
    setError,
    history: applications.history,
    isLoadingHistory: applications.isLoadingHistory,
    selectedApplication: applications.selectedApplication,
    setSelectedApplication: applications.setSelectedApplication,
    cvs: cvManagement.cvs,
    isLoadingCvs: cvManagement.isLoadingCvs,
    isUpdatingCV: cvManagement.isUpdatingCV,
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
  };
}
