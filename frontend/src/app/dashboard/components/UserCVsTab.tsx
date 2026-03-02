import { FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { truncateFilename } from "@/utils/fileUtils";
import type { CV } from "@/types";

interface UserCVsTabProps {
  cvs: CV[];
}

export const UserCVsTab = ({ cvs }: UserCVsTabProps) => (
  <div className="space-y-2 sm:space-y-3">
    {cvs.length === 0 ? (
      <div className="text-center py-8 sm:py-12">
        <FileText className="mx-auto text-muted-foreground mb-3 sm:mb-4" size={40} />
        <p className="text-sm sm:text-base text-muted-foreground">No CVs uploaded</p>
      </div>
    ) : (
      cvs.map((cv) => (
        <Card key={cv.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <FileText className="text-blue-500" size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm sm:text-base font-medium truncate" title={cv.fileName}>
                  {truncateFilename(cv.fileName, 40)}
                </p>
                <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-muted-foreground mt-1">
                  <span>{new Date(cv.uploadedAt).toLocaleDateString()}</span>
                  {cv.isActive && (
                    <>
                      <span>•</span>
                      <span className="text-primary font-medium">Active</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))
    )}
  </div>
);
