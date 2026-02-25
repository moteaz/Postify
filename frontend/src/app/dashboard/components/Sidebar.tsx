import { memo } from "react";
import { Bot, Plus, History, FileText, LogOut } from "lucide-react";
import { cn } from "@/utils/cn";
import type { User } from "@/types";

interface SidebarProps {
  user: User | null;
  activeTab: "new" | "history" | "cvs";
  onTabChange: (tab: "new" | "history" | "cvs") => void;
  onLogout: () => void;
}

const tabs = [
  { id: "new" as const, icon: Plus, label: "New Application", shortLabel: "New" },
  { id: "history" as const, icon: History, label: "History", shortLabel: "History" },
  { id: "cvs" as const, icon: FileText, label: "My CVs", shortLabel: "CVs" },
];

export const Sidebar = memo(({ user, activeTab, onTabChange, onLogout }: SidebarProps) => (
  <aside className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-neutral-200 bg-white flex flex-col">
    <div className="p-4 sm:p-6 flex items-center justify-between lg:justify-start gap-2 border-b border-neutral-200">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
          <Bot size={20} />
        </div>
        <span className="font-bold text-base sm:text-lg text-neutral-900">Postify</span>
      </div>
      <button
        onClick={onLogout}
        className="lg:hidden p-2 rounded-lg text-neutral-600 hover:bg-red-50 hover:text-red-600 transition-all"
        aria-label="Logout"
      >
        <LogOut size={20} />
      </button>
    </div>

    <div className="hidden lg:flex p-4 border-b border-neutral-200 items-center gap-3 bg-gradient-to-r from-primary/5 to-transparent">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
        {user?.avatarUrl ? (
          <img src={user.avatarUrl} alt={user.name} className="rounded-full w-full h-full object-cover" />
        ) : (
          <span className="text-base font-bold text-white">{user?.name?.charAt(0)}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-neutral-900 truncate">{user?.name}</p>
        <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
      </div>
    </div>

    <nav className="flex lg:flex-col flex-1 p-2 sm:p-4 space-y-0 lg:space-y-1 overflow-x-auto lg:overflow-x-visible">
      <div className="flex lg:flex-col gap-1 min-w-max lg:min-w-0 w-full">
        {tabs.map(({ id, icon: Icon, label, shortLabel }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={cn(
              "flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-all text-xs sm:text-sm font-medium whitespace-nowrap",
              activeTab === id ? "bg-primary text-white" : "text-neutral-600 hover:bg-neutral-100"
            )}
          >
            <Icon size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{shortLabel}</span>
          </button>
        ))}
      </div>
    </nav>

    <div className="hidden lg:flex p-4 border-t border-neutral-200">
      <button
        onClick={onLogout}
        className="w-full h-10 flex items-center justify-center gap-2 rounded-lg text-neutral-600 hover:bg-red-50 hover:text-red-600 transition-all text-sm font-medium"
      >
        <LogOut size={16} />
        Logout
      </button>
    </div>
  </aside>
));

Sidebar.displayName = "Sidebar";
