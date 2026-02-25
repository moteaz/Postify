import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="group p-6 sm:p-8 rounded-xl sm:rounded-2xl border border-neutral-200 bg-white hover:shadow-card transition-all duration-300">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-2 sm:mb-3">{title}</h3>
      <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">{description}</p>
    </div>
  );
}
