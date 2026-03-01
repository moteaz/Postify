import api from "@/utils/api";
import type {
  Application,
  CV,
  GeneratedContent,
  GenerateResponse,
  HistoryResponse,
  CVResponse,
  MeResponse,
  User
} from "@/types";

export const authService = {
  async getCurrentUser(): Promise<User> {
    const res = await api.get<MeResponse>("/auth/me");
    return res.data.data.user;
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout");
  }
};

export const applicationService = {
  async getHistory(): Promise<Application[]> {
    const res = await api.get<HistoryResponse>("/email/history");
    return res.data.data.history;
  },

  async generateApplication(jobDescription: string): Promise<{ content: GeneratedContent; applicationId: string }> {
    const res = await api.post<GenerateResponse>("/ai/generate", { jobDescription });
    return { content: res.data.data.content, applicationId: res.data.data.applicationId };
  },

  async sendApplication(data: {
    applicationId: string;
    to: string;
    subject: string;
    body: string;
  }): Promise<void> {
    await api.post("/email/send", data);
  }
};

export const cvService = {
  async getAll(): Promise<CV[]> {
    const res = await api.get<CVResponse>("/cv");
    return res.data.data.cvs;
  },

  async upload(file: File): Promise<void> {
    const formData = new FormData();
    formData.append("cv", file);
    await api.post("/cv/upload", formData);
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/cv/${id}`);
  },

  async setActive(id: string): Promise<void> {
    await api.put(`/cv/${id}/active`);
  },
  
    async setArchived(id: string): Promise<void> {
    await api.put(`/cv/${id}/archive`);
  }
};
