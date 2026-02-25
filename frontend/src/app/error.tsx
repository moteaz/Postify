"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-neutral-900">Something went wrong</h2>
          <p className="text-neutral-600">
            We encountered an unexpected error. Please try again.
          </p>
        </div>
        <button
          onClick={reset}
          className="h-11 px-6 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-all"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
