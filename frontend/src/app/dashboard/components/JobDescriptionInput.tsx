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

export const JobDescriptionInput = ({
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

  return (
    <div className="space-y-4">
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
        <div className="px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-medium border border-green-200 flex items-center gap-1.5 w-fit max-w-full">
          <CheckCircle2 size={12} className="flex-shrink-0" />
          <span className="truncate" title={activeCV.fileName}>
            {truncateFilename(activeCV.fileName, 50)}
          </span>
        </div>
      )}

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the job description here (e.g., from LinkedIn or Indeed)..."
        className="w-full h-80 p-6 rounded-xl bg-white border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none text-base leading-relaxed disabled:opacity-50 disabled:bg-neutral-50"
        disabled={!hasActiveCV}
      />

      <Button
        onClick={onGenerate}
        disabled={!value.trim() || isGenerating || !hasActiveCV}
        className="w-full h-12 gap-3"
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
          <div key={label} className="flex flex-col sm:flex-row items-center gap-2 text-neutral-500 text-xs font-medium justify-center">
            <Icon size={14} />
            <span className="text-center">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
