import { UserRole } from "@/types";

export const canAccessAdmin = (role?: UserRole) => role === UserRole.ADMIN;

export const canDeleteUser = (role?: UserRole, targetRole?: UserRole) => 
  role === UserRole.ADMIN && targetRole !== UserRole.ADMIN;
