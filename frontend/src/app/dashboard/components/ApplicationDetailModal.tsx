import { memo } from "react";
import { Plus, FileText } from "lucide-react";
import type { Application } from "@/types";

interface ApplicationDetailModalProps {
  application: Application;
  onClose: () => void;
}

export const ApplicationDetailModal = memo(({ application, onClose }: ApplicationDetailModalProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
    <div className="w-full max-w-3xl bg-white border border-neutral-200 rounded-xl sm:rounded-2xl shadow-elevated flex flex-col max-h-[90vh] overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-neutral-200 flex items-start sm:items-center justify-between gap-3">
        <div className="space-y-1 flex-1 min-w-0">
          <h3 className="text-base sm:text-xl font-bold text-neutral-900 line-clamp-2">{application.subject}</h3>
          <p className="text-neutral-600 text-xs sm:text-sm truncate">To: {application.recruiterEmail}</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-neutral-100 transition-all flex-shrink-0"
          aria-label="Close modal"
        >
          <Plus className="rotate-45" size={20} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="space-y-2">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-primary">Cover Letter</span>
          <div className="bg-neutral-50 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-neutral-200 whitespace-pre-wrap text-sm sm:text-base leading-relaxed text-neutral-700">
            {application.coverLetter}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-neutral-50 border border-neutral-200">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-2">Used CV</span>
            <div className="flex items-center gap-2">
              <FileText className="text-primary flex-shrink-0" size={16} />
              <span className="font-medium text-xs sm:text-sm text-neutral-900 truncate">{application.cv?.fileName || "Unknown CV"}</span>
            </div>
          </div>
          <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-neutral-50 border border-neutral-200">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-2">Metadata</span>
            <div className="space-y-1 text-[10px] sm:text-xs text-neutral-600">
              <p className="truncate">Generated: {new Date(application.generatedAt).toLocaleDateString()}</p>
              <p>Status: <span className="text-primary font-medium">{application.status}</span></p>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6 border-t border-neutral-200 flex justify-end">
        <button
          onClick={onClose}
          className="px-5 sm:px-6 h-9 sm:h-10 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-all text-sm"
        >
          Done
        </button>
      </div>
    </div>
  </div>
));

ApplicationDetailModal.displayName = "ApplicationDetailModal";
