import { ReactNode } from "react";

interface LegalSectionProps {
  id: string;
  title: string;
  children: ReactNode;
}

export function LegalSection({ id, title, children }: LegalSectionProps) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-2xl font-bold text-[#1C1917] mb-4 font-[family-name:var(--font-display)]">
        {title}
      </h2>
      <div className="text-[#78716C] leading-relaxed space-y-4">
        {children}
      </div>
    </section>
  );
}
