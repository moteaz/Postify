import { useState, useEffect, useCallback } from "react";

interface UseQueryOptions<T> {
  queryFn: () => Promise<T>;
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useQuery<T>({ queryFn, enabled = true, onSuccess, onError }: UseQueryOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await queryFn();
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [queryFn, enabled, onSuccess, onError]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}

// Usage example:
// const { data: cvs, isLoading, refetch } = useQuery({
//   queryFn: () => cvService.getAll(),
//   onError: (error) => toast.error(error.message)
// });
