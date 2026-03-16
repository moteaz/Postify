import { memo, useEffect, useState } from "react";
import Image from "next/image";
import { PlusCircle, History, FileText, ShieldCheck, LogOut, Menu, X, Power } from "lucide-react";
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
  const [showTooltip, setShowTooltip] = useState(false);

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

      <style jsx global>{`
        @media (max-width: 768px) {
          .mobile-sidebar-overlay {
            background: rgba(0, 0, 0, 0.32);
          }
          .mobile-sidebar {
            animation: ${isOpen ? 'slideIn' : 'slideOut'} 300ms cubic-bezier(0.4, 0, 0.2, 1);
          }
          @keyframes slideIn {
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
          }
          @keyframes slideOut {
            from { transform: translateX(0); }
            to { transform: translateX(-100%); }
          }
          .mobile-nav-item-1 { animation: navItemSlide 300ms cubic-bezier(0.4, 0, 0.2, 1) 160ms both; }
          .mobile-nav-item-2 { animation: navItemSlide 300ms cubic-bezier(0.4, 0, 0.2, 1) 210ms both; }
          .mobile-nav-item-3 { animation: navItemSlide 300ms cubic-bezier(0.4, 0, 0.2, 1) 260ms both; }
          .mobile-nav-item-4 { animation: navItemSlide 300ms cubic-bezier(0.4, 0, 0.2, 1) 310ms both; }
          @keyframes navItemSlide {
            from { opacity: 0; transform: translateX(-16px); }
            to { opacity: 1; transform: translateX(0); }
          }
        }
      `}</style>

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed md:relative inset-y-0 left-0 z-50 w-72 md:w-64 h-screen mobile-sidebar",
          "bg-[#F5F3F0] border-r border-[#EAE7E3]",
          "flex flex-col justify-between",
          "max-md:px-4 max-md:py-4 md:px-4 md:py-6",
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
          className="absolute top-4 right-4 md:hidden w-8 h-8 rounded-lg flex items-center justify-center hover:bg-black/[0.07] hover:rounded-full transition-all duration-200 hover:scale-110 hover:rotate-90 focus-visible:ring-2 focus-visible:ring-[#7C9EE8] focus-visible:outline-none"
          aria-label="Close navigation menu"
        >
          <X size={16} className="text-[#78716C]" />
        </button>

        <div>
          {/* User profile card */}
          <div className="mx-1 mb-6 p-3.5 bg-white md:bg-white max-md:bg-gradient-to-br max-md:from-[#ece9ff] max-md:to-[#f0eeff] rounded-2xl border border-[#EAE7E3] md:border-[#EAE7E3] max-md:border-[rgba(120,100,220,0.18)] shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-md transition-shadow duration-200 relative">
            <div className="flex items-start gap-3">
              {/* Avatar with gradient ring */}
              <div className="p-[2.5px] bg-gradient-to-br from-[#7C9EE8] to-[#F0A8C0] md:bg-gradient-to-br md:from-[#7C9EE8] md:to-[#F0A8C0] max-md:bg-gradient-to-br max-md:from-[#7c6dd8] max-md:to-[#a78bfa] rounded-2xl w-fit flex-shrink-0">
                {user?.avatarUrl ? (
                  <Image 
                    src={user.avatarUrl} 
                    alt={user.name} 
                    width={48} 
                    height={48} 
                    className="w-12 h-12 rounded-[14px] object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-[14px] bg-white flex items-center justify-center">
                    <span className="text-lg font-bold text-[#7C9EE8] font-[family-name:var(--font-display)]">
                      {user?.name?.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">

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

              {/* Mobile logout button */}
              <div className="md:hidden relative">
                <button
                  onClick={onLogout}
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center bg-transparent hover:bg-[rgba(255,77,77,0.10)] transition-all duration-200 group focus-visible:ring-2 focus-visible:ring-[#E04040] focus-visible:outline-none"
                  aria-label="Sign out"
                >
                  <Power size={16} className="text-[#78716C] group-hover:text-[#E04040] transition-colors" />
                </button>
                {showTooltip && (
                  <div className="absolute top-full mt-1 right-0 bg-[#1C1917] text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap z-10">
                    Sign Out
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section label */}
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#A8A29E] px-3 mb-2">
            Navigation
          </p>

          {/* Navigation */}
          <nav className="flex flex-col gap-1">
            {tabs.map(({ id, icon: Icon, label }, index) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => handleNavClick(id)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl md:rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#7C9EE8] focus-visible:outline-none",
                    isActive
                      ? "bg-white text-[#1C1917] font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-[#EAE7E3] relative before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-5 before:w-[3px] before:bg-[#7C9EE8] before:rounded-full md:bg-white md:text-[#1C1917] max-md:bg-[rgba(120,90,220,0.10)] max-md:text-[#5b3fcf] max-md:font-bold max-md:border-l-[3px] max-md:border-l-[#7c6dd8] max-md:rounded-l-none max-md:rounded-r-[10px] max-md:before:hidden"
                      : "text-[#78716C] hover:bg-white hover:text-[#1C1917] hover:shadow-sm md:hover:bg-white max-md:hover:bg-[rgba(120,90,220,0.06)] max-md:hover:translate-x-1",
                    `max-md:mobile-nav-item-${index + 1}`
                  )}
                >
                  <Icon 
                    size={17} 
                    strokeWidth={isActive ? 2 : 1.6} 
                    className={cn(
                      isActive ? "text-[#7C9EE8]" : "text-[#A8A29E]",
                      "max-md:group-hover:text-[#7c6dd8] transition-colors"
                    )} 
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
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl md:rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#7C9EE8] focus-visible:outline-none",
                  activeTab === "admin"
                    ? "bg-white text-[#1C1917] font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-[#EAE7E3] relative before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-5 before:w-[3px] before:bg-[#7C9EE8] before:rounded-full md:bg-white md:text-[#1C1917] max-md:bg-[rgba(120,90,220,0.10)] max-md:text-[#5b3fcf] max-md:font-bold max-md:border-l-[3px] max-md:border-l-[#7c6dd8] max-md:rounded-l-none max-md:rounded-r-[10px] max-md:before:hidden"
                    : "text-[#78716C] hover:bg-white hover:text-[#1C1917] hover:shadow-sm md:hover:bg-white max-md:hover:bg-[rgba(120,90,220,0.06)] max-md:hover:translate-x-1",
                  "max-md:mobile-nav-item-4"
                )}
              >
                <ShieldCheck 
                  size={17} 
                  strokeWidth={activeTab === "admin" ? 2 : 1.6} 
                  className={cn(
                    activeTab === "admin" ? "text-[#7C9EE8]" : "text-[#A8A29E]",
                    "max-md:group-hover:text-[#7c6dd8] transition-colors"
                  )} 
                />
                Admin
              </button>
            )}
          </nav>
        </div>

        {/* Logout button - hidden on mobile, shown on desktop */}
        <button
          onClick={onLogout}
          className="hidden md:flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#78716C] hover:bg-[#FFF0F3] hover:text-red-500 transition-all duration-150 group focus-visible:ring-2 focus-visible:ring-[#7C9EE8] focus-visible:outline-none"
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
