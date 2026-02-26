import { useEffect, useState } from "react";
import { AlertCircle, X } from "lucide-react";
import { TIMEOUTS } from "@/config/messages";

interface ErrorToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export const ErrorToast = ({ message, onClose, duration = TIMEOUTS.TOAST_DURATION }: ErrorToastProps) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300);
  };

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
      isExiting ? 'opacity-0 translate-x-[400px]' : 'opacity-100 translate-x-0'
    }`}>
      <div className="relative bg-white border-l-4 border-red-500 rounded-2xl shadow-xl ring-1 ring-black/5 p-4 flex items-start gap-3 min-w-[320px] max-w-md overflow-hidden">
        <div className="flex-shrink-0 w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
          <AlertCircle size={20} className="text-red-600" />
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <p className="text-sm font-semibold text-neutral-900 leading-tight">{message}</p>
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1.5 hover:bg-neutral-100 rounded-full transition-all text-neutral-400 hover:text-neutral-600"
          aria-label="Close"
        >
          <X size={16} />
        </button>
        <div className="absolute bottom-0 left-0 h-1 bg-red-500 animate-[shrink_5s_linear_forwards]" style={{ width: '100%' }} />
      </div>
    </div>
  );
};
