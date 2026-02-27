import type { ApiError } from "@/types";

export function handleApiError(error: unknown): string {
  const apiError = error as { response?: { data?: { error?: string; message?: string; details?: any[] } } };
  
  if (apiError.response?.data?.details && Array.isArray(apiError.response.data.details)) {
    const validationErrors = apiError.response.data.details
      .map((d: any) => d.message)
      .join(', ');
    return validationErrors || "Validation failed";
  }
  
  return apiError.response?.data?.error || apiError.response?.data?.message || "An unexpected error occurred";
}
