import axios, { AxiosError, AxiosInstance } from "axios";
import { env } from "@/config/env";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: env.apiUrl,
      withCredentials: true,
      timeout: 30000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add loading state, auth tokens, etc.
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        // Handle 401 (redirect to login)
        if (error.response?.status === 401) {
          window.location.href = "/login";
        }
        
        // Handle network errors
        if (!error.response) {
          console.error("Network error:", error.message);
        }

        return Promise.reject(error);
      }
    );
  }

  // Generic methods
  async get<T>(url: string) {
    return this.client.get<T>(url);
  }

  async post<T>(url: string, data?: any) {
    return this.client.post<T>(url, data);
  }

  async put<T>(url: string, data?: any) {
    return this.client.put<T>(url, data);
  }

  async delete<T>(url: string) {
    return this.client.delete<T>(url);
  }
}

export const apiClient = new ApiClient();
