import { CheckCircle2, AlertCircle, Info, XCircle } from "lucide-react";
import { cn } from "@/utils/cn";

interface AlertProps {
  variant?: "success" | "error" | "warning" | "info";
  children: React.ReactNode;
  className?: string;
}

const icons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info
};

const styles = {
  success: "bg-green-50 border-green-200 text-green-700",
  error: "bg-red-50 border-red-200 text-red-700",
  warning: "bg-amber-50 border-amber-200 text-amber-700",
  info: "bg-blue-50 border-blue-200 text-blue-700"
};

export function Alert({ variant = "info", children, className }: AlertProps) {
  const Icon = icons[variant];

  return (
    <div className={cn("p-4 rounded-xl border flex items-center gap-3 text-sm", styles[variant], className)}>
      <Icon size={18} className="flex-shrink-0" />
      <span className="font-medium">{children}</span>
    </div>
  );
}
