import { Bot } from "lucide-react";

interface BrandingProps {
  title: string;
  subtitle: string;
}

export default function Branding({ title, subtitle }: BrandingProps) {
  return (
    <div className="flex flex-col items-center mb-6 sm:mb-8 space-y-3 sm:space-y-4">
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-primary flex items-center justify-center text-white shadow-md">
        <Bot size={28} className="sm:w-8 sm:h-8" />
      </div>
      <div className="text-center space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">{title}</h1>
        <p className="text-sm sm:text-base text-neutral-600">{subtitle}</p>
      </div>
    </div>
  );
}
