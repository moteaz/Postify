import { Loader2, History as HistoryIcon, ArrowRight, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import { cn } from "@/utils/cn";
import type { Application } from "@/types";

interface HistoryTabProps {
  history: Application[];
  isLoading: boolean;
  onViewDetails: (app: Application) => void;
  onCreateNew: () => void;
}

export const HistoryTab = ({ history, isLoading, onViewDetails, onCreateNew }: HistoryTabProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 sm:p-20 gap-4">
        <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-primary" />
        <p className="text-sm sm:text-base text-neutral-600">Loading your journey...</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center p-12 sm:p-20 space-y-3 sm:space-y-4 border-2 border-dashed border-neutral-200 rounded-xl sm:rounded-2xl bg-white">
        <HistoryIcon size={40} className="sm:w-12 sm:h-12 mx-auto text-neutral-300" />
        <h3 className="text-lg sm:text-xl font-semibold text-neutral-900">No Applications Yet</h3>
        <p className="text-sm sm:text-base text-neutral-600 px-4">Start by creating your first tailored application!</p>
        <button onClick={onCreateNew} className="text-primary font-semibold hover:underline flex items-center gap-2 mx-auto text-sm sm:text-base">
          Get Started <ArrowRight size={14} className="sm:w-4 sm:h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-2 sm:gap-3">
      {history.map((app) => (
        <div key={app.id} className="p-4 sm:p-5 rounded-lg sm:rounded-xl bg-white border border-neutral-200 hover:shadow-card transition-all group">
          <div className="flex items-start gap-3 sm:gap-4 mb-3">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
              app.status === "SENT" ? "bg-green-50 text-green-600" :
              app.status === "FAILED" ? "bg-red-50 text-red-600" : "bg-primary/10 text-primary"
            )}>
              {app.status === "SENT" ? <CheckCircle2 size={18} /> :
               app.status === "FAILED" ? <AlertCircle size={18} /> : <FileText size={18} />}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm sm:text-base text-neutral-900 mb-1 line-clamp-2">{app.subject || "No Subject"}</h4>
              <p className="text-xs sm:text-sm text-neutral-500 truncate mb-1">{app.recruiterEmail}</p>
              <p className="text-xs text-neutral-400">{new Date(app.generatedAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className={cn(
              "px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider",
              app.status === "SENT" ? "bg-green-50 text-green-700" :
              app.status === "FAILED" ? "bg-red-50 text-red-700" : "bg-primary/10 text-primary"
            )}>
              {app.status}
            </span>
            <button
              onClick={() => onViewDetails(app)}
              className="px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-all text-xs font-medium flex items-center gap-1.5"
            >
              View Details
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
