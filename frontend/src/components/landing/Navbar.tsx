"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Menu, X, Sparkles, Zap, LogIn, ChevronRight, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, fadeUp } from "@/lib/animations";

const NAV_LINKS = [
  {
    href: "#features",
    label: "Features",
    description: "See what Postify can do",
    icon: Sparkles,
    iconBg: "bg-[#EEF3FD]",
    iconColor: "text-[#7C9EE8]",
  },
  {
    href: "#how-it-works",
    label: "How it works",
    description: "3 steps to your next job",
    icon: Zap,
    iconBg: "bg-[#FFF0F6]",
    iconColor: "text-[#F0A8C0]",
  },
  {
    href: "/auth?mode=login",
    label: "Sign in",
    description: "Access your account",
    icon: LogIn,
    iconBg: "bg-[#EDFAF5]",
    iconColor: "text-[#85D4B8]",
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setIsOpen(false) }, [pathname]);
  
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isOpen]);

  return (
    <>
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
            <Link href="/auth?mode=login" className="text-sm font-medium text-[#78716C] hover:text-[#1C1917] transition">Sign in</Link>
          </div>

          <Link href="/auth?mode=signup" className="hidden sm:block bg-gradient-to-br from-[#7C9EE8] to-[#6B8DD6] text-white rounded-xl px-4 py-2.5 text-sm font-semibold hover:shadow-[0_4px_16px_rgba(124,158,232,0.3)] hover:-translate-y-0.5 transition-all duration-200">
            Get Started Free
          </Link>

          <motion.button 
            onClick={() => setIsOpen(prev => !prev)}
            whileTap={{ scale: 0.9 }}
            className="w-9 h-9 rounded-xl bg-[#F5F3F0] border border-[#EAE7E3] flex items-center justify-center hover:bg-white hover:border-[#7C9EE8] transition-all duration-150 md:hidden"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div key="x"
                  initial={{ opacity: 0, rotate: -90, scale: 0.7 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.7 }}
                  transition={{ duration: 0.15 }}>
                  <X size={16} className="text-[#78716C]" />
                </motion.div>
              ) : (
                <motion.div key="menu"
                  initial={{ opacity: 0, rotate: 90, scale: 0.7 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: -90, scale: 0.7 }}
                  transition={{ duration: 0.15 }}>
                  <Menu size={16} className="text-[#78716C]" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute top-[calc(100%+8px)] left-4 right-4 z-50 bg-white rounded-2xl border border-[#EAE7E3] shadow-[0_16px_48px_rgba(0,0,0,0.12)] overflow-hidden md:hidden"
            >
              <div className="h-[3px] w-full bg-gradient-to-r from-[#7C9EE8] to-[#F0A8C0]" />
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#EAE7E3]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7C9EE8] to-[#F0A8C0] flex items-center justify-center">
                      <Mail size={14} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#1C1917] font-[family-name:var(--font-display)]">Postify</p>
                      <p className="text-[10px] text-[#A8A29E]">AI Cover Letters</p>
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-xl bg-[#F5F3F0] border border-[#EAE7E3] flex items-center justify-center hover:bg-[#FFE4E6] hover:border-[#F0A8C0] transition-all duration-150"
                  >
                    <X size={15} className="text-[#78716C]" />
                  </motion.button>
                </div>

                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="space-y-1"
                >
                  {NAV_LINKS.map(link => (
                    <motion.div key={link.href} variants={fadeUp}>
                      <a
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-3.5 py-3 rounded-xl hover:bg-[#F5F3F0] transition-all duration-150 group"
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${link.iconBg} transition-transform duration-150 group-hover:scale-110`}>
                          <link.icon size={15} className={link.iconColor} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#1C1917]">{link.label}</p>
                          <p className="text-[10px] text-[#A8A29E] mt-0.5">{link.description}</p>
                        </div>
                        <ChevronRight size={14} className="ml-auto text-[#A8A29E] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-150" />
                      </a>
                    </motion.div>
                  ))}
                </motion.div>

                <div className="flex items-center gap-2 my-4">
                  <div className="flex-1 h-px bg-[#EAE7E3]" />
                  <span className="text-[10px] text-[#A8A29E] font-medium px-1">Get started</span>
                  <div className="flex-1 h-px bg-[#EAE7E3]" />
                </div>

                <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-2">
                  <motion.div variants={fadeUp}>
                    <Link
                      href="/auth?mode=signup"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-gradient-to-br from-[#7C9EE8] to-[#6B8DD6] text-white text-sm font-semibold hover:shadow-[0_8px_24px_rgba(124,158,232,0.3)] transition-all duration-200"
                    >
                      <Zap size={15} />
                      Get Started Free
                    </Link>
                  </motion.div>
                  <motion.div variants={fadeUp}>
                    <Link
                      href="/auth?mode=login"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-[#F5F3F0] border border-[#EAE7E3] text-sm font-medium text-[#78716C] hover:border-[#7C9EE8] hover:text-[#7C9EE8] transition-all duration-150"
                    >
                      <LogIn size={15} />
                      Sign in
                    </Link>
                  </motion.div>
                </motion.div>

                <div className="mt-4 pt-4 border-t border-[#EAE7E3] flex items-center justify-center gap-1.5">
                  <ShieldCheck size={11} className="text-[#85D4B8]" />
                  <span className="text-[10px] text-[#A8A29E]">Free forever · No credit card required</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-black/25 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}
