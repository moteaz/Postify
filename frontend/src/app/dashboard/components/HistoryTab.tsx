import { memo, useState, useMemo } from "react";
import { History as HistoryIcon, ArrowRight, CheckCircle2, AlertCircle, FileText, Search, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/Pagination";
import { cn } from "@/lib/utils";
import type { Application, PaginationMeta } from "@/types";

interface HistoryTabProps {
  history: Application[];
  isLoading: boolean;
  onViewDetails: (app: Application) => void;
  onCreateNew: () => void;
  pagination: PaginationMeta | null;
  onPageChange: (page: number) => void;
}

const HistoryTabComponent = ({ history, isLoading, onViewDetails, onCreateNew, pagination, onPageChange }: HistoryTabProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'SENT' | 'DRAFT' | 'FAILED'>('all');

  const filteredHistory = useMemo(() => {
    let filtered = history;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app => 
        app.subject?.toLowerCase().includes(query) ||
        app.recruiterEmail?.toLowerCase().includes(query) ||
        app.coverLetter?.toLowerCase().includes(query)
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }
    
    return filtered;
  }, [history, searchQuery, statusFilter]);
  if (isLoading) {
    return (
      <div className="grid gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-5 rounded-2xl bg-white border border-[#EAE7E3]">
            <div className="flex items-start gap-4 mb-3">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-8 w-28 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#EEF3FD] to-[#FFF0F6] flex items-center justify-center">
          <HistoryIcon className="w-10 h-10 text-[#7C9EE8]" />
        </div>
        <h3 className="text-xl font-bold text-[#1C1917] mb-2">
          No applications yet
        </h3>
        <p className="text-sm text-[#78716C] mb-6 max-w-sm mx-auto">
          Your sent applications will appear here. Start by generating your first cover letter!
        </p>
        <Button
          variant="primary"
          onClick={onCreateNew}
        >
          <Sparkles size={16} />
          Create First Application
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 page-enter">
      <div className="fixed top-0 right-0 w-96 h-96 bg-[#7C9EE8]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#78716C]" />
          <input
            type="text"
            placeholder="Search by company, position, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EAE7E3] focus:ring-2 focus:ring-[#7C9EE8] focus:border-[#7C9EE8] outline-none transition-all"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('all')}
          >
            All
          </Button>
          <Button
            variant={statusFilter === 'SENT' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('SENT')}
          >
            Sent
          </Button>
          <Button
            variant={statusFilter === 'DRAFT' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('DRAFT')}
          >
            Drafts
          </Button>
        </div>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-[#EAE7E3] rounded-2xl bg-white">
          <Search className="w-12 h-12 mx-auto mb-4 text-[#A8A29E]" />
          <p className="text-sm text-[#78716C]">No applications match your search</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredHistory.map((app, index) => (
          <div 
            key={app.id} 
            className="p-5 rounded-2xl bg-white border border-[#EAE7E3] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
            style={{ animation: `fadeIn 350ms ease-out ${index * 50}ms both` }}
          >
            <div className="flex items-start gap-4 mb-3">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                app.status === "SENT" ? "bg-[#DCFCE7] text-[#16A34A]" :
                app.status === "FAILED" ? "bg-[#FFE4E6] text-[#E11D48]" : "bg-[#EEF3FD] text-[#7C9EE8]"
              )}>
                {app.status === "SENT" ? <CheckCircle2 size={18} /> :
                 app.status === "FAILED" ? <AlertCircle size={18} /> : <FileText size={18} />}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-base text-[#1C1917] mb-1 line-clamp-2">{app.subject || "No Subject"}</h4>
                <p className="text-sm text-[#78716C] truncate mb-1">{app.recruiterEmail}</p>
                <p className="text-xs text-[#A8A29E]">{new Date(app.generatedAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider",
                app.status === "SENT" ? "bg-[#DCFCE7] text-[#16A34A]" :
                app.status === "FAILED" ? "bg-[#FFE4E6] text-[#E11D48]" : "bg-[#EEF3FD] text-[#7C9EE8]"
              )}>
                {app.status}
              </span>
              <button
                onClick={() => onViewDetails(app)}
                className="px-4 py-2 rounded-xl bg-[#F5F3F0] hover:bg-[#7C9EE8] hover:text-white text-[#7C9EE8] transition-all text-xs font-medium flex items-center gap-1.5 active:scale-95"
              >
                View Details
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
          ))}
        </div>
      )}
      {pagination && <Pagination pagination={pagination} onPageChange={onPageChange} />}
    </div>
  );
};

export const HistoryTab = memo(HistoryTabComponent);

HistoryTab.displayName = "HistoryTab";
