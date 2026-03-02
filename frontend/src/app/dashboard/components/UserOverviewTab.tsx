import { FileText, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { truncateFilename } from "@/utils/fileUtils";
import type { AdminUserDetails } from "@/types";

interface UserOverviewTabProps {
  user: AdminUserDetails;
}

export const UserOverviewTab = ({ user }: UserOverviewTabProps) => (
  <div className="space-y-4 sm:space-y-6">
    <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
            <FileText size={16} className="text-blue-500" />
            Recent CVs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {user.cvs.slice(0, 3).map((cv) => (
            <div key={cv.id} className="flex items-center justify-between py-2 border-b last:border-0">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium truncate" title={cv.fileName}>
                  {truncateFilename(cv.fileName, 35)}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  {new Date(cv.uploadedAt).toLocaleDateString()}
                </p>
              </div>
              {cv.isActive && <Badge variant="secondary" className="text-[10px] sm:text-xs">Active</Badge>}
            </div>
          ))}
          {user.cvs.length === 0 && (
            <p className="text-xs sm:text-sm text-muted-foreground text-center py-4">No CVs uploaded</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
            <Mail size={16} className="text-cyan-500" />
            Recent Applications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {user.applications.slice(0, 3).map((app) => (
            <div key={app.id} className="flex items-center justify-between py-2 border-b last:border-0">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium truncate">{app.subject}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  {new Date(app.generatedAt).toLocaleDateString()}
                </p>
              </div>
              <Badge 
                variant={app.status === 'SENT' ? 'default' : 'secondary'}
                className="text-[10px] sm:text-xs"
              >
                {app.status}
              </Badge>
            </div>
          ))}
          {user.applications.length === 0 && (
            <p className="text-xs sm:text-sm text-muted-foreground text-center py-4">No applications</p>
          )}
        </CardContent>
      </Card>
    </div>
  </div>
);
