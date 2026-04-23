import { useState } from "react";
import { Mail, Eye } from "lucide-react";
import { Pagination } from "@/shared/components/feedback/pagination";
import { ApplicationDetailModal } from "@/features/applications/components/application-detail-modal";
import type { Application, PaginationMeta } from "@/types";

interface UserApplicationsTabProps {
  applications: Application[];
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
}

export const UserApplicationsTab = ({ applications, pagination, onPageChange }: UserApplicationsTabProps) => {
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  return (
    <>
      <div className="p-5 max-h-[340px] overflow-y-auto space-y-3">
        {applications.length === 0 ? (
          <div className="text-center py-12">
            <Mail className="mx-auto text-[#A8A29E] mb-4" size={40} />
            <p className="text-sm text-[#A8A29E]">No applications generated</p>
          </div>
        ) : (
          applications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-2xl px-5 py-4 border border-[#EAE7E3] hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 flex items-center gap-4"
            >
              <div className="rounded-xl p-2.5 bg-[#FFF0F6] text-[#F0A8C0] flex-shrink-0">
                <Mail size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1C1917] truncate">{app.subject}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs text-[#A8A29E] truncate">{app.recruiterEmail}</p>
                  <span className="text-[#A8A29E]">•</span>
                  <p className="text-xs text-[#A8A29E]">{new Date(app.generatedAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-xs rounded-full px-2.5 py-1 font-semibold whitespace-nowrap ${
                  app.status === 'SENT'
                    ? 'bg-[#DCFCE7] text-[#166534]'
                    : 'bg-[#FEF9C3] text-[#854D0E]'
                }`}>
                  {app.status}
                </span>
                <button
                  onClick={() => setSelectedApp(app)}
                  className="rounded-xl border border-[#EAE7E3] bg-white hover:bg-[#EEF3FD] px-3 py-2 text-xs font-medium text-[#4A7BD4] transition-all duration-150 flex items-center gap-1.5 active:scale-95 whitespace-nowrap"
                >
                  <Eye size={14} />
                  View
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {pagination && applications.length > 0 && (
        <div className="px-5 pb-5">
          <Pagination pagination={pagination} onPageChange={onPageChange} />
        </div>
      )}

      {selectedApp && (
        <ApplicationDetailModal
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
        />
      )}
    </>
  );
};
