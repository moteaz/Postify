import { Upload } from "lucide-react";

interface CVUploadZoneProps {
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CVUploadZone = ({ onUpload }: CVUploadZoneProps) => (
  <div className="p-12 rounded-2xl border-2 border-dashed border-neutral-300 bg-white flex flex-col items-center text-center space-y-4 hover:border-primary/50 transition-all group">
    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
      <Upload size={28} />
    </div>
    <div className="space-y-1">
      <h3 className="text-lg font-semibold text-neutral-900">Upload Your CV</h3>
      <p className="text-neutral-600 text-sm px-4">
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
      className="h-10 px-6 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-all cursor-pointer flex items-center justify-center text-sm"
    >
      Choose File
    </label>
  </div>
);
