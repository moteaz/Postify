import Link from "next/link";
import { Mail, Sparkles, Zap } from "lucide-react";

interface BrandPanelProps {
  activeTab: "login" | "signup";
}

export default function BrandPanel({ activeTab }: BrandPanelProps) {
  const copy = {
    login: {
      headline: "Welcome back.",
      sub: "Your next cover letter is one click away.",
    },
    signup: {
      headline: "Land your dream job.",
      sub: "Generate tailored cover letters in seconds and send them directly.",
    },
  };

  return (
    <div className="hidden md:flex bg-gradient-to-br from-[#1C1917] to-[#2D2A27] h-screen sticky top-0 flex-col justify-between p-12 relative overflow-hidden">
      <div className="w-72 h-72 bg-[#7C9EE8]/15 rounded-full blur-3xl absolute -top-20 -right-20 pointer-events-none" />
      <div className="w-64 h-64 bg-[#F0A8C0]/10 rounded-full blur-3xl absolute -bottom-20 -left-20 pointer-events-none" />

      <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition relative z-10">
        <div className="rounded-xl p-2 bg-gradient-to-br from-[#7C9EE8] to-[#F0A8C0]">
          <Mail className="text-white" size={16} />
        </div>
        <span className="font-[family-name:var(--font-display)] font-bold text-2xl text-white">Postify</span>
      </Link>

      <div className="relative z-10 transition-opacity duration-300">
        <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
          {copy[activeTab].headline}
        </h1>
        <p className="text-[#A8A29E] text-base mt-3 leading-relaxed max-w-xs">
          {copy[activeTab].sub}
        </p>

        <div className="mt-8 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <Sparkles size={15} className="text-[#7C9EE8]" />
            </div>
            <span className="text-sm text-white/70">AI-powered cover letters</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <Mail size={15} className="text-[#F0A8C0]" />
            </div>
            <span className="text-sm text-white/70">Send directly to employers</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <Zap size={15} className="text-[#85D4B8]" />
            </div>
            <span className="text-sm text-white/70">Ready in under 30 seconds</span>
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <p className="text-xs text-white/30 mb-3">Join 10,000+ job seekers</p>
        <div className="flex items-center">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#7C9EE8] to-[#6B8DD6] border-2 border-[#1C1917]" />
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#F0A8C0] to-[#E89BB0] border-2 border-[#1C1917] -ml-2" />
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#85D4B8] to-[#74C3A7] border-2 border-[#1C1917] -ml-2" />
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#F5C4A0] to-[#E4B390] border-2 border-[#1C1917] -ml-2" />
        </div>
      </div>
    </div>
  );
}
