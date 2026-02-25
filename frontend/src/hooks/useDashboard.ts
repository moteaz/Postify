import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/utils/api";
import { handleApiError, getErrorDetails } from "@/utils/errorHandler";
import type {
  Application,
  CV,
  GeneratedContent,
  HealthResponse,
  GenerateResponse,
  HistoryResponse,
  CVResponse,
  MeResponse,
  SystemStatus
} from "@/types";

export function useDashboard() {
  const router = useRouter();
  const { user, setUser, logout } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState<"new" | "history" | "cvs">("new");
  const [jobDescription, setJobDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [history, setHistory] = useState<Application[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [cvs, setCvs] = useState<CV[]>([]);
  const [isLoadingCvs, setIsLoadingCvs] = useState(false);
  const [isUpdatingCV, setIsUpdatingCV] = useState(false);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({ api: 'checking', ai: 'checking' });

  const fetchHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    try {
      const res = await api.get<HistoryResponse>("/email/history");
      setHistory(res.data.history);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  const fetchCvs = useCallback(async () => {
    setIsLoadingCvs(true);
    try {
      const res = await api.get<CVResponse>("/cv");
      setCvs(res.data.cvs);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingCvs(false);
    }
  }, []);

  const checkSystem = useCallback(async () => {
    try {
      const res = await api.get<HealthResponse>("/health");
      setSystemStatus({
        api: 'online',
        ai: res.data.ai_status as SystemStatus['ai'],
        provider: res.data.ai_provider
      });
    } catch {
      setSystemStatus({ api: 'offline', ai: 'offline' });
    }
  }, []);

  useEffect(() => {
    if (!user) {
      api.get<MeResponse>("/auth/me")
        .then((res) => setUser(res.data.user))
        .catch(() => {
          logout();
          router.replace("/");
        });
    }
  }, [user, router, setUser, logout]);

  useEffect(() => {
    if (user) {
      fetchHistory();
      fetchCvs();
      checkSystem();
      const interval = setInterval(checkSystem, 30000);
      return () => clearInterval(interval);
    }
  }, [user, fetchHistory, fetchCvs, checkSystem]);

  useEffect(() => {
    if (!user) return;
    if (activeTab === "history") fetchHistory();
    if (activeTab === "cvs") fetchCvs();
  }, [activeTab, user, fetchHistory, fetchCvs]);

  const handleUploadCV = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("cv", file);

    try {
      await api.post("/cv/upload", formData);
      setSuccess("CV uploaded successfully!");
      fetchCvs();
    } catch (error) {
      console.error(error);
    }
  }, [fetchCvs]);

  const handleDeleteCV = useCallback(async (id: string) => {
    if (!confirm("Are you sure you want to delete this CV?")) return;
    try {
      await api.delete(`/cv/${id}`);
      setSuccess("CV deleted.");
      fetchCvs();
    } catch (error) {
      console.error(error);
    }
  }, [fetchCvs]);

  const handleSetActiveCV = useCallback(async (id: string) => {
    setIsUpdatingCV(true);
    try {
      await api.put(`/cv/${id}/active`);
      fetchCvs();
      setSuccess("Active CV updated!");
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdatingCV(false);
    }
  }, [fetchCvs]);

  const handleGenerate = useCallback(async () => {
    if (!jobDescription.trim()) return;

    setIsGenerating(true);
    setSuccess(null);
    try {
      const res = await api.post<GenerateResponse>("/ai/generate", { jobDescription });
      setGeneratedContent(res.data.content);
      setApplicationId(res.data.applicationId);
    } catch (error) {
      const message = handleApiError(error);
      const details = getErrorDetails(error);
      setSuccess(null);
      alert(`${message}${details ? `\n\nDetails: ${details}` : ''}`);
      if (message.includes("CV")) setActiveTab("cvs");
    } finally {
      setIsGenerating(false);
    }
  }, [jobDescription]);

  const handleSend = useCallback(async () => {
    if (!generatedContent || !applicationId) return;
    
    setIsSending(true);
    try {
      await api.post("/email/send", {
        applicationId,
        to: generatedContent.recruiterEmail,
        subject: generatedContent.subject,
        body: generatedContent.coverLetter
      });
      setSuccess("Application sent successfully!");
      setGeneratedContent(null);
      setJobDescription("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSending(false);
    }
  }, [generatedContent, applicationId]);

  const handleLogout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      logout();
      router.replace("/");
    }
  }, [logout, router]);

  if (!user) {
    return null;
  }

  return {
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
    history,
    isLoadingHistory,
    selectedApplication,
    setSelectedApplication,
    cvs,
    isLoadingCvs,
    isUpdatingCV,
    systemStatus,
    handleUploadCV,
    handleDeleteCV,
    handleSetActiveCV,
    handleGenerate,
    handleSend,
    handleLogout,
  };
}
