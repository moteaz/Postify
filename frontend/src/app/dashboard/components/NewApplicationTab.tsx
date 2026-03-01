import { Sparkles, Send, Loader2, CheckCircle2, Bot, Mail, AlertCircle } from "lucide-react";
import { Toast } from "@/components/Toast";
import { Skeleton } from "@/components/ui/skeleton";
import { MESSAGES, VALIDATION } from "@/config/messages";
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

const badges = [
  { label: "AI Tailoring", icon: Bot },
  { label: "Grammar Check", icon: CheckCircle2 },
  { label: "Gmail Link", icon: Mail },
];

export const NewApplicationTab = ({
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
}: NewApplicationTabProps) => {
  const activeCV = cvs.find(c => c.isActive);
  const hasActiveCV = !isLoadingCvs && activeCV;

  // Validation
  const isEmailValid = generatedContent?.recruiterEmail ? VALIDATION.EMAIL_REGEX.test(generatedContent.recruiterEmail) : false;
  const isSubjectValid = generatedContent?.subject ? generatedContent.subject.trim().length > 0 : false;
  const canSend = isEmailValid && isSubjectValid && !isSending;

  return (
    <>
      {success && <Toast message={success} onClose={onClearSuccess} />}
      {error && <Toast message={error} type="error" onClose={onClearError} />}
      <div className="space-y-4 sm:space-y-6">

        {!generatedContent ? (
          <div className="space-y-4 sm:space-y-6">
            {isLoadingCvs ? (
              <Skeleton className="h-20 w-full rounded-lg" />
            ) : !hasActiveCV ? (
              <div className="p-4 sm:p-6 rounded-lg sm:rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-start gap-3 sm:gap-4">
                  <CheckCircle2 className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
                  <div>
                    <h4 className="font-semibold text-amber-900 text-sm sm:text-base">{MESSAGES.NO_ACTIVE_CV}</h4>
                    <p className="text-amber-700 text-xs sm:text-sm mt-0.5">{MESSAGES.NO_ACTIVE_CV_DESC}</p>
                  </div>
                </div>
                <button
                  onClick={onNavigateToCvs}
                  className="w-full sm:w-auto px-4 sm:px-5 h-9 sm:h-10 bg-amber-600 text-white rounded-lg font-medium text-xs sm:text-sm hover:bg-amber-700 transition-all whitespace-nowrap"
                >
                  Fix Now
                </button>
              </div>
            ) : null}

            <div className="space-y-2">
              {hasActiveCV && (
                <div className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg bg-green-50 text-green-700 text-[10px] sm:text-xs font-medium border border-green-200 flex items-center gap-1 sm:gap-1.5 w-fit">
                  <CheckCircle2 size={10} className="sm:w-3 sm:h-3 flex-shrink-0" />
                  <span className="truncate">{activeCV.fileName}</span>
                </div>
              )}
              <textarea
                value={jobDescription}
                onChange={(e) => onJobDescriptionChange(e.target.value)}
                placeholder="Paste the job description here (e.g., from LinkedIn or Indeed)..."
                className="w-full h-64 sm:h-80 p-4 sm:p-6 rounded-lg sm:rounded-xl bg-white border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none text-sm sm:text-base leading-relaxed disabled:opacity-50 disabled:bg-neutral-50"
                disabled={!hasActiveCV}
              />
            </div>

            <button
              onClick={onGenerate}
              disabled={!jobDescription.trim() || isGenerating || !hasActiveCV}
              className="w-full h-11 sm:h-12 bg-primary text-white rounded-lg sm:rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
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
            </button>

            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-2">
              {badges.map(({ label, icon: Icon }, i) => (
                <div key={i} className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-neutral-500 text-[10px] sm:text-xs font-medium justify-center">
                  <Icon size={14} className="sm:w-4 sm:h-4" />
                  <span className="text-center">{label}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-neutral-700">Recruiter Email *</label>
                <input
                  type="email"
                  value={generatedContent.recruiterEmail || ""}
                  onChange={(e) => onGeneratedContentChange({ ...generatedContent, recruiterEmail: e.target.value })}
                  className={`w-full p-2.5 sm:p-3 rounded-lg bg-white border outline-none text-sm transition-all ${generatedContent.recruiterEmail && !isEmailValid
                    ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                    : 'border-neutral-300 focus:ring-2 focus:ring-primary focus:border-primary'
                    }`}
                  placeholder="recruiter@company.com"
                />
                {generatedContent.recruiterEmail && !isEmailValid && (
                  <div className="flex items-center gap-1 text-red-600 text-xs">
                    <AlertCircle size={12} />
                    <span>Invalid email format</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-neutral-700">Subject Line *</label>
                <input
                  type="text"
                  value={generatedContent.subject}
                  onChange={(e) => onGeneratedContentChange({ ...generatedContent, subject: e.target.value })}
                  className={`w-full p-2.5 sm:p-3 rounded-lg bg-white border outline-none text-sm transition-all ${generatedContent.subject && !isSubjectValid
                    ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                    : 'border-neutral-300 focus:ring-2 focus:ring-primary focus:border-primary'
                    }`}
                  placeholder="Application for [Position]"
                />
                {generatedContent.subject && !isSubjectValid && (
                  <div className="flex items-center gap-1 text-red-600 text-xs">
                    <AlertCircle size={12} />
                    <span>Subject cannot be empty</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-semibold text-neutral-700">Tailored Cover Letter</label>
              <textarea
                value={generatedContent.coverLetter}
                onChange={(e) => onGeneratedContentChange({ ...generatedContent, coverLetter: e.target.value })}
                className="w-full h-64 sm:h-96 p-4 sm:p-6 rounded-lg sm:rounded-xl bg-white border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none text-sm sm:text-base leading-relaxed"
              />
            </div>

            {hasActiveCV && (
              <div className="p-3 sm:p-4 rounded-lg bg-blue-50 border border-blue-200 flex items-start gap-2 sm:gap-3">
                <CheckCircle2 className="text-blue-600 flex-shrink-0 mt-0.5" size={16} />
                <p className="text-blue-700 text-xs sm:text-sm">
                  <span className="font-semibold">{activeCV.fileName}</span> will be automatically attached when you send this application.
                </p>
              </div>
            )}

            <div className="p-3 sm:p-4 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2 sm:gap-3">
              <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={16} />
              <p className="text-amber-700 text-xs sm:text-sm">
                Double-check the email address. If it doesn't exist, you'll receive a bounce-back notification in your Gmail inbox.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={onDiscard}
                className="flex-1 h-11 sm:h-12 rounded-lg sm:rounded-xl border border-neutral-300 bg-white font-semibold hover:bg-neutral-50 transition-all text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Discard & Start Over</span>
                <span className="sm:hidden">Discard</span>
              </button>
              <button
                onClick={onSend}
                disabled={!canSend}
                className="flex-1 sm:flex-[2] h-11 sm:h-12 bg-primary text-white rounded-lg sm:rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 sm:gap-3 shadow-sm hover:shadow-md text-sm sm:text-base"
              >
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
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
