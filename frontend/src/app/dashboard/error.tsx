"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error("Dashboard error:", error);
    } else {
      console.error("Dashboard error:", error.message);
    }
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <Card className="max-w-md w-full text-center border-border shadow-lg">
        <CardContent className="p-8 space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Dashboard Error</h2>
            <p className="text-muted-foreground">
              {error.message || "Something went wrong in the dashboard"}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={reset} size="lg" className="flex-1">
              Try Again
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="flex-1"
              onClick={() => window.location.href = "/"}
            >
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
