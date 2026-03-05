import { FileText, Mail } from "lucide-react";
import { truncateFilename } from "@/utils/fileUtils";
import type { AdminUserDetails } from "@/types";

interface UserOverviewTabProps {
  user: AdminUserDetails;
}

export const UserOverviewTab = ({ user }: UserOverviewTabProps) => (
  <div className="p-7 grid gap-5 md:grid-cols-2">
    {/* Recent CVs Panel */}
    <div className="bg-white rounded-2xl p-5 border border-[#EAE7E3]">
      <div className="flex items-center gap-2 mb-4">
        <div className="rounded-lg p-1.5 bg-[#EEF3FD] text-[#7C9EE8]">
          <FileText size={16} />
        </div>
        <h4 className="text-sm font-semibold text-[#1C1917]">Recent CVs</h4>
      </div>
      <div className="space-y-0">
        {user.cvs.slice(0, 3).map((cv) => (
          <div key={cv.id} className="py-3 border-b border-dashed border-[#EAE7E3] last:border-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1C1917] truncate" title={cv.fileName}>
                  {truncateFilename(cv.fileName, 30)}
                </p>
                <p className="text-xs text-[#A8A29E] mt-0.5">
                  {new Date(cv.uploadedAt).toLocaleDateString()}
                </p>
              </div>
              {cv.isActive && (
                <span className="bg-[#DCFCE7] text-[#16A34A] text-xs rounded-full px-2.5 py-0.5 font-medium whitespace-nowrap">
                  Active
                </span>
              )}
            </div>
          </div>
        ))}
        {user.cvs.length === 0 && (
          <p className="text-xs text-[#A8A29E] text-center py-4">No CVs uploaded</p>
        )}
      </div>
    </div>

    {/* Recent Applications Panel */}
    <div className="bg-white rounded-2xl p-5 border border-[#EAE7E3]">
      <div className="flex items-center gap-2 mb-4">
        <div className="rounded-lg p-1.5 bg-[#FFF0F6] text-[#F0A8C0]">
          <Mail size={16} />
        </div>
        <h4 className="text-sm font-semibold text-[#1C1917]">Recent Applications</h4>
      </div>
      <div className="space-y-0">
        {user.applications.data.slice(0, 3).map((app) => (
          <div key={app.id} className="py-3 border-b border-dashed border-[#EAE7E3] last:border-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1C1917] truncate">{app.subject}</p>
                <p className="text-xs text-[#A8A29E] mt-0.5">
                  {new Date(app.generatedAt).toLocaleDateString()}
                </p>
              </div>
              <span className={`text-xs rounded-full px-2.5 py-0.5 font-medium whitespace-nowrap ${
                app.status === 'SENT'
                  ? 'bg-[#DCFCE7] text-[#166534]'
                  : 'bg-[#FEF9C3] text-[#854D0E]'
              }`}>
                {app.status}
              </span>
            </div>
          </div>
        ))}
        {user.applications.data.length === 0 && (
          <p className="text-xs text-[#A8A29E] text-center py-4">No applications</p>
        )}
      </div>
    </div>
  </div>
);
