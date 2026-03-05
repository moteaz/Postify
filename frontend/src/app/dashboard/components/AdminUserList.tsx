import { memo } from "react";
import Image from "next/image";
import { Trash2, Eye, FileText, Mail, Users, Search, FileDown, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { usePermissions } from "@/hooks/usePermissions";
import type { AdminUser } from "@/types";

interface AdminUserListProps {
  users: AdminUser[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onViewUser: (id: string) => void;
  onDeleteUser: (id: string, email: string) => void;
  onExportUsers: () => void;
}

const AdminUserListComponent = ({
  users,
  searchQuery,
  onSearchChange,
  onViewUser,
  onDeleteUser,
  onExportUsers
}: AdminUserListProps) => {
  const { canDeleteUser } = usePermissions();
  
  return (
    <Card className="bg-white rounded-2xl border border-[#EAE7E3] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
      {/* Toolbar */}
      <div className="px-5 sm:px-7 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-[#1C1917] font-[family-name:var(--font-display)]">User Management</h3>
          <p className="text-xs text-[#A8A29E] mt-0.5">View and manage all platform users</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A29E]" size={16} />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 w-full sm:w-56 rounded-xl bg-[#F5F3F0] border-[#EAE7E3] focus:border-[#7C9EE8] focus:ring-2 focus:ring-[#7C9EE8]/20 transition-all duration-200"
            />
          </div>
          {/* Export */}
          <Button 
            onClick={onExportUsers} 
            variant="outline" 
            className="rounded-xl bg-[#F5F3F0] border-[#EAE7E3] text-[#78716C] hover:bg-[#7C9EE8] hover:text-white hover:border-[#7C9EE8] transition-all duration-150 gap-2"
          >
            <FileDown size={16} />
            <span className="hidden sm:inline">Export CSV</span>
            <span className="sm:hidden">Export</span>
          </Button>
        </div>
      </div>

      {/* User List */}
      <div className="divide-y divide-[#EAE7E3]">
        {users.length === 0 ? (
          <div className="py-16 text-center">
            <div className="rounded-2xl bg-[#F5F3F0] p-5 mx-auto w-fit mb-4">
              <Users className="text-[#A8A29E]" size={48} />
            </div>
            <p className="text-sm font-semibold text-[#1C1917]">No users found</p>
            <p className="text-xs text-[#A8A29E] mt-1">Try adjusting your search</p>
          </div>
        ) : (
          users.map((user, index) => (
            <div 
              key={user.id} 
              className="px-5 sm:px-7 py-4 flex items-center gap-4 hover:bg-[#F9F7F4] transition-colors duration-150 cursor-pointer"
              style={{ animation: `fadeIn 350ms ease-out ${index * 50}ms both` }}
              onClick={() => onViewUser(user.id)}
            >
              {/* Avatar with gradient ring */}
              <div className="p-[2px] bg-gradient-to-br from-[#7C9EE8] to-[#F0A8C0] rounded-[18px] flex-shrink-0">
                {user.avatarUrl && (
                  <Image
                    src={user.avatarUrl}
                    alt={user.name}
                    width={44}
                    height={44}
                    className="w-11 h-11 rounded-2xl object-cover"
                  />
                )}
              </div>
              
              {/* User info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-[#1C1917] truncate">{user.name}</p>
                  {user.role === "ADMIN" && (
                    <span className="inline-flex items-center gap-1 bg-[#EEF3FD] text-[#4A7BD4] border border-[#C9DAFF] rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                      <ShieldCheck size={10} />
                      Admin
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#78716C] mt-0.5 truncate">{user.email}</p>
              </div>
              
              {/* Stats + Actions */}
              <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                {/* CV count - hidden on mobile */}
                <div className="hidden sm:flex items-center gap-1.5">
                  <FileText size={14} className="text-[#7C9EE8]" />
                  <span className="text-sm font-medium text-[#78716C]">{user._count.cvs}</span>
                </div>
                {/* App count - hidden on mobile */}
                <div className="hidden sm:flex items-center gap-1.5">
                  <Mail size={14} className="text-[#F0A8C0]" />
                  <span className="text-sm font-medium text-[#78716C]">{user._count.applications}</span>
                </div>
                {/* View button */}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewUser(user.id);
                  }}
                  className="rounded-xl bg-[#F5F3F0] border-[#EAE7E3] text-[#78716C] hover:bg-[#7C9EE8] hover:text-white hover:border-[#7C9EE8] transition-all duration-150 gap-1.5 active:scale-95"
                >
                  <Eye size={13} />
                  View
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export const AdminUserList = memo(AdminUserListComponent);

AdminUserList.displayName = "AdminUserList";
