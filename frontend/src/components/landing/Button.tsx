import Link from "next/link";
import { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps {
  href: string;
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary/90 shadow-md hover:shadow-lg",
  secondary: "border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50",
};

export default function Button({ href, variant = "primary", children, className = "" }: ButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center h-12 sm:h-12 px-6 sm:px-8 rounded-full font-semibold transition-all text-sm sm:text-base ${VARIANT_STYLES[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
