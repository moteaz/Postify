import { Bot, CheckCircle2 } from "lucide-react";

const BENEFITS = [
  "20 AI generations / day",
  "Multiple CV management",
  "Auto-detect JD language",
  "Direct Gmail delivery",
];

export default function ValueProp() {
  return (
    <div className="hidden md:flex flex-col justify-between p-8 lg:p-12 bg-primary/5">
      <div className="space-y-4 lg:space-y-6">
        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-primary flex items-center justify-center text-white shadow-sm">
          <Bot size={20} className="lg:w-6 lg:h-6" />
        </div>
        <h2 className="text-xl lg:text-2xl font-bold text-neutral-900 leading-tight">
          Join the future of job hunting
        </h2>
        <ul className="space-y-3 lg:space-y-4">
          {BENEFITS.map((item, i) => (
            <li key={i} className="flex items-center gap-2 lg:gap-3 text-xs lg:text-sm text-neutral-600">
              <CheckCircle2 size={16} className="lg:w-[18px] lg:h-[18px] text-primary flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <p className="text-xs text-neutral-500 italic hidden lg:block">
        &ldquo;Applying used to take hours. Now it takes 30 seconds.&rdquo;
      </p>
    </div>
  );
}
