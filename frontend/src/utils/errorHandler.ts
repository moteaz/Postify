import type { ApiError } from "@/types";

export function handleApiError(error: unknown): string {
  const apiError = error as { response?: { data?: ApiError } };
  return apiError.response?.data?.message || "An unexpected error occurred";
}

export function getErrorDetails(error: unknown): string | undefined {
  const apiError = error as { response?: { data?: ApiError } };
  return apiError.response?.data?.details;
}
