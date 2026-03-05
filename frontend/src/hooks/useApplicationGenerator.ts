import { useState, useCallback } from "react";
import { applicationService } from "@/services/api";
import { handleApiError } from "@/utils/errorHandler";
import { MESSAGES } from "@/config/messages";
import { useRateLimit } from "@/hooks/useRateLimit";
import { sanitizeInput } from "@/utils/security/sanitize";
import { VALIDATION } from "@/utils/security/validation";
import type { GeneratedContent } from "@/types";

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
  const { canProceed, recordAttempt, getRemainingTime } = useRateLimit(5, 60000);

  const handleGenerate = useCallback(async () => {
    if (!jobDescription.trim()) return;

    if (!canProceed()) {
      const remaining = getRemainingTime();
      onError(`Rate limit exceeded. Please wait ${remaining} seconds.`);
      return;
    }

    const sanitized = sanitizeInput(jobDescription, VALIDATION.MAX_JOB_DESCRIPTION_LENGTH);

    setIsGenerating(true);
    recordAttempt();
    try {
      const result = await applicationService.generateApplication(sanitized);
      setGeneratedContent(result.content);
      setApplicationId(result.applicationId);
    } catch (error) {
      const message = handleApiError(error);
      onError(message);
      if (message.includes("CV")) onNavigateToCvs();
    } finally {
      setIsGenerating(false);
    }
  }, [jobDescription, onNavigateToCvs, onError, canProceed, recordAttempt, getRemainingTime]);

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
