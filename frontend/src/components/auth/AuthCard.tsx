"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import GoogleButton from "./GoogleButton";
import TermsCheckbox from "./TermsCheckbox";

interface AuthCardProps {
  activeTab: "login" | "signup";
  onTabChange: (tab: "login" | "signup") => void;
  onGoogleAuth: () => Promise<void>;
}

export default function AuthCard({ activeTab, onTabChange, onGoogleAuth }: AuthCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [animating, setAnimating] = useState(false);

  const switchTab = (tab: "login" | "signup") => {
    if (tab === activeTab) return;
    setAnimating(true);
    setTimeout(() => {
      onTabChange(tab);
      setTermsError(false);
      setTermsAccepted(false);
      setAnimating(false);
    }, 150);
  };

  const handleGoogleClick = async () => {
    if (activeTab === "signup" && !termsAccepted) {
      setTermsError(true);
      return;
    }
    setIsLoading(true);
    try {
      await onGoogleAuth();
    } finally {
      setIsLoading(false);
    }
  };

  const content = {
    login: {
      title: "Sign in to Postify",
      subtitle: "Continue with your Google account",
    },
    signup: {
      title: "Create your account",
      subtitle: "Start writing better cover letters today",
    },
  };

  return (
    <div className="bg-white rounded-3xl md:rounded-3xl p-8 sm:p-10 border border-[#EAE7E3] shadow-[0_8px_40px_rgba(0,0,0,0.08)] w-full max-w-md">
      {/* Toggle */}
      <div className="bg-[#F5F3F0] rounded-2xl p-1 flex gap-1 w-full">
        <button
          onClick={() => switchTab("login")}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-xl text-center transition-all duration-200 ${
            activeTab === "login"
              ? "bg-white text-[#1C1917] shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-[#EAE7E3]"
              : "text-[#A8A29E] hover:text-[#78716C]"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => switchTab("signup")}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-xl text-center transition-all duration-200 ${
            activeTab === "signup"
              ? "bg-white text-[#1C1917] shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-[#EAE7E3]"
              : "text-[#A8A29E] hover:text-[#78716C]"
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Content */}
      <div className={`mt-7 transition-all duration-200 ${animating ? "opacity-0 scale-[0.98]" : "opacity-100 scale-100"}`}>
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-[#1C1917] tracking-tight">
            {content[activeTab].title}
          </h2>
          <p className="text-sm text-[#78716C] mt-1.5">{content[activeTab].subtitle}</p>
        </div>

        <div className="mt-7">
          <GoogleButton isLoading={isLoading} activeTab={activeTab} onClick={handleGoogleClick} />
        </div>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-[#EAE7E3]" />
          <span className="text-xs text-[#A8A29E] font-medium px-1">Secured by Google</span>
          <div className="flex-1 h-px bg-[#EAE7E3]" />
        </div>

        {activeTab === "signup" && (
          <div className="animate-in fade-in duration-250">
            <TermsCheckbox checked={termsAccepted} onChange={setTermsAccepted} hasError={termsError} />
          </div>
        )}

        <div className="flex items-center justify-center gap-2 bg-[#F5F3F0] rounded-2xl py-3 px-4 mt-8">
          <ShieldCheck size={14} className="text-[#85D4B8]" />
          <span className="text-xs text-[#A8A29E]">Your data is encrypted and never shared</span>
        </div>

        <p className="text-xs text-[#A8A29E] text-center mt-5">
          {activeTab === "login" ? (
            <>
              Don't have an account?{" "}
              <button onClick={() => switchTab("signup")} className="text-[#7C9EE8] font-semibold hover:underline">
                Sign up free →
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button onClick={() => switchTab("login")} className="text-[#7C9EE8] font-semibold hover:underline">
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
