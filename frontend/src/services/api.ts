import { apiClient } from "@/lib/apiClient";
import type {
  Application,
  CV,
  GeneratedContent,
  User,
  AdminUser,
  AdminUserDetails,
  PaginatedResponse
} from "@/types";

// ============================================
// AUTH SERVICE
// ============================================
export const authService = {
  async getCurrentUser(): Promise<User> {
    const res = await apiClient.get<{ data: { user: User } }>("/auth/me");
    return res.data.data.user;
  },

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
  }
};

// ============================================
// APPLICATION SERVICE
// ============================================
export const applicationService = {
  async getHistory(page = 1, limit = 20): Promise<PaginatedResponse<Application>> {
    const res = await apiClient.get<{ data: PaginatedResponse<Application> }>(
      `/email/history?page=${page}&limit=${limit}`
    );
    return res.data.data;
  },

  async generateApplication(jobDescription: string): Promise<{ content: GeneratedContent; applicationId: string }> {
    const res = await apiClient.post<{ data: { content: GeneratedContent; applicationId: string } }>(
      "/ai/generate",
      { jobDescription },
      { timeout: 120000 }
    );
    return res.data.data;
  },

  async sendApplication(data: {
    applicationId: string;
    to: string;
    subject: string;
    body: string;
  }): Promise<void> {
    await apiClient.post("/email/send", data);
  }
};

// ============================================
// CV SERVICE
// ============================================
export const cvService = {
  async getAll(): Promise<CV[]> {
    const res = await apiClient.get<{ data: { cvs: CV[] } }>("/cv");
    return res.data.data.cvs;
  },

  async upload(file: File): Promise<void> {
    const formData = new FormData();
    formData.append("cv", file);
    await apiClient.post("/cv/upload", formData);
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/cv/${id}`);
  },

  async setActive(id: string): Promise<void> {
    await apiClient.put(`/cv/${id}/active`);
  },
  
  async setArchived(id: string): Promise<void> {
    await apiClient.put(`/cv/${id}/archive`);
  }
};

// ============================================
// ADMIN SERVICE
// ============================================
export const adminService = {
  async getAllUsers(page = 1, limit = 20): Promise<PaginatedResponse<AdminUser>> {
    const res = await apiClient.get<{ data: PaginatedResponse<AdminUser> }>(
      `/admin/users?page=${page}&limit=${limit}`
    );
    return res.data.data;
  },

  async getUserDetails(id: string, page = 1, limit = 20): Promise<AdminUserDetails> {
    const res = await apiClient.get<{ data: { user: AdminUserDetails } }>(
      `/admin/users/${id}?page=${page}&limit=${limit}`
    );
    return res.data.data.user;
  },

  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/admin/users/${id}`);
  },

  async exportUsers(): Promise<void> {
    const res = await apiClient.get('/admin/users/export', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data as BlobPart]));
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
