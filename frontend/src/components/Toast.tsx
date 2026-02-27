import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import { TIMEOUTS } from "@/config/messages";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

const toastStyles = {
  success: {
    icon: CheckCircle2,
    border: "border-green-500",
    bg: "bg-green-50",
    iconColor: "text-green-600",
    bar: "bg-green-500",
    defaultDuration: TIMEOUTS.SUCCESS_TOAST_DURATION,
  },
  error: {
    icon: AlertCircle,
    border: "border-red-500",
    bg: "bg-red-50",
    iconColor: "text-red-600",
    bar: "bg-red-500",
    defaultDuration: TIMEOUTS.TOAST_DURATION,
  },
  info: {
    icon: Info,
    border: "border-blue-500",
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
    bar: "bg-blue-500",
    defaultDuration: TIMEOUTS.TOAST_DURATION,
  },
  warning: {
    icon: AlertTriangle,
    border: "border-amber-500",
    bg: "bg-amber-50",
    iconColor: "text-amber-600",
    bar: "bg-amber-500",
    defaultDuration: TIMEOUTS.TOAST_DURATION,
  },
};

export const Toast = ({
  message,
  type = "success",
  onClose,
  duration
}: ToastProps) => {
  const [isExiting, setIsExiting] = useState(false);
  const style = toastStyles[type];
  const finalDuration = duration ?? style.defaultDuration;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 300);
    }, finalDuration);
    return () => clearTimeout(timer);
  }, [finalDuration, onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300);
  };

  const Icon = style.icon;

  return (
    <div className={`fixed top-4 left-4 right-4 sm:top-6 sm:right-6 sm:left-auto z-50 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${isExiting
      ? 'opacity-0 -translate-y-4 sm:translate-y-0 sm:translate-x-12 scale-95'
      : 'opacity-100 translate-y-0 sm:translate-x-0 scale-100'
      } ${type === 'error' && !isExiting ? 'animate-[shake_0.5s_cubic-bezier(.36,.07,.19,.97)_both]' : ''}`}>
      <div className={`relative bg-white/95 backdrop-blur-xl border border-neutral-200/50 border-l-4 ${style.border} rounded-xl sm:rounded-2xl shadow-[0_15px_20px_-5px_rgba(0,0,0,0.1),0_8px_8px_-4px_rgba(0,0,0,0.04)] ring-1 ring-black/5 p-2.5 sm:p-3 flex items-start gap-3 w-full sm:min-w-[300px] sm:max-w-[360px] overflow-hidden`}>
        <div className={`flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 ${style.bg} rounded-lg sm:rounded-xl flex items-center justify-center shadow-inner`}>
          <Icon size={18} className={`${style.iconColor} sm:hidden`} />
          <Icon size={20} className={`${style.iconColor} hidden sm:block`} />
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <p className="text-[10px] sm:text-[11px] font-bold text-neutral-900 leading-tight uppercase tracking-wider opacity-60">{type}</p>
          <p className="text-xs sm:text-[13px] font-medium text-neutral-600 mt-0.5 leading-snug break-words">{message}</p>
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1 sm:p-1.5 hover:bg-neutral-100 rounded-lg transition-all text-neutral-400 hover:text-neutral-950 group"
          aria-label="Close"
        >
          <X size={14} className="sm:hidden transition-transform group-hover:rotate-90" />
          <X size={16} className="hidden sm:block transition-transform group-hover:rotate-90" />
        </button>
        <div
          className={`absolute bottom-0 left-0 h-1 ${style.bar} opacity-40`}
          style={{
            width: '100%',
            animation: `shrink ${finalDuration}ms linear forwards`
          }}
        />
      </div>
    </div>
  );
};
