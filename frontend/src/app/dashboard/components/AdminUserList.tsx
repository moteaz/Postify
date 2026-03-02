import { memo } from "react";
import Image from "next/image";
import { Trash2, Eye, FileText, Mail, Users, Search, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
}: AdminUserListProps) => (
  <Card>
    <CardHeader>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <CardTitle className="text-xl">User Management</CardTitle>
          <CardDescription>View and manage all platform users</CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button onClick={onExportUsers} variant="outline" className="gap-2">
            <FileDown size={16} />
            <span className="hidden sm:inline">Export CSV</span>
            <span className="sm:hidden">Export</span>
          </Button>
        </div>
      </div>
    </CardHeader>
    <CardContent className="p-4 sm:p-6">
      <div className="space-y-3">
        {users.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto text-muted-foreground mb-4" size={48} />
            <p className="text-muted-foreground">No users found</p>
          </div>
        ) : (
          users.map((user) => (
            <div key={user.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-accent gap-3">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                {user.avatarUrl && (
                  <Image
                    src={user.avatarUrl}
                    alt={user.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full flex-shrink-0 object-cover"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate">{user.name}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">{user.email}</p>
                  {user.role === "ADMIN" && (
                    <span className="inline-block mt-1 text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">
                      ADMIN
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                <div className="flex gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <FileText size={14} className="sm:w-4 sm:h-4" /> {user._count.cvs}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail size={14} className="sm:w-4 sm:h-4" /> {user._count.applications}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => onViewUser(user.id)} className="h-8 text-xs">
                    <Eye size={14} /> View
                  </Button>
                  {user.role !== "ADMIN" && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDeleteUser(user.id, user.email)}
                      className="h-8"
                    >
                      <Trash2 size={14} />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </CardContent>
  </Card>
);

export const AdminUserList = memo(AdminUserListComponent);

AdminUserList.displayName = "AdminUserList";
