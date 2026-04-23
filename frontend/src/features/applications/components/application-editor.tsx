import { memo, useCallback, useState } from "react";
import { Send, Loader2, CheckCircle2, AlertCircle, Edit2, Check, Mail, Upload, FileText } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { truncateFilename } from "@/shared/utils/file-utils";
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
  onNavigateToCvs?: () => void;
}

export const ApplicationEditor = memo(({
  content,
  activeCV,
  validation,
  isSending,
  onContentChange,
  onSend,
  onDiscard,
  onNavigateToCvs,
}: ApplicationEditorProps) => {
  const { isEmailValid, isSubjectValid, canSend } = validation;
  const [isEditingLetter, setIsEditingLetter] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    if (!email) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email address";
    }
    return null;
  };

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    onContentChange({ ...content, recruiterEmail: newEmail });
    setEmailError(validateEmail(newEmail));
  }, [content, onContentChange]);

  const handleSubjectChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onContentChange({ ...content, subject: e.target.value });
  }, [content, onContentChange]);

  const handleCoverLetterChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onContentChange({ ...content, coverLetter: e.target.value });
  }, [content, onContentChange]);

  return (
    <div className="space-y-4">
      <div className="fixed top-0 right-0 w-96 h-96 bg-primary/8 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700">Recipient Email *</label>
          <Input
            type="email"
            value={content.recruiterEmail || ""}
            onChange={handleEmailChange}
            onBlur={(e) => setEmailError(validateEmail(e.target.value))}
            error={!!emailError}
            icon={<Mail className="w-4 h-4" />}
            placeholder="recruiter@company.com"
          />
          {emailError && (
            <div className="flex items-center gap-1 text-error text-xs">
              <AlertCircle size={12} />
              <span>{emailError}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700">Subject Line *</label>
          <Input
            type="text"
            value={content.subject}
            onChange={handleSubjectChange}
            error={!!(content.subject && !isSubjectValid)}
            placeholder="Application for [Position]"
          />
          {content.subject && !isSubjectValid && (
            <div className="flex items-center gap-1 text-error text-xs">
              <AlertCircle size={12} />
              <span>Subject cannot be empty</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-neutral-700">Cover Letter</label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditingLetter(!isEditingLetter)}
            className="gap-2"
          >
            {isEditingLetter ? (
              <>
                <Check size={14} />
                Done Editing
              </>
            ) : (
              <>
                <Edit2 size={14} />
                Edit
              </>
            )}
          </Button>
        </div>
        {isEditingLetter ? (
          <Textarea
            value={content.coverLetter}
            onChange={handleCoverLetterChange}
            className="h-96 rounded-lg shadow-sm font-body text-sm"
            spellCheck={true}
          />
        ) : (
          <div className="p-6 bg-neutral-50 rounded-lg whitespace-pre-wrap text-sm leading-relaxed min-h-[384px] shadow-sm border border-neutral-200">
            {content.coverLetter}
          </div>
        )}
        {isEditingLetter && (
          <p className="text-xs text-neutral-500">
            💡 Tip: Keep it professional and proofread before sending
          </p>
        )}
      </div>

      {activeCV ? (
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-accent-50 to-primary-50 border border-accent-200/50 p-4 animate-in slide-in-from-bottom-2 duration-500">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-neutral-700">
                  <span className="font-semibold text-neutral-900" title={activeCV.fileName}>
                    {truncateFilename(activeCV.fileName, 40)}
                  </span>{" "}
                  will be automatically attached when you send this application.
                </p>
              </div>
            </div>
            {onNavigateToCvs && (
              <Button
                onClick={onNavigateToCvs}
                variant="ghost"
                size="sm"
                className="gap-2 hover:bg-white/80 transition-all duration-300 flex-shrink-0"
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">Change CV</span>
              </Button>
            )}
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl" />
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-warning-bg to-error-bg/30 border border-warning/30 p-4 animate-in slide-in-from-bottom-2 duration-500">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-warning" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-neutral-900 mb-1">No CV attached</p>
                <p className="text-xs text-neutral-600">Upload your CV to send this application</p>
              </div>
            </div>
            {onNavigateToCvs && (
              <Button
                onClick={onNavigateToCvs}
                variant="secondary"
                size="sm"
                className="gap-2 shadow-sm hover:shadow-md transition-all duration-300 flex-shrink-0"
              >
                <Upload className="w-4 h-4" />
                <span className="text-sm font-semibold">Upload CV</span>
              </Button>
            )}
          </div>
        </div>
      )}

      <Alert
        variant="warning"
        icon={AlertCircle}
        message="Double-check the email address. If it doesn't exist, you'll receive a bounce-back notification in your Gmail inbox."
      />

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button 
          onClick={onDiscard} 
          variant="outline" 
          size="lg"
          className="flex-1 group relative overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">
            <svg 
              className="w-4 h-4 transition-transform group-hover:rotate-180 duration-500" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="hidden sm:inline">Discard & Start Over</span>
            <span className="sm:hidden">Discard</span>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-100 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </Button>
        <Button 
          onClick={onSend} 
          disabled={!!emailError || !canSend || isSending} 
          variant="primary"
          size="lg"
          className="flex-1 sm:flex-[2] gap-3 group relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <span className="relative z-10 flex items-center gap-3">
            {isSending ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span className="hidden sm:inline">Sending via Gmail...</span>
                <span className="sm:hidden">Sending...</span>
              </>
            ) : (
              <>
                <Send size={18} className="transition-transform group-hover:translate-x-1 " />
                <span className="hidden sm:inline font-semibold">Send Application</span>
                <span className="sm:hidden">Send Now</span>
              </>
            )}
          </span>
          {!isSending && (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
});

ApplicationEditor.displayName = 'ApplicationEditor';
