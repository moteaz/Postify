import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CVUploadZoneProps {
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
}

export const CVUploadZone = ({ onUpload, isUploading }: CVUploadZoneProps) => (
  <div className="p-8 sm:p-12 rounded-2xl border-2 border-dashed border-neutral-200 bg-white flex flex-col items-center text-center space-y-4 hover:border-primary/50 hover:bg-primary-50/30 transition-all duration-300 group">
    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-accent-500/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
      {isUploading ? (
        <Loader2 className="w-7 h-7 animate-spin" />
      ) : (
        <Upload className="w-7 h-7" strokeWidth={1.5} />
      )}
    </div>
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-neutral-900 font-display">
        {isUploading ? "Uploading Your CV..." : "Upload Your CV"}
      </h3>
      <p className="text-neutral-600 text-sm px-4 leading-relaxed">
        {isUploading ? "Please wait while we process your CV" : "PDF or DOCX (max 5MB). AI will use it to generate tailored cover letters."}
      </p>
    </div>
    <input
      type="file"
      id="cv-upload"
      className="hidden"
      accept=".pdf,.docx"
      onChange={onUpload}
      disabled={isUploading}
    />
    <label htmlFor="cv-upload" className="cursor-pointer">
      <Button
        type="button"
        variant="primary"
        size="lg"
        disabled={isUploading}
        className="gap-2 font-display font-semibold pointer-events-none"
      >
        {isUploading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="w-5 h-5" />
            Select CV File
          </>
        )}
      </Button>
    </label>
  </div>
);
