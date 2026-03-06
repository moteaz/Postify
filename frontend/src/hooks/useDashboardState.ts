import { useState, useEffect } from "react";
import { useAutoReset } from "./useAutoReset";
import { TIMEOUTS } from "@/config/messages";
import { DashboardTab, type DashboardTabType } from "@/types/enums";

export function useDashboardState() {
  const [activeTab, setActiveTab] = useState<DashboardTabType>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('activeTab') as DashboardTabType) || DashboardTab.NEW;
    }
    return DashboardTab.NEW;
  });
  const [success, setSuccess] = useAutoReset<string | null>(null, TIMEOUTS.TOAST_DURATION, null);
  const [error, setError] = useAutoReset<string | null>(null, TIMEOUTS.TOAST_DURATION, null);

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  return { 
    activeTab, 
    setActiveTab, 
    success, 
    setSuccess, 
    error, 
    setError 
  };
}
