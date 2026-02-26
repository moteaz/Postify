import { useState, useCallback } from "react";
import { applicationService } from "@/services/api";
import { handleApiError, getErrorDetails } from "@/utils/errorHandler";
import { MESSAGES } from "@/config/messages";
import type { GeneratedContent, DashboardTabType } from "@/types";
import { DashboardTab } from "@/types/enums";

interface UseApplicationGeneratorReturn {
  jobDescription: string;
  setJobDescription: (value: string) => void;
  isGenerating: boolean;
  generatedContent: GeneratedContent | null;
  setGeneratedContent: (content: GeneratedContent | null) => void;
  applicationId: string | null;
  isSending: boolean;
  handleGenerate: () => Promise<void>;
  handleSend: () => Promise<void>;
}

export function useApplicationGenerator(
  onSuccess: (message: string) => void,
  onError: (message: string) => void,
  onNavigateToCvs: () => void
): UseApplicationGeneratorReturn {
  const [jobDescription, setJobDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!jobDescription.trim()) return;

    setIsGenerating(true);
    try {
      const result = await applicationService.generateApplication(jobDescription);
      setGeneratedContent(result.content);
      setApplicationId(result.applicationId);
    } catch (error) {
      const message = handleApiError(error);
      const details = getErrorDetails(error);
      alert(`${message}${details ? `\n\nDetails: ${details}` : ''}`);
      if (message.includes("CV")) onNavigateToCvs();
    } finally {
      setIsGenerating(false);
    }
  }, [jobDescription, onNavigateToCvs]);

  const handleSend = useCallback(async (): Promise<void> => {
    if (!generatedContent || !applicationId) return;

    setIsSending(true);
    try {
      await applicationService.sendApplication({
        applicationId,
        to: generatedContent.recruiterEmail,
        subject: generatedContent.subject,
        body: generatedContent.coverLetter
      });
      onSuccess(MESSAGES.APPLICATION_SENT_SUCCESS);
      setGeneratedContent(null);
      setJobDescription("");
      setApplicationId(null);
    } catch (error) {
      onError(handleApiError(error));
    } finally {
      setIsSending(false);
    }
  }, [generatedContent, applicationId, onSuccess, onError]);

  return {
    jobDescription,
    setJobDescription,
    isGenerating,
    generatedContent,
    setGeneratedContent,
    applicationId,
    isSending,
    handleGenerate,
    handleSend
  };
}
