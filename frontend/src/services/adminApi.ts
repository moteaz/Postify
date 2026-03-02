import { apiClient } from "@/lib/apiClient";
import type { AdminUser, AdminUserDetails, AdminUsersResponse, AdminUserDetailsResponse } from "@/types";

export const adminService = {
  async getAllUsers(): Promise<AdminUser[]> {
    const res = await apiClient.get<AdminUsersResponse>("/admin/users");
    return res.data.data.users;
  },

  async getUserDetails(id: string): Promise<AdminUserDetails> {
    const res = await apiClient.get<AdminUserDetailsResponse>(`/admin/users/${id}`);
    return res.data.data.user;
  },

  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/admin/users/${id}`);
  },

  async exportUsers(): Promise<void> {
    const res = await apiClient.get('/admin/users/export', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `users-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  getDownloadCVUrl(cvId: string): string {
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/admin/cv/${cvId}/download`;
  }
};
