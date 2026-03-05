import { FileText, Download } from "lucide-react";
import { truncateFilename } from "@/utils/fileUtils";
import { adminService } from "@/services/api";
import type { CV } from "@/types";

interface UserCVsTabProps {
  cvs: CV[];
}

export const UserCVsTab = ({ cvs }: UserCVsTabProps) => {
  const handleDownload = (cvId: string, fileName: string) => {
    const url = adminService.getDownloadCVUrl(cvId);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-5 max-h-[340px] overflow-y-auto space-y-3">
      {cvs.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto text-[#A8A29E] mb-4" size={40} />
          <p className="text-sm text-[#A8A29E]">No CVs uploaded</p>
        </div>
      ) : (
        cvs.map((cv) => (
          <div
            key={cv.id}
            className="bg-white rounded-2xl px-5 py-4 border border-[#EAE7E3] hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 flex items-center gap-4"
          >
            <div className="rounded-xl p-2.5 bg-[#EEF3FD] text-[#7C9EE8] flex-shrink-0">
              <FileText size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#1C1917] truncate" title={cv.fileName}>
                {truncateFilename(cv.fileName, 40)}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-xs text-[#A8A29E]">
                  {new Date(cv.uploadedAt).toLocaleDateString()}
                </p>
                {cv.isActive && (
                  <>
                    <span className="text-[#A8A29E]">•</span>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                      <span className="text-xs font-medium text-[#16A34A]">Active</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            <button
              onClick={() => handleDownload(cv.id, cv.fileName)}
              className="rounded-xl bg-[#F5F3F0] hover:bg-[#7C9EE8] hover:text-white px-4 py-2 text-xs font-semibold border border-[#EAE7E3] transition-all duration-150 flex items-center gap-1.5 active:scale-95 whitespace-nowrap"
            >
              <Download size={14} />
              Download
            </button>
          </div>
        ))
      )}
    </div>
  );
};
