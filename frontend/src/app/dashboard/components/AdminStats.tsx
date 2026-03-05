import { Users, FileText, Mail, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AdminStatsProps {
  totalUsers: number;
  totalCVs: number;
  totalApps: number;
  adminCount: number;
  avgCVsPerUser: string;
  avgAppsPerUser: string;
}

// REDESIGNED: Soft pastel stat cards with hover animations and accent bars
export const AdminStats = ({ totalUsers, totalCVs, totalApps, adminCount, avgCVsPerUser, avgAppsPerUser }: AdminStatsProps) => {
  const activeRate = totalUsers > 0 ? Math.round((totalApps / totalUsers) * 100) : 0;

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mb-8">
      <Card className="bg-white rounded-2xl border border-[var(--border)] shadow-[var(--shadow-card)] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
        <CardContent className="p-6">
          <span className="text-xs font-medium uppercase tracking-widest text-[var(--text-muted)]">Total Users</span>
          <h3 className="text-3xl font-bold mt-2 tracking-tight font-[family-name:var(--font-display)]">{totalUsers}</h3>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            {adminCount} admin{adminCount !== 1 ? 's' : ''}
          </p>
          <div className="mt-4 h-1 rounded-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)]" />
        </CardContent>
      </Card>

      <Card className="bg-white rounded-2xl border border-[var(--border)] shadow-[var(--shadow-card)] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
        <CardContent className="p-6">
          <span className="text-xs font-medium uppercase tracking-widest text-[var(--text-muted)]">Total CVs</span>
          <h3 className="text-3xl font-bold mt-2 tracking-tight font-[family-name:var(--font-display)]">{totalCVs}</h3>
          <p className="text-xs text-[var(--accent-mint)] mt-1 flex items-center gap-1">
            <TrendingUp size={12} />
            {avgCVsPerUser} avg/user
          </p>
          <div className="mt-4 h-1 rounded-full bg-[var(--accent-primary)]" />
        </CardContent>
      </Card>

      <Card className="bg-white rounded-2xl border border-[var(--border)] shadow-[var(--shadow-card)] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
        <CardContent className="p-6">
          <span className="text-xs font-medium uppercase tracking-widest text-[var(--text-muted)]">Applications</span>
          <h3 className="text-3xl font-bold mt-2 tracking-tight font-[family-name:var(--font-display)]">{totalApps}</h3>
          <p className="text-xs text-[var(--accent-mint)] mt-1 flex items-center gap-1">
            <TrendingUp size={12} />
            {avgAppsPerUser} avg/user
          </p>
          <div className="mt-4 h-1 rounded-full bg-[var(--accent-mint)]" />
        </CardContent>
      </Card>

      <Card className="bg-white rounded-2xl border border-[var(--border)] shadow-[var(--shadow-card)] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
        <CardContent className="p-6">
          <span className="text-xs font-medium uppercase tracking-widest text-[var(--text-muted)]">Active Rate</span>
          <h3 className="text-3xl font-bold mt-2 tracking-tight font-[family-name:var(--font-display)]">{activeRate}%</h3>
          <p className="text-xs text-[var(--text-secondary)] mt-1">User engagement</p>
          <div className="mt-4 h-1 rounded-full bg-[var(--accent-peach)]" />
        </CardContent>
      </Card>
    </div>
  );
};
