import { useState, useEffect } from "react";
import api from "@/utils/api";
import type { Application, CV, HistoryResponse, CVResponse } from "@/types";

export function useDashboardData(user: any) {
  const [history, setHistory] = useState<Application[]>([]);
  const [cvs, setCvs] = useState<CV[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isLoadingCvs, setIsLoadingCvs] = useState(false);

  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const res = await api.get<HistoryResponse>("/email/history");
      setHistory(res.data.history);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const fetchCvs = async () => {
    setIsLoadingCvs(true);
    try {
      const res = await api.get<CVResponse>("/cv");
      setCvs(res.data.cvs);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingCvs(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchHistory();
      fetchCvs();
    }
  }, [user]);

  return {
    history,
    cvs,
    isLoadingHistory,
    isLoadingCvs,
    fetchHistory,
    fetchCvs,
  };
}
