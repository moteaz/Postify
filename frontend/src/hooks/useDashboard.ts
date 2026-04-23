import { useState } from "react";
import { useAuth } from "./useAuth";
import { useDashboardState } from "./useDashboardState";

import { useApplicationsQuery } from "@/features/applications/hooks/use-applications-query";
import { useCVsQuery } from "@/features/cvs/hooks/use-cvs-query";
import { useContactsQuery } from "@/features/contacts/hooks/use-contacts-query";
import { useAdminUsersQuery, useAdminUserDetailsQuery } from "@/features/admin/hooks/use-admin-query";
import { useGenerateApplication } from "@/features/applications/hooks/use-generate-application";
import { useSendApplication } from "@/features/applications/hooks/use-send-application";
import { useUploadCV } from "@/features/cvs/hooks/use-upload-cv";
import { useSetActiveCV, useArchiveCV, useDeleteCV } from "@/features/cvs/hooks/use-cv-mutations";
import { useAddContact, useUpdateContact, useDeleteContact } from "@/features/contacts/hooks/use-contact-mutations";
import { useDeleteUser, useExportUsers } from "@/features/admin/hooks/use-admin-mutations";
import { DashboardTab, type DashboardTabType } from "@/types/enums";
import type { User, CV, Application, GeneratedContent, AdminUser, AdminUserDetails, PaginationMeta, UserContact } from "@/types";

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
  handleViewUser: (id: string, page?: number) => void;
  handleDeleteUser: (id: string) => Promise<void>;
  handleExportUsers: () => Promise<void>;
  handleCloseUserDetails: () => void;
  historyPagination: PaginationMeta | null;
  adminPagination: PaginationMeta | null;
  handleHistoryPageChange: (page: number) => void;
  handleUserDetailsPageChange: (page: number) => void;
  handleAdminPageChange: (page: number) => void;
  contacts: UserContact[];
  isLoadingContacts: boolean;
  isUpdatingContact: boolean;
  updatingContactId?: string;
  handleAddContact: (type: string, value: string) => Promise<void>;
  handleUpdateContact: (id: string, value: string) => Promise<void>;
  handleDeleteContact: (id: string) => Promise<void>;
}

export function useDashboard(): UseDashboardReturn | null {
  const state = useDashboardState();
  const { user, handleLogout } = useAuth();
  
  // Pagination state
  const [historyPage, setHistoryPage] = useState(1);
  const [adminPage, setAdminPage] = useState(1);
  const [adminDetailsPage, setAdminDetailsPage] = useState(1);
  const [selectedAdminUserId, setSelectedAdminUserId] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [archiveConfirm, setArchiveConfirm] = useState<{ id: string; name: string } | null>(null);
  const [updatingCvId, setUpdatingCvId] = useState<string | undefined>(undefined);
  const [updatingContactId, setUpdatingContactId] = useState<string | undefined>(undefined);
  
  // Application generation state (managed locally)
  const [jobDescription, setJobDescription] = useState("");
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [applicationId, setApplicationId] = useState<string | null>(null);

  // ============================================
  // REACT QUERY HOOKS (Lazy Loading)
  // ============================================
  
  // Only fetch when respective tab is active
  const applicationsQuery = useApplicationsQuery(
    historyPage,
    state.activeTab === DashboardTab.HISTORY
  );
  
  // CVs from /auth/me (already includes all non-archived CVs)
  // Only fetch separately if user.cvs is not available
  const cvsQuery = useCVsQuery(
    state.activeTab === DashboardTab.CVS && !user?.cvs
  );
  
  const contactsQuery = useContactsQuery(
    state.activeTab === DashboardTab.CONTACTS
  );
  
  const adminUsersQuery = useAdminUsersQuery(
    adminPage,
    state.activeTab === DashboardTab.ADMIN && user?.role === "ADMIN"
  );
  
  const adminUserDetailsQuery = useAdminUserDetailsQuery(
    selectedAdminUserId,
    adminDetailsPage
  );

  // ============================================
  // MUTATIONS
  // ============================================
  
  const generateMutation = useGenerateApplication(state.setSuccess, state.setError);
  const sendMutation = useSendApplication(state.setSuccess, state.setError);
  const uploadCVMutation = useUploadCV(state.setSuccess, state.setError);
  const setActiveCVMutation = useSetActiveCV(state.setSuccess, state.setError);
  const archiveCVMutation = useArchiveCV(state.setSuccess, state.setError);
  const deleteCVMutation = useDeleteCV(state.setSuccess, state.setError);
  const addContactMutation = useAddContact(state.setSuccess, state.setError);
  const updateContactMutation = useUpdateContact(state.setSuccess, state.setError);
  const deleteContactMutation = useDeleteContact(state.setSuccess, state.setError);
  const deleteUserMutation = useDeleteUser(state.setSuccess, state.setError);
  const exportUsersMutation = useExportUsers(state.setSuccess, state.setError);

  // ============================================
  // HANDLERS
  // ============================================
  
  const handleGenerate = async () => {
    if (!jobDescription.trim()) return;
    
    const result = await generateMutation.mutateAsync(jobDescription);
    setGeneratedContent(result.content);
    setApplicationId(result.applicationId);
  };

  const handleSend = async () => {
    if (!generatedContent || !applicationId) return;
    
    await sendMutation.mutateAsync({
      applicationId,
      to: generatedContent.recruiterEmail,
      subject: generatedContent.subject,
      body: generatedContent.coverLetter,
    });
    
    // Reset form
    setGeneratedContent(null);
    setJobDescription("");
    setApplicationId(null);
  };

  const handleUploadCV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    await uploadCVMutation.mutateAsync(file);
    e.target.value = '';
  };

  const handleSetActiveCV = async (id: string) => {
    setUpdatingCvId(id);
    try {
      await setActiveCVMutation.mutateAsync(id);
    } finally {
      setUpdatingCvId(undefined);
    }
  };

  const handleSetArchivedCV = async (id: string) => {
    setUpdatingCvId(id);
    try {
      await archiveCVMutation.mutateAsync(id);
    } finally {
      setUpdatingCvId(undefined);
      setArchiveConfirm(null);
    }
  };

  const handleAddContact = async (type: string, value: string) => {
    await addContactMutation.mutateAsync({ type, value });
  };

  const handleUpdateContact = async (id: string, value: string) => {
    setUpdatingContactId(id);
    try {
      await updateContactMutation.mutateAsync({ id, value });
    } finally {
      setUpdatingContactId(undefined);
    }
  };

  const handleDeleteContact = async (id: string) => {
    await deleteContactMutation.mutateAsync(id);
  };

  const handleViewUser = (id: string, page: number = 1) => {
    setSelectedAdminUserId(id);
    setAdminDetailsPage(page);
  };

  const handleDeleteUser = async (id: string) => {
    await deleteUserMutation.mutateAsync(id);
    if (selectedAdminUserId === id) {
      setSelectedAdminUserId(null);
    }
  };

  const handleExportUsers = async () => {
    await exportUsersMutation.mutateAsync();
  };

  const handleTabChange = (tab: DashboardTabType) => {
    state.setActiveTab(tab);
    localStorage.setItem('activeTab', tab);
  };

  // ============================================
  // RETURN
  // ============================================
  
  if (!user) return null;

  return {
    user,
    activeTab: state.activeTab,
    setActiveTab: handleTabChange,
    success: state.success,
    setSuccess: state.setSuccess,
    error: state.error,
    setError: state.setError,
    
    // Application Generation
    jobDescription,
    setJobDescription,
    generatedContent,
    setGeneratedContent,
    isGenerating: generateMutation.isPending,
    isSending: sendMutation.isPending,
    handleGenerate,
    handleSend,
    
    // History Tab
    history: applicationsQuery.data?.data || [],
    isLoadingHistory: applicationsQuery.isLoading,
    historyPagination: applicationsQuery.data?.pagination || null,
    handleHistoryPageChange: setHistoryPage,
    selectedApplication,
    setSelectedApplication,
    
    // CVs Tab - use CVs from /auth/me response
    cvs: user?.cvs || cvsQuery.data || [],
    isLoadingCvs: !user?.cvs && cvsQuery.isLoading,
    isUploadingCV: uploadCVMutation.isPending,
    isUpdatingCV: setActiveCVMutation.isPending || archiveCVMutation.isPending || deleteCVMutation.isPending,
    updatingCvId,
    handleUploadCV,
    handleSetActiveCV,
    handleSetArchivedCV,
    archiveConfirm,
    setArchiveConfirm,
    
    // Contacts Tab
    contacts: contactsQuery.data || [],
    isLoadingContacts: contactsQuery.isLoading,
    isUpdatingContact: updateContactMutation.isPending || deleteContactMutation.isPending,
    updatingContactId,
    handleAddContact,
    handleUpdateContact,
    handleDeleteContact,
    
    // Admin Tab
    adminUsers: adminUsersQuery.data?.data || [],
    isLoadingAdminUsers: adminUsersQuery.isLoading,
    adminPagination: adminUsersQuery.data?.pagination || null,
    handleAdminPageChange: setAdminPage,
    selectedAdminUser: adminUserDetailsQuery.data || null,
    handleViewUser,
    handleDeleteUser,
    handleExportUsers,
    handleCloseUserDetails: () => setSelectedAdminUserId(null),
    handleUserDetailsPageChange: setAdminDetailsPage,
    
    // Auth
    handleLogout,
  };
}
