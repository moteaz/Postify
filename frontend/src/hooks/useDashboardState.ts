import { useState } from "react";
import { useAutoReset } from "./useAutoReset";
import { TIMEOUTS } from "@/config/messages";
import { DashboardTab, type DashboardTabType } from "@/types/enums";

export function useDashboardState() {
  const [activeTab, setActiveTab] = useState<DashboardTabType>(DashboardTab.NEW);
  const [success, setSuccess] = useAutoReset<string | null>(null, TIMEOUTS.TOAST_DURATION, null);
  const [error, setError] = useAutoReset<string | null>(null, TIMEOUTS.TOAST_DURATION, null);

  return { 
    activeTab, 
    setActiveTab, 
    success, 
    setSuccess, 
    error, 
    setError 
  };
}
