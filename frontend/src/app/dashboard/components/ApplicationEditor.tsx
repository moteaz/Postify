import { Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { truncateFilename } from "@/utils/fileUtils";
import type { GeneratedContent, CV } from "@/types";

interface ApplicationEditorProps {
  content: GeneratedContent;
  activeCV: CV | undefined;
  validation: {
    isEmailValid: boolean;
    isSubjectValid: boolean;
    canSend: boolean;
  };
  isSending: boolean;
  onContentChange: (content: GeneratedContent) => void;
  onSend: () => void;
  onDiscard: () => void;
}

export const ApplicationEditor = ({
  content,
  activeCV,
  validation,
  isSending,
  onContentChange,
  onSend,
  onDiscard,
}: ApplicationEditorProps) => {
  const { isEmailValid, isSubjectValid, canSend } = validation;

  return (
    <div className="space-y-4">
      {/* Subtle gradient blob */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-[#7C9EE8]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#1C1917]">Recruiter Email *</label>
          <Input
            type="email"
            value={content.recruiterEmail || ""}
            onChange={(e) => onContentChange({ ...content, recruiterEmail: e.target.value })}
            className={`rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] ${content.recruiterEmail && !isEmailValid ? "border-red-300 focus:ring-red-500/20" : ""}`}
            placeholder="recruiter@company.com"
          />
          {content.recruiterEmail && !isEmailValid && (
            <div className="flex items-center gap-1 text-red-600 text-xs">
              <AlertCircle size={12} />
              <span>Invalid email format</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#1C1917]">Subject Line *</label>
          <Input
            type="text"
            value={content.subject}
            onChange={(e) => onContentChange({ ...content, subject: e.target.value })}
            className={`rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] ${content.subject && !isSubjectValid ? "border-red-300 focus:ring-red-500/20" : ""}`}
            placeholder="Application for [Position]"
          />
          {content.subject && !isSubjectValid && (
            <div className="flex items-center gap-1 text-red-600 text-xs">
              <AlertCircle size={12} />
              <span>Subject cannot be empty</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-[#1C1917]">Tailored Cover Letter</label>
        <Textarea
          value={content.coverLetter}
          onChange={(e) => onContentChange({ ...content, coverLetter: e.target.value })}
          className="h-96 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
        />
      </div>

      {activeCV && (
        <Alert
          variant="info"
          icon={CheckCircle2}
          message={
            <>
              <span className="font-semibold" title={activeCV.fileName}>
                {truncateFilename(activeCV.fileName, 40)}
              </span>{" "}
              will be automatically attached when you send this application.
            </>
          }
        />
      )}

      <Alert
        variant="warning"
        icon={AlertCircle}
        message="Double-check the email address. If it doesn't exist, you'll receive a bounce-back notification in your Gmail inbox."
      />

      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={onDiscard} variant="outline" className="flex-1 rounded-xl">
          <span className="hidden sm:inline">Discard & Start Over</span>
          <span className="sm:hidden">Discard</span>
        </Button>
        <Button onClick={onSend} disabled={!canSend || isSending} className="flex-1 sm:flex-[2] gap-3 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
          {isSending ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              <span className="hidden sm:inline">Sending via Gmail...</span>
              <span className="sm:hidden">Sending...</span>
            </>
          ) : (
            <>
              <Send size={18} />
              <span className="hidden sm:inline">Send Application Now</span>
              <span className="sm:hidden">Send Now</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
