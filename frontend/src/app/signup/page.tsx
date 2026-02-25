"use client";

import Link from "next/link";
import { env } from "@/config/env";
import AuthLayout from "@/components/auth/AuthLayout";
import GoogleButton from "@/components/auth/GoogleButton";
import Divider from "@/components/auth/Divider";
import ValueProp from "@/components/auth/ValueProp";

export default function SignupPage() {
  const handleGoogleSignup = () => {
    window.location.href = `${env.apiUrl}/auth/google`;
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-0 overflow-hidden rounded-xl sm:rounded-2xl border border-neutral-200 bg-white shadow-elevated">
        <ValueProp />

        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-12 space-y-5 sm:space-y-6">
          <div className="space-y-1 sm:space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
              Create Account
            </h1>
            <p className="text-sm sm:text-base text-neutral-600">
              Start applying smarter today
            </p>
          </div>

          <GoogleButton onClick={handleGoogleSignup} text="Sign up with Google" />

          <Divider text="Fast Access" />

          <p className="text-xs text-center text-neutral-500 leading-relaxed px-2">
            No long forms. We&apos;ll use your Google profile to set up your Postify workspace instantly.
          </p>

          <div className="text-center pt-2 sm:pt-4">
            <p className="text-xs sm:text-sm text-neutral-600">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
