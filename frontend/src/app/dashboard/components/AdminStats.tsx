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

export const AdminStats = ({ totalUsers, totalCVs, totalApps, adminCount, avgCVsPerUser, avgAppsPerUser }: AdminStatsProps) => {
  const activeRate = totalUsers > 0 ? Math.round((totalApps / totalUsers) * 100) : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card className="border-l-4 border-l-primary">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Users</p>
              <h3 className="text-3xl font-bold mt-2">{totalUsers}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {adminCount} admin{adminCount !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="text-primary" size={24} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total CVs</p>
              <h3 className="text-3xl font-bold mt-2">{totalCVs}</h3>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp size={12} />
                {avgCVsPerUser} avg/user
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <FileText className="text-blue-500" size={24} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-cyan-500">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Applications</p>
              <h3 className="text-3xl font-bold mt-2">{totalApps}</h3>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp size={12} />
                {avgAppsPerUser} avg/user
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center">
              <Mail className="text-cyan-500" size={24} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-slate-500">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Rate</p>
              <h3 className="text-3xl font-bold mt-2">{activeRate}%</h3>
              <p className="text-xs text-muted-foreground mt-1">User engagement</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-slate-500/10 flex items-center justify-center">
              <TrendingUp className="text-slate-500" size={24} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
