import { useState, useEffect } from "react";
import { useAutoReset } from "./useAutoReset";
import { TIMEOUTS } from "@/config/messages";
import { useApplications } from "./useApplications";
import { useCVManagement } from "./useCVManagement";
import { useApplicationGenerator } from "./useApplicationGenerator";
import { useAuth } from "./useAuth";
import { DashboardTab, type DashboardTabType } from "@/types/enums";
import type { User, CV, Application, GeneratedContent } from "@/types";

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
  handleUploadCV: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleDeleteCV: (id: string) => Promise<void>;
  handleSetActiveCV: (id: string) => Promise<void>;
  handleGenerate: () => Promise<void>;
  handleSend: () => Promise<void>;
  handleLogout: () => Promise<void>;
}

export function useDashboard(): UseDashboardReturn | null {
  const [activeTab, setActiveTab] = useState<DashboardTabType>(DashboardTab.NEW);
  const [success, setSuccess] = useAutoReset<string | null>(null, TIMEOUTS.TOAST_DURATION, null);
  const [error, setError] = useAutoReset<string | null>(null, TIMEOUTS.TOAST_DURATION, null);

  const { user, handleLogout } = useAuth();
  const applications = useApplications();
  const cvManagement = useCVManagement(setSuccess, setError);
  const generator = useApplicationGenerator(
    setSuccess,
    setError,
    () => setActiveTab(DashboardTab.CVS)
  );

  useEffect(() => {
    if (user) {
      applications.fetchHistory();
      cvManagement.fetchCvs();
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    if (activeTab === DashboardTab.HISTORY) applications.fetchHistory();
    if (activeTab === DashboardTab.CVS) cvManagement.fetchCvs();
  }, [activeTab, user]);

  if (!user) return null;

  return {
    user,
    activeTab,
    setActiveTab,
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
    handleUploadCV: cvManagement.handleUploadCV,
    handleDeleteCV: cvManagement.handleDeleteCV,
    handleSetActiveCV: cvManagement.handleSetActiveCV,
    handleGenerate: generator.handleGenerate,
    handleSend: generator.handleSend,
    handleLogout,
  };
}
