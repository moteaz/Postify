import { Trash2, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AdminUserDetails } from "@/types";

interface UserDetailsHeaderProps {
  user: AdminUserDetails;
  onClose: () => void;
  onDelete: () => void;
}

export const UserDetailsHeader = ({ user, onClose, onDelete }: UserDetailsHeaderProps) => (
  <div className="p-4 sm:p-6 border-b bg-gradient-to-r from-primary/5 to-transparent">
    <div className="flex justify-between items-start gap-3">
      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
        {user.avatarUrl && (
          <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 sm:w-16 sm:h-16 rounded-full ring-2 sm:ring-4 ring-primary/10 flex-shrink-0" />
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-lg sm:text-2xl font-bold truncate">{user.name}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground truncate">{user.email}</p>
          <div className="flex items-center gap-2 mt-1 sm:mt-2 flex-wrap">
            {user.role === "ADMIN" && (
              <Badge variant="secondary" className="text-[10px] sm:text-xs">
                <Shield size={10} className="mr-1" /> Admin
              </Badge>
            )}
            <Badge variant="outline" className="text-[10px] sm:text-xs">
              Joined {new Date(user.createdAt).toLocaleDateString()}
            </Badge>
          </div>
        </div>
      </div>
      <div className="flex gap-1 sm:gap-2 flex-shrink-0">
        {user.role !== "ADMIN" && (
          <Button variant="destructive" size="sm" onClick={onDelete} className="h-8 sm:h-9">
            <Trash2 size={14} className="sm:mr-1" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        )}
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 sm:h-9 sm:w-9">
          <X size={18} />
        </Button>
      </div>
    </div>
  </div>
);
