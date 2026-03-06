import { memo } from "react";
import { FileText, Trash, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { truncateFilename, formatFileSize } from "@/utils/fileUtils";
import type { CV } from "@/types";

interface CVListProps {
  cvs: CV[];
  isLoading: boolean;
  isUpdating: boolean;
  updatingCvId?: string;
  onSetActive: (id: string) => void;
  onArchive: (id: string, name: string) => void;
}

// REDESIGNED: Rounded cards with soft hover effects and mobile-optimized layout
const CVListComponent = ({ cvs, isLoading, isUpdating, updatingCvId, onSetActive, onArchive }: CVListProps) => {
  if (isLoading) {
    return (
      <div className="grid gap-3 sm:gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 sm:p-6 rounded-2xl bg-white border border-[var(--border)]">
            <div className="flex items-center gap-3 sm:gap-4">
              <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (cvs.length === 0) {
    return (
      <div className="text-center p-8 sm:p-12 text-sm sm:text-base text-[var(--text-secondary)]">
        No CVs found. Upload one to get started!
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:gap-4">
      {cvs.map((cv) => (
        <div
          key={cv.id}
          className="p-4 sm:p-6 rounded-2xl bg-white border border-[var(--border)] shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card)] hover:-translate-y-0.5 transition-all duration-200"
        >
          {/* Mobile: Stack layout */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] flex items-center justify-center flex-shrink-0">
                <FileText size={18} className="sm:w-5 sm:h-5" strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm sm:text-base text-[var(--text-primary)] line-clamp-1" title={cv.fileName}>
                  {truncateFilename(cv.fileName, 35)}
                </h4>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
                  {formatFileSize(cv.fileSize)} • {new Date(cv.uploadedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            {/* Mobile: Full-width buttons */}
            <div className="flex items-center gap-2 sm:gap-2">
              {cv.isActive ? (
                <span className="flex-1 sm:flex-none text-center px-3 py-1.5 sm:py-1 rounded-full bg-[#DCFCE7] text-[#16A34A] text-xs font-medium uppercase tracking-wider">
                  Active
                </span>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isUpdating}
                  onClick={() => onSetActive(cv.id)}
                  className="flex-1 sm:flex-none rounded-xl h-9 text-xs sm:text-sm"
                >
                  {isUpdating && updatingCvId === cv.id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    "Set Active"
                  )}
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onArchive(cv.id, cv.fileName)}
                disabled={isUpdating && updatingCvId === cv.id}
                className="text-[var(--destructive)] hover:bg-red-50 rounded-xl h-9 w-9 p-0"
              >
                {isUpdating && updatingCvId === cv.id ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trash size={16} className="sm:w-[18px] sm:h-[18px]" strokeWidth={1.5} />
                )}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const CVList = memo(CVListComponent);

CVList.displayName = "CVList";
