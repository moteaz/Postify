import { type LucideIcon } from "lucide-react";
import { type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "flex items-start gap-3 p-4 rounded-lg border",
  {
    variants: {
      variant: {
        info: "bg-blue-50 border-blue-200",
        warning: "bg-amber-50 border-amber-200",
        success: "bg-green-50 border-green-200",
        error: "bg-red-50 border-red-200",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

const iconVariants = {
  info: "text-blue-600",
  warning: "text-amber-600",
  success: "text-green-600",
  error: "text-red-600",
};

const textVariants = {
  info: "text-blue-700",
  warning: "text-amber-700",
  success: "text-green-700",
  error: "text-red-700",
};

const titleVariants = {
  info: "text-blue-900",
  warning: "text-amber-900",
  success: "text-green-900",
  error: "text-red-900",
};

interface AlertProps extends VariantProps<typeof alertVariants> {
  icon: LucideIcon;
  title?: string;
  message: ReactNode;
  action?: ReactNode;
  className?: string;
}

export const Alert = ({ icon: Icon, title, message, action, variant = "info", className }: AlertProps) => (
  <div className={cn(alertVariants({ variant }), className)}>
    <Icon className={cn("flex-shrink-0 mt-0.5", iconVariants[variant!])} size={18} />
    <div className="flex-1">
      {title && <h4 className={cn("font-semibold text-sm mb-0.5", titleVariants[variant!])}>{title}</h4>}
      <p className={cn("text-xs", textVariants[variant!])}>{message}</p>
    </div>
    {action}
  </div>
);
