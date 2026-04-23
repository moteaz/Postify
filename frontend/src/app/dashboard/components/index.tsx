"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const LoadingFallback = () => (
  <div className="flex justify-center p-12">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

export const NewApplicationTab = dynamic(
  () => import("@/features/applications/components/new-application-tab").then(mod => ({ default: mod.NewApplicationTab })),
  { loading: LoadingFallback }
);

export const HistoryTab = dynamic(
  () => import("@/features/applications/components/history-tab").then(mod => ({ default: mod.HistoryTab })),
  { loading: LoadingFallback }
);

export const CVsTab = dynamic(
  () => import("@/features/cvs/components/cvs-tab").then(mod => ({ default: mod.CVsTab })),
  { loading: LoadingFallback }
);

export const ContactsTab = dynamic(
  () => import("@/features/contacts/components/contacts-tab").then(mod => ({ default: mod.ContactsTab })),
  { loading: LoadingFallback }
);

export const AdminTab = dynamic(
  () => import("@/features/admin/components/admin-tab").then(mod => ({ default: mod.AdminTab })),
  { loading: LoadingFallback }
);

export { Sidebar } from "@/shared/components/layout/sidebar";
export { DashboardHeader } from "@/shared/components/layout/dashboard-header";
export { ApplicationDetailModal } from "@/features/applications/components/application-detail-modal";
