import { apiClient } from "@/lib/apiClient";
import type { ApiResponse } from "@/types";

export abstract class BaseService {
  protected async unwrapResponse<T>(promise: Promise<{ data: ApiResponse<T> }>): Promise<T> {
    const response = await promise;
    return response.data.data;
  }

  protected handleError(error: unknown): never {
    // Centralized error handling
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred");
  }
}

// Example usage
export class AuthService extends BaseService {
  async getCurrentUser() {
    return this.unwrapResponse(apiClient.get("/auth/me"));
  }

  async logout() {
    await apiClient.post("/auth/logout");
  }
}

export const authService = new AuthService();
