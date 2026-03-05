import { Upload } from "lucide-react";

interface CVUploadZoneProps {
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// REDESIGNED: Soft, inviting upload zone optimized for mobile
export const CVUploadZone = ({ onUpload }: CVUploadZoneProps) => (
  <div className="p-8 sm:p-12 rounded-2xl border-2 border-dashed border-[var(--border)] bg-white flex flex-col items-center text-center space-y-3 sm:space-y-4 hover:border-[var(--accent-primary)]/50 hover:bg-[var(--bg-muted)]/30 transition-all duration-200 group">
    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/10 flex items-center justify-center text-[var(--accent-primary)] group-hover:scale-110 transition-transform duration-200">
      <Upload size={24} className="sm:w-7 sm:h-7" strokeWidth={1.5} />
    </div>
    <div className="space-y-1 sm:space-y-2">
      <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)] font-[family-name:var(--font-display)]">Upload Your CV</h3>
      <p className="text-[var(--text-secondary)] text-xs sm:text-sm px-2 sm:px-4 leading-relaxed">
        PDF or DOCX (max 5MB). AI will use it to tailor letters.
      </p>
    </div>
    <input
      type="file"
      id="cv-upload"
      className="hidden"
      accept=".pdf,.docx"
      onChange={onUpload}
    />
    <label
      htmlFor="cv-upload"
      className="h-10 sm:h-10 px-6 sm:px-6 bg-[var(--accent-primary)] text-white rounded-xl font-semibold hover:bg-[var(--accent-primary)]/90 transition-all cursor-pointer flex items-center justify-center text-sm shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card)] active:scale-95"
    >
      Choose File
    </label>
  </div>
);
