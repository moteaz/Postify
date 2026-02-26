import { useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export const Toast = ({ message, onClose, duration = 3000 }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
      <div className="bg-white border border-green-200 rounded-xl shadow-lg p-4 flex items-center gap-3 min-w-[300px] max-w-md">
        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle2 size={18} className="text-green-600" />
        </div>
        <p className="flex-1 text-sm font-medium text-neutral-900">{message}</p>
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 hover:bg-neutral-100 rounded-lg transition-colors"
          aria-label="Close"
        >
          <X size={16} className="text-neutral-500" />
        </button>
      </div>
    </div>
  );
};
