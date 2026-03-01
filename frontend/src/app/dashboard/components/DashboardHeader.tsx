import { memo } from "react";

interface DashboardHeaderProps {
  activeTab: "new" | "history" | "cvs" | "admin";
}

const headers = {
  new: {
    title: "Create New Application",
    description: "Paste a job description to get started"
  },
  history: {
    title: "Application History",
    description: "Review your past applications"
  },
  cvs: {
    title: "Manage CVs",
    description: "Upload or update your professional CVs"
  },
  admin: {
    title: "Admin Dashboard",
    description: "Manage users and monitor platform activity"
  }
};

export const DashboardHeader = memo(({ activeTab }: DashboardHeaderProps) => {
  const { title, description } = headers[activeTab];
  
  return (
    <header className="mb-6 sm:mb-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">{title}</h1>
      <p className="text-sm sm:text-base text-neutral-600 mt-1">{description}</p>
    </header>
  );
});

DashboardHeader.displayName = "DashboardHeader";
