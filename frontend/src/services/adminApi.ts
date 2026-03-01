import api from "@/utils/api";
import type { AdminUser, AdminUserDetails, AdminUsersResponse, AdminUserDetailsResponse } from "@/types";

export const adminService = {
  async getAllUsers(): Promise<AdminUser[]> {
    const res = await api.get<AdminUsersResponse>("/admin/users");
    return res.data.data.users;
  },

  async getUserDetails(id: string): Promise<AdminUserDetails> {
    const res = await api.get<AdminUserDetailsResponse>(`/admin/users/${id}`);
    return res.data.data.user;
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/admin/users/${id}`);
  },

  getDownloadCVUrl(cvId: string): string {
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/admin/cv/${cvId}/download`;
  }
};
