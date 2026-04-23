import { memo, useCallback } from "react";
import { Sparkles, Loader2, CheckCircle2, Bot, Mail } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { MESSAGES } from "@/config/messages";
import { truncateFilename } from "@/shared/utils/file-utils";
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
  if (isLoading) return <Skeleton className="h-20 w-full rounded-lg" />;

  const hasActiveCV = !!activeCV;

  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  return (
    <div className="space-y-4">
      <div className="fixed top-0 right-0 w-96 h-96 bg-primary/8 rounded-full blur-3xl pointer-events-none" />

      {!hasActiveCV && (
        <Alert
          variant="warning"
          icon={CheckCircle2}
          title={MESSAGES.NO_ACTIVE_CV}
          message={MESSAGES.NO_ACTIVE_CV_DESC}
          action={
            <Button onClick={onNavigateToCvs} size="sm" className="whitespace-nowrap">
              Upload
            </Button>
          }
        />
      )}

      {hasActiveCV && (
        <div className="px-3 py-1.5 rounded-lg bg-success-bg text-success text-xs font-medium border border-success/20 flex items-center gap-1.5 w-fit max-w-full">
          <CheckCircle2 size={12} className="flex-shrink-0" />
          <span className="truncate" title={activeCV.fileName}>
            {truncateFilename(activeCV.fileName, 50)}
          </span>
        </div>
      )}

      {!value && (
        <div className="mb-3 p-4 bg-primary-50 rounded-lg border border-primary/20">
          <p className="text-sm font-semibold text-primary mb-2">
            💡 What to paste:
          </p>
          <ul className="text-sm text-neutral-600 space-y-1">
            <li>• Full job posting from LinkedIn/Indeed</li>
            <li>• Job requirements section</li>
            <li>• Company description + role details</li>
          </ul>
        </div>
      )}

      <div className="relative">
        <textarea
          value={value}
          onChange={handleTextareaChange}
          placeholder="Paste job description here... (minimum 50 words for best results)"
          className="w-full h-80 p-6 rounded-lg bg-white border border-neutral-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none text-base leading-relaxed disabled:opacity-50 disabled:bg-neutral-100 shadow-sm font-body"
          disabled={!hasActiveCV}
          spellCheck={false}
        />
        <div className="absolute bottom-3 right-3 text-xs text-neutral-500">
          {value.length} characters
          {value.length > 0 && value.length < 50 && (
            <span className="text-warning ml-1">(need 50+ for best results)</span>
          )}
        </div>
      </div>

      <Button
        onClick={onGenerate}
        disabled={!value?.trim() || isGenerating || !hasActiveCV || value.length < 50}
        variant="primary"
        size="lg"
        className="w-full gap-3"
      >
        {!hasActiveCV ? (
          <>
            <CheckCircle2 size={18} />
            Upload CV First
          </>
        ) : isGenerating ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            <span className="hidden sm:inline">AI is Crafting Magic...</span>
            <span className="sm:hidden">Generating...</span>
          </>
        ) : (
          <>
            <Sparkles size={18} />
            <span className="hidden sm:inline">Generate Cover Letter</span>
            <span className="sm:hidden">Generate</span>
          </>
        )}
      </Button>

      <div className="grid grid-cols-3 gap-4 pt-2">
        {FEATURE_BADGES.map(({ label, icon: Icon }) => (
          <div key={label} className="flex flex-col sm:flex-row items-center gap-2 text-neutral-500 text-xs font-medium justify-center">
            <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
              <Icon size={14} className="text-primary" />
            </div>
            <span className="text-center sm:text-left">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

JobDescriptionInput.displayName = 'JobDescriptionInput';
