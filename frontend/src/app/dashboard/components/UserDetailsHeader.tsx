import { ShieldCheck, Calendar, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePermissions } from "@/hooks/usePermissions";
import type { AdminUserDetails } from "@/types";

interface UserDetailsHeaderProps {
  user: AdminUserDetails;
  onClose: () => void;
  onDelete: () => void;
}

export const UserDetailsHeader = ({ user, onClose, onDelete }: UserDetailsHeaderProps) => {
  const { canDeleteUser } = usePermissions();
  
  return (
    <div className="p-7 pb-0">
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-start gap-4 min-w-0 flex-1">
          {/* Avatar with gradient ring */}
          <div className="p-[3px] bg-gradient-to-br from-[#7C9EE8] to-[#F0A8C0] rounded-[22px] flex-shrink-0">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-16 h-16 rounded-xl object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center">
                <span className="text-2xl font-bold text-[#7C9EE8] font-[family-name:var(--font-display)]">
                  {user.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
          
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-bold text-[#1C1917] tracking-tight font-[family-name:var(--font-display)] truncate">
              {user.name}
            </h3>
            <p className="text-sm text-[#78716C] mt-0.5 truncate">{user.email}</p>
            
            {/* Badges */}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {user.role === "ADMIN" && (
                <span className="inline-flex items-center gap-1.5 bg-[#EEF3FD] text-[#4A7BD4] border border-[#C9DAFF] rounded-lg px-2.5 py-1 text-xs font-semibold">
                  <ShieldCheck size={12} />
                  Admin
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 bg-[#F5F3F0] text-[#78716C] border border-[#EAE7E3] rounded-lg px-2.5 py-1 text-xs">
                <Calendar size={12} />
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-2 flex-shrink-0">
          {canDeleteUser(user.role) && (
            <button
              onClick={onDelete}
              className="rounded-xl w-9 h-9 border border-[#EAE7E3] bg-white hover:bg-[#FFF0F3] hover:border-[#F0A8C0] hover:text-red-500 transition-all duration-150 flex items-center justify-center"
            >
              <Trash2 size={16} />
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-xl w-9 h-9 border border-[#EAE7E3] bg-white hover:bg-[#F5F3F0] transition-all duration-150 flex items-center justify-center"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
