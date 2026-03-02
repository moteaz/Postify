import { FileText, Trash } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { truncateFilename, formatFileSize } from "@/utils/fileUtils";
import type { CV } from "@/types";

interface CVListProps {
  cvs: CV[];
  isLoading: boolean;
  isUpdating: boolean;
  onSetActive: (id: string) => void;
  onArchive: (id: string, name: string) => void;
}

export const CVList = ({ cvs, isLoading, isUpdating, onSetActive, onArchive }: CVListProps) => {
  if (isLoading) {
    return (
      <div className="grid gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-5 rounded-xl bg-white border border-neutral-200">
            <div className="flex items-center gap-4">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (cvs.length === 0) {
    return (
      <div className="text-center p-10 text-base text-neutral-500">
        No CVs found. Upload one to get started!
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {cvs.map((cv) => (
        <div
          key={cv.id}
          className="p-5 rounded-xl bg-white border border-neutral-200 flex items-center justify-between gap-4 hover:border-primary/30 transition-all"
        >
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <FileText size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-base text-neutral-900" title={cv.fileName}>
                {truncateFilename(cv.fileName, 45)}
              </h4>
              <p className="text-sm text-neutral-500">
                {formatFileSize(cv.fileSize)} • {new Date(cv.uploadedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {cv.isActive ? (
              <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold uppercase tracking-wider">
                Active
              </span>
            ) : (
              <Button
                size="sm"
                variant="outline"
                disabled={isUpdating}
                onClick={() => onSetActive(cv.id)}
              >
                Set Active
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onArchive(cv.id, cv.fileName)}
              className="text-red-600 hover:bg-red-50"
            >
              <Trash size={18} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
