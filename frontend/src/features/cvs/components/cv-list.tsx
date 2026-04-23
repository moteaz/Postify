import { memo, useState } from "react";
import { FileText, Trash, Loader2, Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { truncateFilename, formatFileSize } from "@/shared/utils/file-utils";
import type { CV } from "@/types";

interface CVListProps {
  cvs: CV[];
  isLoading: boolean;
  isUpdating: boolean;
  updatingCvId?: string;
  onSetActive: (id: string) => void;
  onArchive: (id: string, name: string) => void;
}

const CVListComponent = ({ cvs, isLoading, isUpdating, updatingCvId, onSetActive, onArchive }: CVListProps) => {
  const [justActivatedId, setJustActivatedId] = useState<string | null>(null);

  const handleSetActive = (id: string) => {
    onSetActive(id);
    setJustActivatedId(id);
    setTimeout(() => setJustActivatedId(null), 1000);
  };

  if (isLoading) {
    return (
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-5 sm:p-6 rounded-2xl bg-white border border-gray-200">
            <div className="flex items-center gap-4">
              <Skeleton className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl" />
              <div className="flex-1 space-y-2.5">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-3.5 w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (cvs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 sm:p-16 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <FileText size={32} className="text-gray-400" strokeWidth={1.5} />
        </div>
        <p className="text-base text-gray-500 font-medium">No CVs found</p>
        <p className="text-sm text-gray-400 mt-1">Upload one to get started!</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes cardPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
          50% { transform: scale(1.02); box-shadow: 0 8px 20px rgba(99,102,241,0.15); }
        }
        @keyframes checkPop {
          0% { transform: scale(0) rotate(-45deg); opacity: 0; }
          50% { transform: scale(1.2) rotate(0deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .card-pulse { animation: cardPulse 0.6s ease-out; }
        .check-pop { animation: checkPop 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
      `}</style>
      <div className="grid gap-4">
        {cvs.map((cv) => (
          <div
            key={cv.id}
            className={`relative p-5 sm:p-6 rounded-2xl bg-white border transition-all duration-300 ${
              cv.isActive
                ? 'border-indigo-300 shadow-lg shadow-indigo-100/50 border-l-4 border-l-indigo-500'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-xl hover:-translate-y-1'
            } ${justActivatedId === cv.id ? 'card-pulse' : ''}`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  cv.isActive
                    ? 'bg-indigo-100 text-indigo-600 shadow-md'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <FileText size={24} className="sm:w-7 sm:h-7" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-base sm:text-lg text-gray-900 line-clamp-1" title={cv.fileName}>
                    {truncateFilename(cv.fileName, 35)}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    {formatFileSize(cv.fileSize)} • {new Date(cv.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {cv.isActive ? (
                  <div className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 shadow-sm">
                    <Check size={16} className={`text-emerald-600 ${justActivatedId === cv.id ? 'check-pop' : ''}`} strokeWidth={2.5} />
                    <span className="text-sm font-semibold text-emerald-700 tracking-wide">Active</span>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isUpdating}
                    onClick={() => handleSetActive(cv.id)}
                    className="flex-1 sm:flex-none rounded-xl h-10 px-5 text-sm font-medium border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200"
                  >
                    {isUpdating && updatingCvId === cv.id ? (
                      <>
                        <Loader2 size={16} className="animate-spin mr-2" />
                        <span>Activating...</span>
                      </>
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
                  className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl h-10 w-10 p-0 transition-all duration-200"
                >
                  <Trash size={18} strokeWidth={1.5} />
                </Button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </>
  );
};

export const CVList = memo(CVListComponent);

CVList.displayName = "CVList";
