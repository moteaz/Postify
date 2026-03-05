import { useState, useCallback } from "react";
import { applicationService } from "@/services/api";
import type { Application, PaginationMeta } from "@/types";

interface UseApplicationsReturn {
  history: Application[];
  isLoadingHistory: boolean;
  selectedApplication: Application | null;
  setSelectedApplication: (app: Application | null) => void;
  fetchHistory: (page?: number) => Promise<void>;
  pagination: PaginationMeta | null;
}

export function useApplications(): UseApplicationsReturn {
  const [history, setHistory] = useState<Application[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);

  const fetchHistory = useCallback(async (page = 1): Promise<void> => {
    setIsLoadingHistory(true);
    try {
      const response = await applicationService.getHistory(page);
      setHistory(response.data);
      setPagination(response.pagination);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  return {
    history,
    isLoadingHistory,
    selectedApplication,
    setSelectedApplication,
    fetchHistory,
    pagination
  };
}
