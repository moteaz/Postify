"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const LoadingFallback = () => (
  <div className="flex justify-center p-12">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

export const NewApplicationTab = dynamic(
  () => import("./NewApplicationTab").then(mod => ({ default: mod.NewApplicationTab })),
  { loading: LoadingFallback }
);

export const HistoryTab = dynamic(
  () => import("./HistoryTab").then(mod => ({ default: mod.HistoryTab })),
  { loading: LoadingFallback }
);

export const CVsTab = dynamic(
  () => import("./CVsTab").then(mod => ({ default: mod.CVsTab })),
  { loading: LoadingFallback }
);

export { Sidebar } from "./Sidebar";
export { DashboardHeader } from "./DashboardHeader";
export { ApplicationDetailModal } from "./ApplicationDetailModal";
