import { memo, useEffect } from "react";
import Image from "next/image";
import { PlusCircle, History, FileText, ShieldCheck, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/hooks/usePermissions";
import type { User } from "@/types";

interface SidebarProps {
  user: User | null;
  activeTab: "new" | "history" | "cvs" | "admin";
  onTabChange: (tab: "new" | "history" | "cvs" | "admin") => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const tabs = [
  { id: "new" as const, icon: PlusCircle, label: "New Application" },
  { id: "history" as const, icon: History, label: "History" },
  { id: "cvs" as const, icon: FileText, label: "My CVs" },
];

export const Sidebar = memo(({ user, activeTab, onTabChange, onLogout, isOpen, onClose }: SidebarProps) => {
  const { canAccessAdmin } = usePermissions();

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const handleNavClick = (tab: typeof activeTab) => {
    onTabChange(tab);
    onClose();
  };

  return (
    <>
      {/* Mobile backdrop overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed md:relative inset-y-0 left-0 z-50 w-72 md:w-64 h-screen",
          "bg-[#F5F3F0] border-r border-[#EAE7E3]",
          "flex flex-col justify-between px-4 py-6",
          "transition-transform duration-300 ease-in-out",
          "md:translate-x-0 shadow-2xl md:shadow-none",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:hidden w-8 h-8 rounded-xl bg-[#F5F3F0] border border-[#EAE7E3] flex items-center justify-center hover:bg-[#FFE4E6] hover:border-[#F0A8C0] transition-all duration-150 focus-visible:ring-2 focus-visible:ring-[#7C9EE8] focus-visible:outline-none"
          aria-label="Close navigation menu"
        >
          <X size={16} className="text-[#78716C]" />
        </button>

        <div>
          {/* User profile card */}
          <div className="mx-1 mb-6 p-3.5 bg-white rounded-2xl border border-[#EAE7E3] shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-md transition-shadow duration-200">
            {/* Avatar with gradient ring */}
            <div className="p-[2.5px] bg-gradient-to-br from-[#7C9EE8] to-[#F0A8C0] rounded-2xl w-fit mb-3">
              {user?.avatarUrl ? (
                <Image 
                  src={user.avatarUrl} 
                  alt={user.name} 
                  width={48} 
                  height={48} 
                  className="w-12 h-12 rounded-[14px] object-cover" 
                  unoptimized
                />
              ) : (
                <div className="w-12 h-12 rounded-[14px] bg-white flex items-center justify-center">
                  <span className="text-lg font-bold text-[#7C9EE8] font-[family-name:var(--font-display)]">
                    {user?.name?.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Name */}
            <p className="text-sm font-semibold text-[#1C1917] font-[family-name:var(--font-display)] leading-tight">
              {user?.name}
            </p>

            {/* Email with tooltip */}
            <p className="text-xs text-[#A8A29E] mt-0.5 truncate" title={user?.email}>
              {user?.email}
            </p>

            {/* Role badge */}
            {user?.role === "ADMIN" && (
              <div className="mt-2.5 inline-flex items-center gap-1.5 bg-[#EEF3FD] text-[#4A7BD4] border border-[#C9DAFF] rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide">
                <ShieldCheck size={10} />
                Admin
              </div>
            )}
          </div>

          {/* Section label */}
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#A8A29E] px-3 mb-2">
            Navigation
          </p>

          {/* Navigation */}
          <nav className="space-y-1">
            {tabs.map(({ id, icon: Icon, label }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => handleNavClick(id)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#7C9EE8] focus-visible:outline-none",
                    isActive
                      ? "bg-white text-[#1C1917] font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-[#EAE7E3] relative before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-5 before:w-[3px] before:bg-[#7C9EE8] before:rounded-full"
                      : "text-[#78716C] hover:bg-white hover:text-[#1C1917] hover:shadow-sm"
                  )}
                >
                  <Icon 
                    size={17} 
                    strokeWidth={isActive ? 2 : 1.6} 
                    className={isActive ? "text-[#7C9EE8]" : "text-[#A8A29E]"} 
                  />
                  {label}
                </button>
              );
            })}
            {canAccessAdmin && (
              <button
                onClick={() => handleNavClick("admin")}
                aria-current={activeTab === "admin" ? "page" : undefined}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#7C9EE8] focus-visible:outline-none",
                  activeTab === "admin"
                    ? "bg-white text-[#1C1917] font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-[#EAE7E3] relative before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-5 before:w-[3px] before:bg-[#7C9EE8] before:rounded-full"
                    : "text-[#78716C] hover:bg-white hover:text-[#1C1917] hover:shadow-sm"
                )}
              >
                <ShieldCheck 
                  size={17} 
                  strokeWidth={activeTab === "admin" ? 2 : 1.6} 
                  className={activeTab === "admin" ? "text-[#7C9EE8]" : "text-[#A8A29E]"} 
                />
                Admin
              </button>
            )}
          </nav>
        </div>

        {/* Logout button */}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#78716C] hover:bg-[#FFF0F3] hover:text-red-500 transition-all duration-150 group focus-visible:ring-2 focus-visible:ring-[#7C9EE8] focus-visible:outline-none"
        >
          <div className="p-1.5 rounded-lg bg-[#F5F3F0] group-hover:bg-[#FFE4E6] transition-colors duration-150">
            <LogOut size={15} className="text-[#A8A29E] group-hover:text-red-400" />
          </div>
          Logout
        </button>
      </aside>


    </>
  );
});

Sidebar.displayName = "Sidebar";
