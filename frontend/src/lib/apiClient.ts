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
          if (process.env.NODE_ENV === 'development') {
            console.error("Network error:", error.message);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Generic methods
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
