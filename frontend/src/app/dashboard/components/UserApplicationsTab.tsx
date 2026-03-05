import { useState } from "react";
import { Mail, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/Pagination";
import { ApplicationDetailModal } from "./ApplicationDetailModal";
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
      <div className="space-y-4">
        <div className="space-y-2 sm:space-y-3">
          {applications.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <Mail className="mx-auto text-muted-foreground mb-3 sm:mb-4" size={40} />
              <p className="text-sm sm:text-base text-muted-foreground">No applications generated</p>
            </div>
          ) : (
            applications.map((app) => (
              <Card key={app.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="text-cyan-500" size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base font-medium truncate">{app.subject}</p>
                        <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-muted-foreground mt-1">
                          <span className="truncate max-w-[120px] sm:max-w-none">{app.recruiterEmail}</span>
                          <span>•</span>
                          <span>{new Date(app.generatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={app.status === 'SENT' ? 'default' : app.status === 'FAILED' ? 'destructive' : 'secondary'}
                        className="text-[10px] sm:text-xs"
                      >
                        {app.status}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedApp(app)}
                        className="gap-1"
                      >
                        <Eye size={14} />
                        <span className="hidden sm:inline">View</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        {pagination && <Pagination pagination={pagination} onPageChange={onPageChange} />}
      </div>

      {selectedApp && (
        <ApplicationDetailModal
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
        />
      )}
    </>
  );
};
