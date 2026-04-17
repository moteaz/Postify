"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import GoogleButton from "./GoogleButton";

interface AuthCardProps {
  onGoogleAuth: () => Promise<void>;
}

export default function AuthCard({ onGoogleAuth }: AuthCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleClick = async () => {
    setIsLoading(true);
    try {
      await onGoogleAuth();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl md:rounded-3xl p-8 sm:p-10 border border-[#EAE7E3] shadow-[0_8px_40px_rgba(0,0,0,0.08)] w-full max-w-md">
      <div className="min-h-[72px]">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-[#1C1917] tracking-tight">
          Welcome to Postify
        </h2>
        <p className="text-sm text-[#78716C] mt-1.5">Sign in with your Google account to continue</p>
      </div>

      <div className="mt-7">
        <GoogleButton isLoading={isLoading} onClick={handleGoogleClick} />
      </div>

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-[#EAE7E3]" />
        <span className="text-xs text-[#A8A29E] font-medium px-1">Secured by Google</span>
        <div className="flex-1 h-px bg-[#EAE7E3]" />
      </div>

      <div className="flex items-center justify-center gap-2 bg-[#F5F3F0] rounded-2xl py-3 px-4 mt-8">
        <ShieldCheck size={14} className="text-[#85D4B8]" />
        <span className="text-xs text-[#A8A29E]">Your data is encrypted and never shared</span>
      </div>
    </div>
  );
}
