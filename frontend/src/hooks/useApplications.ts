import { useState, useCallback } from "react";
import { applicationService } from "@/services/api";
import type { Application } from "@/types";

interface UseApplicationsReturn {
  history: Application[];
  isLoadingHistory: boolean;
  selectedApplication: Application | null;
  setSelectedApplication: (app: Application | null) => void;
  fetchHistory: () => Promise<void>;
}

export function useApplications(): UseApplicationsReturn {
  const [history, setHistory] = useState<Application[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  const fetchHistory = useCallback(async (): Promise<void> => {
    setIsLoadingHistory(true);
    try {
      const data = await applicationService.getHistory();
      setHistory(data);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  return {
    history,
    isLoadingHistory,
    selectedApplication,
    setSelectedApplication,
    fetchHistory
  };
}
