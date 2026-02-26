import { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import { TIMEOUTS } from "@/config/messages";

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export const Toast = ({ message, onClose, duration = TIMEOUTS.SUCCESS_TOAST_DURATION }: ToastProps) => {
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
      <div className="relative bg-white border-l-4 border-green-500 rounded-2xl shadow-xl ring-1 ring-black/5 p-4 flex items-start gap-3 min-w-[320px] max-w-md overflow-hidden">
        <div className="flex-shrink-0 w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
          <CheckCircle2 size={20} className="text-green-600" />
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
        <div className="absolute bottom-0 left-0 h-1 bg-green-500 animate-[shrink_3s_linear_forwards]" style={{ width: '100%' }} />
      </div>
    </div>
  );
};
