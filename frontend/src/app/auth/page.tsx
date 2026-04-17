"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { env } from "@/config/env";
import { AuthRedirect } from "@/components/AuthRedirect";
import BrandPanel from "@/components/auth/BrandPanel";
import AuthCard from "@/components/auth/AuthCard";
import Logo from "@/assets/Logo.png";

export default function AuthPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleGoogleAuth = async () => {
    window.location.href = `${env.apiUrl}/auth/google`;
  };

  return (
    <AuthRedirect>
      <div className="flex min-h-screen bg-[#F9F7F4]">
        <BrandPanel />

        <main id="main-content" className="flex-1 flex items-center justify-center p-8 sm:p-12 overflow-y-auto">
          <div className="w-full max-w-md">
            <Link href="/" className="md:hidden flex items-center gap-2 justify-center mb-8 hover:opacity-80 transition">
                <Image src={Logo} alt="Postify" width={40} height={40} className="object-contain" />
              <span className="font-[family-name:var(--font-display)] font-bold text-xl text-[#1C1917]">Postify</span>
            </Link>

            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm text-center">
                Authentication failed. Please try again.
              </div>
            )}

            <AuthCard onGoogleAuth={handleGoogleAuth} />
          </div>
        </main>
      </div>
    </AuthRedirect>
  );
}
