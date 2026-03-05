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

// REDESIGNED: Generous spacing, warm typography
export const DashboardHeader = memo(({ activeTab }: DashboardHeaderProps) => {
  const { title, description } = headers[activeTab];
  
  return (
    <header className="mb-8">
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text-primary)] font-[family-name:var(--font-display)]">{title}</h1>
      <p className="text-sm sm:text-base text-[var(--text-secondary)] mt-2 leading-relaxed">{description}</p>
    </header>
  );
});

DashboardHeader.displayName = "DashboardHeader";
