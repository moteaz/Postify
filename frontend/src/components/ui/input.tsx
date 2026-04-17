import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  success?: boolean;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, success, icon, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-11 w-full rounded-md border bg-white px-4 py-2",
            "font-body text-base text-neutral-900 placeholder:text-neutral-400",
            "transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-offset-1",
            !error && !success && [
              "border-neutral-200",
              "focus:border-primary focus:ring-primary/20",
            ],
            error && [
              "border-error bg-error-bg/30",
              "focus:border-error focus:ring-error/20",
            ],
            success && [
              "border-success bg-success-bg/30",
              "focus:border-success focus:ring-success/20",
            ],
            icon && "pl-10",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-100",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
