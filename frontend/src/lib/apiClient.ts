import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
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
    this.client.interceptors.request.use(
      (config) => {
        // Fallback to localStorage for Safari/iOS (cookies may be blocked)
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('auth_token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const requestUrl = error.config?.url ?? '';
        const isAuthCheck = requestUrl.includes('/auth/me');

        if (error.response?.status === 401 && !isAuthCheck) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            window.location.href = "/";
          }
        }

        if (!error.response && process.env.NODE_ENV === 'development') {
          console.error("Network error:", error.message);
        }

        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig) {
    return this.client.get<T>(url, config);
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.client.post<T>(url, data, config);
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.client.put<T>(url, data, config);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig) {
    return this.client.delete<T>(url, config);
  }
}

export const apiClient = new ApiClient();
