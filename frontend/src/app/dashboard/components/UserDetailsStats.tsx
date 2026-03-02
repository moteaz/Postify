import type { Application } from "@/types";

interface UserDetailsStatsProps {
  cvsCount: number;
  applicationsCount: number;
  applications: Application[];
}

export const UserDetailsStats = ({ cvsCount, applicationsCount, applications }: UserDetailsStatsProps) => {
  const sentCount = applications.filter(a => a.status === 'SENT').length;

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4 p-3 sm:p-4 border-b bg-muted/30">
      <div className="text-center">
        <p className="text-xl sm:text-2xl font-bold text-primary">{cvsCount}</p>
        <p className="text-[10px] sm:text-xs text-muted-foreground">CVs Uploaded</p>
      </div>
      <div className="text-center">
        <p className="text-xl sm:text-2xl font-bold text-blue-500">{applicationsCount}</p>
        <p className="text-[10px] sm:text-xs text-muted-foreground">Applications</p>
      </div>
      <div className="text-center">
        <p className="text-xl sm:text-2xl font-bold text-cyan-500">{sentCount}</p>
        <p className="text-[10px] sm:text-xs text-muted-foreground">Sent</p>
      </div>
    </div>
  );
};
