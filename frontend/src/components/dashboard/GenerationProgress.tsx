import { useEffect, useState } from "react";
import { Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface GenerationProgressProps {
  isGenerating: boolean;
}

const stages = [
  { id: 'analyzing', label: 'Analyzing job description', duration: 8000 },
  { id: 'matching', label: 'Matching your experience', duration: 12000 },
  { id: 'writing', label: 'Writing cover letter', duration: 18000 },
  { id: 'finalizing', label: 'Finalizing', duration: 7000 },
];

export function GenerationProgress({ isGenerating }: GenerationProgressProps) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    if (!isGenerating) {
      setCurrentStageIndex(0);
      return;
    }

    let elapsed = 0;
    const interval = setInterval(() => {
      elapsed += 1000;
      
      let cumulativeDuration = 0;
      for (let i = 0; i < stages.length; i++) {
        cumulativeDuration += stages[i].duration;
        if (elapsed < cumulativeDuration) {
          setCurrentStageIndex(i);
          break;
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isGenerating]);

  if (!isGenerating) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="rounded-2xl bg-white shadow-xl ring-1 ring-black/5 p-8 max-w-sm w-full animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-primary-50 flex items-center justify-center relative">
            <Sparkles className="w-8 h-8 text-primary animate-pulse" strokeWidth={2} />
            <div className="absolute inset-0 rounded-xl bg-primary/10 animate-ping" style={{ animationDuration: '2s' }} />
          </div>
          <h3 className="font-display text-lg font-semibold text-neutral-900 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
            Crafting your cover letter
          </h3>
          <p className="text-sm text-neutral-500 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
            This usually takes 30-45 seconds
          </p>
        </div>
        
        {/* Steps Card */}
        <div className="rounded-xl bg-neutral-50 p-4 space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          {stages.map((stage, i) => {
            const isActive = currentStageIndex === i;
            const isCompleted = currentStageIndex > i;
            const isPending = currentStageIndex < i;
            
            return (
              <div 
                key={stage.id} 
                className={cn(
                  "flex items-center gap-3 transition-all duration-500",
                  isActive && "scale-105"
                )}
              >
                {/* Circle Badge */}
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 flex-shrink-0",
                  isActive && "bg-primary text-white shadow-lg shadow-primary/30 scale-110 animate-pulse",
                  isCompleted && "bg-success text-white scale-100",
                  isPending && "border border-neutral-200 text-neutral-400 scale-90"
                )}>
                  {isCompleted ? (
                    <Check size={14} className="animate-in zoom-in duration-300" />
                  ) : (
                    i + 1
                  )}
                </div>
                
                {/* Label */}
                <span className={cn(
                  "text-sm transition-all duration-500 flex-1",
                  isActive && "font-medium text-neutral-900 translate-x-1",
                  isCompleted && "line-through text-neutral-400",
                  isPending && "text-neutral-400 opacity-60"
                )}>
                  {stage.label}
                </span>
                
                {/* Animated Badge (Active Only) */}
                {isActive && (
                  <span className="inline-flex gap-1 animate-in fade-in zoom-in duration-300">
                    <span 
                      className="w-2 h-2 rounded-full bg-primary animate-bounce" 
                      style={{ animationDelay: '0ms', animationDuration: '1s' }} 
                    />
                    <span 
                      className="w-2 h-2 rounded-full bg-primary animate-bounce" 
                      style={{ animationDelay: '200ms', animationDuration: '1s' }} 
                    />
                    <span 
                      className="w-2 h-2 rounded-full bg-primary animate-bounce" 
                      style={{ animationDelay: '400ms', animationDuration: '1s' }} 
                    />
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
