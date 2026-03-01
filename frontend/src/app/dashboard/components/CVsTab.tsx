import { FileText, Trash , Upload } from "lucide-react";
import { Toast } from "@/components/Toast";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmModal } from "@/components/ConfirmModal";
import type { CV } from "@/types";

interface CVsTabProps {
  cvs: CV[];
  isLoading: boolean;
  isUpdating: boolean;
  archiveConfirm: { id: string; name: string } | null;
  onSetArchiveConfirm: (confirm: { id: string; name: string } | null) => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSetActive: (id: string) => void;
  onSetArchived: (id: string) => void;
  success: string | null;
  onClearSuccess: () => void;
  error: string | null;
  onClearError: () => void;
}

export const CVsTab = ({ cvs, isLoading, isUpdating, archiveConfirm, onSetArchiveConfirm, onUpload, onSetActive, onSetArchived, success, onClearSuccess, error, onClearError }: CVsTabProps) => (
  <>
    {success && <Toast message={success} onClose={onClearSuccess} />}
    {error && <Toast message={error} type="error" onClose={onClearError} />}
    <div className="space-y-4 sm:space-y-6">
      <div className="grid gap-2 sm:gap-3">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="p-3 sm:p-5 rounded-lg sm:rounded-xl bg-white border border-neutral-200">
              <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                <Skeleton className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </div>
          ))
        ) : cvs.length > 0 ? (
          cvs.map((cv) => (
            <div key={cv.id} className="p-3 sm:p-5 rounded-lg sm:rounded-xl bg-white border border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-primary/30 transition-all">
              <div className="flex items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <FileText size={16} className="sm:w-5 sm:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm sm:text-base text-neutral-900 truncate">{cv.fileName}</h4>
                  <p className="text-xs sm:text-sm text-neutral-500 truncate">{(cv.fileSize / 1024).toFixed(1)} KB • {new Date(cv.uploadedAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                {cv.isActive ? (
                  <span className="px-2 sm:px-3 py-1 rounded-full bg-green-50 text-green-700 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Active</span>
                ) : (
                  <button
                    disabled={isUpdating}
                    onClick={() => onSetActive(cv.id)}
                    className="px-2 sm:px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-600 text-[10px] sm:text-xs font-medium hover:text-primary hover:border-primary/50 transition-all disabled:opacity-50"
                  >
                    Set Active
                  </button>
                )}
                <button
                  onClick={() => onSetArchiveConfirm({ id: cv.id, name: cv.fileName })}
                  className="p-1.5 sm:p-2 rounded-lg text-red-600 hover:bg-red-50 transition-all"
                  aria-label="Remove CV"
                >
                  <Trash  size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-8 sm:p-10 text-sm sm:text-base text-neutral-500">
            No CVs found. Upload one to get started!
          </div>
        )}
      </div>

      <div className="p-8 sm:p-12 rounded-xl sm:rounded-2xl border-2 border-dashed border-neutral-300 bg-white flex flex-col items-center text-center space-y-3 sm:space-y-4 hover:border-primary/50 transition-all group">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
          <Upload size={24} className="sm:w-7 sm:h-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-semibold text-neutral-900">Upload Your CV</h3>
          <p className="text-neutral-600 text-xs sm:text-sm px-4">PDF or DOCX (max 5MB). AI will use it to tailor letters.</p>
        </div>
        <input
          type="file"
          id="cv-upload"
          className="hidden"
          accept=".pdf,.docx"
          onChange={onUpload}
        />
        <label
          htmlFor="cv-upload"
          className="h-10 px-5 sm:px-6 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-all cursor-pointer flex items-center justify-center text-sm"
        >
          Choose File
        </label>
      </div>
    </div>
    {archiveConfirm && (
      <ConfirmModal
        title="Remove CV"
        message={`Are you sure you want to remove "${archiveConfirm.name}"? It will be hidden from your list but not permanently deleted.`}
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={() => onSetArchived(archiveConfirm.id)}
        onCancel={() => onSetArchiveConfirm(null)}
      />
    )}
  </>
);
