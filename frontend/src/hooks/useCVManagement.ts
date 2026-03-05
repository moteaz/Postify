import { useState, useCallback } from "react";
import { cvService } from "@/services/api";
import { handleApiError } from "@/utils/errorHandler";
import { MESSAGES } from "@/config/messages";
import { validateFileSize, validateFileType } from "@/utils/security/validation";
import type { CV } from "@/types";

interface UseCVManagementReturn {
  cvs: CV[];
  isLoadingCvs: boolean;
  isUpdatingCV: boolean;
  activeCV: CV | undefined;
  archiveConfirmation: { id: string; name: string } | null;
  setArchiveConfirmation: (confirm: { id: string; name: string } | null) => void;
  fetchCvs: () => Promise<void>;
  handleUploadCV: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleSetActiveCV: (id: string) => Promise<void>;
  handleArchiveCV: (id: string) => Promise<void>;
}

export function useCVManagement(
  onSuccess: (message: string) => void,
  onError: (message: string) => void
): UseCVManagementReturn {
  const [cvs, setCvs] = useState<CV[]>([]);
  const [isLoadingCvs, setIsLoadingCvs] = useState(false);
  const [isUpdatingCV, setIsUpdatingCV] = useState(false);
  const [archiveConfirmation, setArchiveConfirmation] = useState<{ id: string; name: string } | null>(null);

  const fetchCvs = useCallback(async (): Promise<void> => {
    setIsLoadingCvs(true);
    try {
      const data = await cvService.getAll();
      setCvs(data);
    } catch (error) {
      onError(handleApiError(error));
    } finally {
      setIsLoadingCvs(false);
    }
  }, [onError]);

  const handleUploadCV = useCallback(async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateFileSize(file.size)) {
      onError("File too large. Maximum size is 5MB.");
      return;
    }

    if (!validateFileType(file.type)) {
      onError("Invalid file type. Only PDF and DOCX files are allowed.");
      return;
    }

    try {
      await cvService.upload(file);
      onSuccess(MESSAGES.CV_UPLOAD_SUCCESS);
      await fetchCvs();
    } catch (error) {
      onError(handleApiError(error));
    }
  }, [fetchCvs, onSuccess, onError]);

  const handleArchiveCV = useCallback(async (id: string): Promise<void> => {
    setIsUpdatingCV(true);
    try {
      await cvService.setArchived(id);
      setArchiveConfirmation(null);
      await fetchCvs();
      onSuccess(MESSAGES.CV_ARCHIVE_SUCCESS);
    } catch (error) {
      setArchiveConfirmation(null);
      onError(handleApiError(error));
    } finally {
      setIsUpdatingCV(false);
    }
  }, [fetchCvs, onSuccess, onError]);

  const handleSetActiveCV = useCallback(async (id: string): Promise<void> => {
    setIsUpdatingCV(true);
    try {
      await cvService.setActive(id);
      await fetchCvs();
      onSuccess(MESSAGES.CV_ACTIVE_SUCCESS);
    } catch (error) {
      onError(handleApiError(error));
    } finally {
      setIsUpdatingCV(false);
    }
  }, [fetchCvs, onSuccess, onError]);

  const activeCV = cvs.find(cv => cv.isActive);

  return {
    cvs,
    isLoadingCvs,
    isUpdatingCV,
    activeCV,
    archiveConfirmation,
    setArchiveConfirmation,
    fetchCvs,
    handleUploadCV,
    handleSetActiveCV,
    handleArchiveCV,
  };
}
