import { memo, useMemo } from "react";
import { ToastContainer } from "@/components/ToastContainer";
import { useApplicationValidation } from "@/hooks/useApplicationValidation";
import { GenerationProgress } from "@/components/dashboard/GenerationProgress";
import { JobDescriptionInput } from "./JobDescriptionInput";
import { ApplicationEditor } from "./ApplicationEditor";
import type { GeneratedContent, CV } from "@/types";

interface NewApplicationTabProps {
  jobDescription: string;
  onJobDescriptionChange: (value: string) => void;
  generatedContent: GeneratedContent | null;
  onGeneratedContentChange: (content: GeneratedContent) => void;
  isGenerating: boolean;
  isSending: boolean;
  onGenerate: () => void;
  onSend: () => void;
  onDiscard: () => void;
  success: string | null;
  onClearSuccess: () => void;
  error: string | null;
  onClearError: () => void;
  cvs: CV[];
  isLoadingCvs: boolean;
  onNavigateToCvs: () => void;
}

export const NewApplicationTab = memo((props: NewApplicationTabProps) => {
  const {
    jobDescription,
    onJobDescriptionChange,
    generatedContent,
    onGeneratedContentChange,
    isGenerating,
    isSending,
    onGenerate,
    onSend,
    onDiscard,
    success,
    onClearSuccess,
    error,
    onClearError,
    cvs,
    isLoadingCvs,
    onNavigateToCvs,
  } = props;

  const activeCV = useMemo(() => cvs.find((cv) => cv.isActive), [cvs]);
  const validation = useApplicationValidation(generatedContent);

  return (
    <>
      <GenerationProgress isGenerating={isGenerating} />
      <ToastContainer
        success={success}
        error={error}
        onClearSuccess={onClearSuccess}
        onClearError={onClearError}
      />
      <div className="space-y-6 page-enter">
        {generatedContent ? (
          <ApplicationEditor
            content={generatedContent}
            activeCV={activeCV}
            validation={validation}
            isSending={isSending}
            onContentChange={onGeneratedContentChange}
            onSend={onSend}
            onDiscard={onDiscard}
          />
        ) : (
          <JobDescriptionInput
            value={jobDescription}
            onChange={onJobDescriptionChange}
            activeCV={activeCV}
            isLoading={isLoadingCvs}
            isGenerating={isGenerating}
            onGenerate={onGenerate}
            onNavigateToCvs={onNavigateToCvs}
          />
        )}
      </div>
    </>
  );
});

NewApplicationTab.displayName = 'NewApplicationTab';
