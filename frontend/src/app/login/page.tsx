"use client";

import { LogIn } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { env } from "@/config/env";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AuthLayout from "@/components/auth/AuthLayout";
import Branding from "@/components/auth/Branding";
import GoogleButton from "@/components/auth/GoogleButton";
import ErrorAlert from "@/components/auth/ErrorAlert";
import Divider from "@/components/auth/Divider";
import AuthFooter from "@/components/auth/AuthFooter";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleGoogleLogin = () => {
    window.location.href = `${env.apiUrl}/auth/google`;
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        <Branding title="Welcome back" subtitle="Sign in to continue to Postify" />

        <Card className="border-border shadow-lg">
          <CardContent className="p-6 sm:p-8 space-y-5 sm:space-y-6">
            {error && <ErrorAlert message="Authentication failed. Please try again." />}
            
            <GoogleButton onClick={handleGoogleLogin} text="Continue with Google" />

            <p className="text-xs text-center text-muted-foreground leading-relaxed px-2">
              Secure login with Google OAuth. Your data is always protected.
            </p>

            <Divider text="New to Postify?" />

            <div className="text-center">
              <Button variant="link" asChild className="gap-2">
                <Link href="/signup">
                  Create an account
                  <LogIn size={16} />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <AuthFooter />
      </div>
    </AuthLayout>
  );
}
