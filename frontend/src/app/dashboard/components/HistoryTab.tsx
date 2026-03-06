import { memo } from "react";
import { History as HistoryIcon, ArrowRight, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/Pagination";
import { cn } from "@/lib/utils";
import type { Application, PaginationMeta } from "@/types";

interface HistoryTabProps {
  history: Application[];
  isLoading: boolean;
  onViewDetails: (app: Application) => void;
  onCreateNew: () => void;
  pagination: PaginationMeta | null;
  onPageChange: (page: number) => void;
}

const HistoryTabComponent = ({ history, isLoading, onViewDetails, onCreateNew, pagination, onPageChange }: HistoryTabProps) => {
  if (isLoading) {
    return (
      <div className="grid gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-5 rounded-2xl bg-white border border-[#EAE7E3]">
            <div className="flex items-start gap-4 mb-3">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-8 w-28 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center p-20 space-y-4 border-2 border-dashed border-[#EAE7E3] rounded-2xl bg-white">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#F5F3F0] flex items-center justify-center">
          <HistoryIcon size={32} className="text-[#A8A29E]" />
        </div>
        <h3 className="text-xl font-semibold text-[#1C1917] font-[family-name:var(--font-display)]">No Applications Yet</h3>
        <p className="text-base text-[#78716C] px-4">Start by creating your first tailored application!</p>
        <button onClick={onCreateNew} className="text-[#7C9EE8] font-semibold hover:underline flex items-center gap-2 mx-auto text-base">
          Get Started <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 page-enter">
      {/* Subtle gradient blob */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-[#7C9EE8]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="grid gap-3">
        {history.map((app, index) => (
          <div 
            key={app.id} 
            className="p-5 rounded-2xl bg-white border border-[#EAE7E3] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
            style={{ animation: `fadeIn 350ms ease-out ${index * 50}ms both` }}
          >
            <div className="flex items-start gap-4 mb-3">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                app.status === "SENT" ? "bg-[#DCFCE7] text-[#16A34A]" :
                app.status === "FAILED" ? "bg-[#FFE4E6] text-[#E11D48]" : "bg-[#EEF3FD] text-[#7C9EE8]"
              )}>
                {app.status === "SENT" ? <CheckCircle2 size={18} /> :
                 app.status === "FAILED" ? <AlertCircle size={18} /> : <FileText size={18} />}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-base text-[#1C1917] mb-1 line-clamp-2">{app.subject || "No Subject"}</h4>
                <p className="text-sm text-[#78716C] truncate mb-1">{app.recruiterEmail}</p>
                <p className="text-xs text-[#A8A29E]">{new Date(app.generatedAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider",
                app.status === "SENT" ? "bg-[#DCFCE7] text-[#16A34A]" :
                app.status === "FAILED" ? "bg-[#FFE4E6] text-[#E11D48]" : "bg-[#EEF3FD] text-[#7C9EE8]"
              )}>
                {app.status}
              </span>
              <button
                onClick={() => onViewDetails(app)}
                className="px-4 py-2 rounded-xl bg-[#F5F3F0] hover:bg-[#7C9EE8] hover:text-white text-[#7C9EE8] transition-all text-xs font-medium flex items-center gap-1.5 active:scale-95"
              >
                View Details
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
      {pagination && <Pagination pagination={pagination} onPageChange={onPageChange} />}
    </div>
  );
};

export const HistoryTab = memo(HistoryTabComponent);

HistoryTab.displayName = "HistoryTab";
