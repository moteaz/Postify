import { Check } from "lucide-react";

interface TermsCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  hasError: boolean;
}

export default function TermsCheckbox({ checked, onChange, hasError }: TermsCheckboxProps) {
  return (
    <div className="space-y-2">
      <label className="flex items-start gap-3 cursor-pointer group">
        <div className="relative">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="peer sr-only"
          />
          <div className={`relative mt-0.5 w-5 h-5 rounded-lg flex-shrink-0 border-2 bg-white group-hover:border-[#7C9EE8] transition-all duration-150 flex items-center justify-center ${
            hasError ? "border-red-300 bg-red-50 animate-shake" : checked ? "bg-[#7C9EE8] border-[#7C9EE8]" : "border-[#EAE7E3]"
          }`}>
            <Check size={12} className={`text-white transition-opacity duration-150 ${checked ? "opacity-100" : "opacity-0"}`} />
          </div>
        </div>

        <span className="text-xs text-[#78716C] leading-relaxed">
          I agree to Postify's{" "}
          <a href="/terms" className="text-[#7C9EE8] hover:underline font-medium">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-[#7C9EE8] hover:underline font-medium">
            Privacy Policy
          </a>
        </span>
      </label>

      {hasError && (
        <p className="text-xs text-red-400 ml-8">Please accept the terms to continue</p>
      )}
    </div>
  );
}
