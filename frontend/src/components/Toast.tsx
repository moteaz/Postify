import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import { TIMEOUTS } from "@/config/messages";
import { cn } from "@/lib/utils";

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
    border: "border-destructive",
    bg: "bg-destructive/10",
    iconColor: "text-destructive",
    bar: "bg-destructive",
    defaultDuration: TIMEOUTS.TOAST_DURATION,
  },
  info: {
    icon: Info,
    border: "border-primary",
    bg: "bg-primary/10",
    iconColor: "text-primary",
    bar: "bg-primary",
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
    <div className={cn(
      "fixed top-4 left-4 right-4 sm:top-6 sm:right-6 sm:left-auto z-50 transition-all duration-500",
      isExiting
        ? 'opacity-0 -translate-y-4 sm:translate-y-0 sm:translate-x-12 scale-95'
        : 'opacity-100 translate-y-0 sm:translate-x-0 scale-100',
      type === 'error' && !isExiting && 'animate-[shake_0.5s_cubic-bezier(.36,.07,.19,.97)_both]'
    )}>
      <div className={cn(
        "relative bg-card/95 backdrop-blur-xl border border-border border-l-4 rounded-xl shadow-lg ring-1 ring-border/50 p-3 flex items-start gap-3 w-full sm:min-w-[300px] sm:max-w-[360px] overflow-hidden",
        style.border
      )}>
        <div className={cn(
          "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center shadow-inner",
          style.bg
        )}>
          <Icon size={20} className={style.iconColor} />
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <p className="text-[11px] font-bold text-foreground leading-tight uppercase tracking-wider opacity-60">{type}</p>
          <p className="text-[13px] font-medium text-muted-foreground mt-0.5 leading-snug break-words">{message}</p>
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 p-2 hover:bg-accent rounded-lg transition-all text-muted-foreground hover:text-foreground group min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Close"
        >
          <X size={16} className="transition-transform group-hover:rotate-90" />
        </button>
        <div
          className={cn("absolute bottom-0 left-0 h-1 opacity-40", style.bar)}
          style={{
            width: '100%',
            animation: `shrink ${finalDuration}ms linear forwards`
          }}
        />
      </div>
    </div>
  );
};