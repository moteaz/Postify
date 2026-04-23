import type { Application } from "@/types";

interface UserDetailsStatsProps {
  cvsCount: number;
  applicationsCount: number;
  applications: Application[];
}

export const UserDetailsStats = ({ cvsCount, applicationsCount, applications }: UserDetailsStatsProps) => {
  const sentCount = applications.filter(a => a.status === 'SENT').length;

  return (
    <div className="mt-6 border-y border-[#EAE7E3] grid grid-cols-3 divide-x divide-[#EAE7E3]">
      <div className="py-4 text-center">
        <div className="w-1.5 h-1.5 rounded-full bg-[#7C9EE8] mx-auto mb-2" />
        <p className="text-2xl font-bold text-[#7C9EE8] font-[family-name:var(--font-display)]">{cvsCount}</p>
        <p className="text-xs font-medium text-[#A8A29E] uppercase tracking-widest mt-1">CVs Uploaded</p>
      </div>
      <div className="py-4 text-center">
        <div className="w-1.5 h-1.5 rounded-full bg-[#F0A8C0] mx-auto mb-2" />
        <p className="text-2xl font-bold text-[#F0A8C0] font-[family-name:var(--font-display)]">{applicationsCount}</p>
        <p className="text-xs font-medium text-[#A8A29E] uppercase tracking-widest mt-1">Applications</p>
      </div>
      <div className="py-4 text-center">
        <div className="w-1.5 h-1.5 rounded-full bg-[#85D4B8] mx-auto mb-2" />
        <p className="text-2xl font-bold text-[#85D4B8] font-[family-name:var(--font-display)]">{sentCount}</p>
        <p className="text-xs font-medium text-[#A8A29E] uppercase tracking-widest mt-1">Sent</p>
      </div>
    </div>
  );
};
