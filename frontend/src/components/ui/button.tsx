import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// REDESIGNED: Rounded, soft shadow buttons with warm hover states
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary)]/90 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card)]",
        destructive: "bg-[var(--destructive)] text-white hover:bg-[var(--destructive)]/90 shadow-[var(--shadow-soft)]",
        outline: "border border-[var(--border)] bg-white hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)]",
        secondary: "bg-[var(--bg-muted)] text-[var(--text-primary)] hover:bg-[var(--bg-muted)]/80",
        ghost: "hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)]",
        link: "text-[var(--accent-primary)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-xl px-3",
        lg: "h-11 rounded-xl px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
