import { useState } from "react";
import { X, Upload, FileText, Send, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WelcomeModalProps {
  onComplete: () => void;
}

const steps = [
  {
    id: 1,
    icon: Upload,
    title: "Upload Your CV",
    description: "Start by uploading your resume. We'll use it to personalize your cover letters.",
    highlight: "cvs",
  },
  {
    id: 2,
    icon: FileText,
    title: "Paste Job Description",
    description: "Copy any job posting and paste it here. Our AI will analyze the requirements.",
    highlight: "new",
  },
  {
    id: 3,
    icon: Send,
    title: "Review & Send",
    description: "Edit your cover letter if needed, then send it directly via Gmail.",
    highlight: "send",
  },
];

export function WelcomeModal({ onComplete }: WelcomeModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-2 hover:bg-[#F5F3F0] rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Close"
        >
          <X size={20} className="text-[#78716C]" />
        </button>

        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#EEF3FD] to-[#FFF0F6] flex items-center justify-center">
            <Icon className="w-10 h-10 text-[#7C9EE8]" />
          </div>
          <h2 className="text-2xl font-bold text-[#1C1917] mb-2 font-[family-name:var(--font-display)]">
            {step.title}
          </h2>
          <p className="text-sm text-[#78716C] leading-relaxed">
            {step.description}
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div
              key={s.id}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === currentStep ? "w-8 bg-[#7C9EE8]" : "w-2 bg-[#EAE7E3]"
              )}
            />
          ))}
        </div>

        <div className="flex gap-3">
          {currentStep > 0 && (
            <Button
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex-1"
            >
              Back
            </Button>
          )}
          <Button
            variant="primary"
            onClick={handleNext}
            className="flex-1"
          >
            {currentStep === steps.length - 1 ? (
              <>
                <Check size={16} />
                Get Started
              </>
            ) : (
              "Next"
            )}
          </Button>
        </div>

        <button
          onClick={handleSkip}
          className="w-full mt-4 text-xs text-[#78716C] hover:text-[#1C1917] transition-colors min-h-[44px]"
        >
          Skip tutorial
        </button>
      </div>
    </div>
  );
}
