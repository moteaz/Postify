import { memo } from "react";
import { Plus, History, FileText, LogOut, Shield, X } from "lucide-react";
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
  { id: "new" as const, icon: Plus, label: "New Application" },
  { id: "history" as const, icon: History, label: "History" },
  { id: "cvs" as const, icon: FileText, label: "My CVs" },
];

// REDESIGNED: Soft, airy sidebar with mobile drawer
export const Sidebar = memo(({ user, activeTab, onTabChange, onLogout, isOpen, onClose }: SidebarProps) => {
  const { canAccessAdmin } = usePermissions();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-[var(--bg-muted)] shadow-[1px_0_0_var(--border)] flex flex-col transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 rounded-xl text-[var(--text-secondary)] hover:bg-white/60 transition-all"
          aria-label="Close menu"
        >
          <X size={20} strokeWidth={1.5} />
        </button>

        {/* User profile */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center shadow-[var(--shadow-soft)] overflow-hidden">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-base font-bold text-white font-[family-name:var(--font-display)]">{user?.name?.charAt(0)}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[var(--text-primary)] truncate font-[family-name:var(--font-display)]">{user?.name}</p>
            <p className="text-xs text-[var(--text-muted)] truncate">{user?.email}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {tabs.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-150 text-sm font-medium",
                activeTab === id 
                  ? "bg-white shadow-[var(--shadow-soft)] text-[var(--text-primary)]" 
                  : "text-[var(--text-secondary)] hover:bg-white/60"
              )}
            >
              <Icon size={18} strokeWidth={1.5} />
              {label}
            </button>
          ))}
          {canAccessAdmin && (
            <button
              onClick={() => onTabChange("admin")}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-150 text-sm font-medium",
                activeTab === "admin" 
                  ? "bg-white shadow-[var(--shadow-soft)] text-[var(--text-primary)]" 
                  : "text-[var(--text-secondary)] hover:bg-white/60"
              )}
            >
              <Shield size={18} strokeWidth={1.5} />
              Admin
            </button>
          )}
        </nav>

        {/* Logout button */}
        <div className="p-4">
          <button
            onClick={onLogout}
            className="w-full h-10 flex items-center justify-center gap-2 rounded-xl text-[var(--text-secondary)] hover:bg-white/60 hover:text-[var(--destructive)] transition-all duration-150 text-sm font-medium"
          >
            <LogOut size={16} strokeWidth={1.5} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
});

Sidebar.displayName = "Sidebar";
