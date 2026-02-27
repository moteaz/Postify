import { X, AlertTriangle } from "lucide-react";
import { useFocusTrap } from "@/hooks/useFocusTrap";

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal = ({ 
  title, 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  onConfirm, 
  onCancel 
}: ConfirmModalProps) => {
  const modalRef = useFocusTrap(true);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div ref={modalRef} className="w-full max-w-md bg-white rounded-2xl shadow-elevated overflow-hidden">
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">{title}</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">{message}</p>
            </div>
            <button
              onClick={onCancel}
              className="p-1 rounded-lg hover:bg-neutral-100 transition-all flex-shrink-0"
              aria-label="Close"
            >
              <X size={20} className="text-neutral-400" />
            </button>
          </div>
        </div>
        <div className="px-6 pb-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-6 h-10 border border-neutral-300 text-neutral-700 rounded-lg font-semibold hover:bg-neutral-50 transition-all text-sm"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-6 h-10 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all text-sm"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
