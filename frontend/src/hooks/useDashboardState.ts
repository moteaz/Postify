import { useState, useEffect } from "react";
import { useAutoReset } from "./useAutoReset";
import { TIMEOUTS } from "@/config/messages";
import { DashboardTab, type DashboardTabType } from "@/types/enums";
import { useAuthStore } from "@/store/useAuthStore";

export function useDashboardState() {
  const { user } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState<DashboardTabType>(DashboardTab.NEW);
  const [success, setSuccess] = useAutoReset<string | null>(null, TIMEOUTS.TOAST_DURATION, null);
  const [error, setError] = useAutoReset<string | null>(null, TIMEOUTS.TOAST_DURATION, null);

  // Load saved tab after user is loaded
  useEffect(() => {
    if (!user) return;
    
    if (typeof window !== 'undefined') {
      const savedTab = localStorage.getItem('activeTab') as DashboardTabType;
      if (savedTab && savedTab !== DashboardTab.ADMIN) {
        setActiveTab(savedTab);
      } else if (savedTab === DashboardTab.ADMIN && user.role === 'ADMIN') {
        setActiveTab(savedTab);
      }
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    
    // Don't save admin tab for non-admin users
    if (activeTab === DashboardTab.ADMIN && user.role !== 'ADMIN') {
      setActiveTab(DashboardTab.NEW);
      return;
    }
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab, user]);

  return { 
    activeTab, 
    setActiveTab, 
    success, 
    setSuccess, 
    error, 
    setError 
  };
}
