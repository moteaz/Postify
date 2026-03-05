"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { env } from "@/config/env";
import BrandPanel from "@/components/auth/BrandPanel";
import AuthCard from "@/components/auth/AuthCard";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  const handleGoogleAuth = async () => {
    window.location.href = `${env.apiUrl}/auth/google`;
  };

  return (
    <div className="flex min-h-screen bg-[#F9F7F4]">
      <BrandPanel activeTab={activeTab} />

      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <Link href="/" className="md:hidden flex items-center gap-2 justify-center mb-8 hover:opacity-80 transition">
            <div className="rounded-xl p-1.5 bg-gradient-to-br from-[#7C9EE8] to-[#F0A8C0]">
              <Mail className="text-white" size={14} />
            </div>
            <span className="font-[family-name:var(--font-display)] font-bold text-xl text-[#1C1917]">Postify</span>
          </Link>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm text-center">
              Authentication failed. Please try again.
            </div>
          )}

          <AuthCard activeTab={activeTab} onTabChange={setActiveTab} onGoogleAuth={handleGoogleAuth} />
        </div>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
