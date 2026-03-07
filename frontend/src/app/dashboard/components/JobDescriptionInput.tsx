import { memo, useCallback } from "react";
import { Sparkles, Loader2, CheckCircle2, Bot, Mail } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { MESSAGES } from "@/config/messages";
import { truncateFilename } from "@/utils/fileUtils";
import type { CV } from "@/types";

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  activeCV: CV | undefined;
  isLoading: boolean;
  isGenerating: boolean;
  onGenerate: () => void;
  onNavigateToCvs: () => void;
}

const FEATURE_BADGES = [
  { label: "AI Tailoring", icon: Bot },
  { label: "Grammar Check", icon: CheckCircle2 },
  { label: "Gmail Link", icon: Mail },
];

export const JobDescriptionInput = memo(({
  value,
  onChange,
  activeCV,
  isLoading,
  isGenerating,
  onGenerate,
  onNavigateToCvs,
}: JobDescriptionInputProps) => {
  if (isLoading) return <Skeleton className="h-20 w-full rounded-2xl" />;

  const hasActiveCV = !!activeCV;

  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  return (
    <div className="space-y-4">
      {/* Subtle gradient blob */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-[#7C9EE8]/10 rounded-full blur-3xl pointer-events-none" />

      {!hasActiveCV && (
        <Alert
          variant="warning"
          icon={CheckCircle2}
          title={MESSAGES.NO_ACTIVE_CV}
          message={MESSAGES.NO_ACTIVE_CV_DESC}
          action={
            <Button onClick={onNavigateToCvs} size="sm" className="whitespace-nowrap rounded-xl">
              Upload
            </Button>
          }
        />
      )}

      {hasActiveCV && (
        <div className="px-3 py-1.5 rounded-xl bg-[#DCFCE7] text-[#16A34A] text-xs font-medium border border-[#BBF7D0] flex items-center gap-1.5 w-fit max-w-full">
          <CheckCircle2 size={12} className="flex-shrink-0" />
          <span className="truncate" title={activeCV.fileName}>
            {truncateFilename(activeCV.fileName, 50)}
          </span>
        </div>
      )}

      <textarea
        value={value}
        onChange={handleTextareaChange}
        placeholder="Paste the job description here (e.g., from LinkedIn or Indeed)..."
        className="w-full h-80 p-6 rounded-2xl bg-white border border-[#EAE7E3] focus:ring-2 focus:ring-[#7C9EE8]/20 focus:border-[#7C9EE8] outline-none transition-all resize-none text-base leading-relaxed disabled:opacity-50 disabled:bg-[#F5F3F0] shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
        disabled={!hasActiveCV}
        spellCheck={false}
      />

      <Button
        onClick={onGenerate}
        disabled={!value?.trim() || isGenerating || !hasActiveCV}
        className="w-full h-12 gap-3 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
      >
        {isGenerating ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            <span className="hidden sm:inline">AI is Crafting Magic...</span>
            <span className="sm:hidden">Generating...</span>
          </>
        ) : (
          <>
            <Sparkles size={18} />
            <span className="hidden sm:inline">Generate Targeted Application</span>
            <span className="sm:hidden">Generate</span>
          </>
        )}
      </Button>

      <div className="grid grid-cols-3 gap-4 pt-2">
        {FEATURE_BADGES.map(({ label, icon: Icon }) => (
          <div key={label} className="flex flex-col sm:flex-row items-center gap-2 text-[#78716C] text-xs font-medium justify-center">
            <div className="w-8 h-8 rounded-xl bg-[#EEF3FD] flex items-center justify-center">
              <Icon size={14} className="text-[#7C9EE8]" />
            </div>
            <span className="text-center sm:text-left">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

JobDescriptionInput.displayName = 'JobDescriptionInput';
