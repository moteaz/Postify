import { cn } from "@/utils/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div className={cn(
      "p-5 rounded-xl bg-white border border-neutral-200",
      hover && "hover:shadow-card transition-all",
      className
    )}>
      {children}
    </div>
  );
}
