import { ToastContainer } from "@/components/ToastContainer";
import { ConfirmModal } from "@/components/ConfirmModal";
import { CVList } from "./CVList";
import { CVUploadZone } from "./CVUploadZone";
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

export const CVsTab = ({
  cvs,
  isLoading,
  isUpdating,
  archiveConfirm,
  onSetArchiveConfirm,
  onUpload,
  onSetActive,
  onSetArchived,
  success,
  onClearSuccess,
  error,
  onClearError,
}: CVsTabProps) => (
  <>
    <ToastContainer
      success={success}
      error={error}
      onClearSuccess={onClearSuccess}
      onClearError={onClearError}
    />
    <div className="space-y-6">
      <CVList
        cvs={cvs}
        isLoading={isLoading}
        isUpdating={isUpdating}
        onSetActive={onSetActive}
        onArchive={(id, name) => onSetArchiveConfirm({ id, name })}
      />
      <CVUploadZone onUpload={onUpload} />
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
