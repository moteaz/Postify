"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Menu, X } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#F9F7F4]/80 border-b border-[#EAE7E3]">
      <div className="h-16 max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
          <div className="rounded-xl p-1.5 bg-gradient-to-br from-[#7C9EE8] to-[#F0A8C0]">
            <Mail className="text-white" size={14} />
          </div>
          <span className="font-[family-name:var(--font-display)] font-bold text-xl text-[#1C1917]">Postify</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-[#78716C] hover:text-[#1C1917] transition">Features</a>
          <a href="#how-it-works" className="text-sm font-medium text-[#78716C] hover:text-[#1C1917] transition">How it works</a>
          <Link href="/login" className="text-sm font-medium text-[#78716C] hover:text-[#1C1917] transition">Sign in</Link>
        </div>

        <Link href="/signup" className="hidden sm:block bg-[#1C1917] text-white rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-[#7C9EE8] transition-all duration-200">
          Get Started Free
        </Link>

        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#EAE7E3] bg-white">
          <div className="px-4 py-4 space-y-3">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-[#78716C] py-2">Features</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-[#78716C] py-2">How it works</a>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-[#78716C] py-2">Sign in</Link>
            <Link href="/signup" className="block bg-[#1C1917] text-white rounded-xl px-4 py-2.5 text-sm font-semibold text-center">Get Started Free</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
