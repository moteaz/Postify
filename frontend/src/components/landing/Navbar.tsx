"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, fadeUp } from "@/lib/animations";

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

        <motion.button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          className="md:hidden p-2"
          whileTap={{ scale: 0.95 }}
        >
          <motion.div animate={{ rotate: mobileMenuOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div
                  key="x"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.15 }}
                >
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="md:hidden border-t border-[#EAE7E3] bg-white absolute top-full left-0 right-0 z-50 shadow-xl"
            >
              <motion.div 
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="px-4 py-4 space-y-3"
              >
                <motion.a variants={fadeUp} href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-[#78716C] py-2">Features</motion.a>
                <motion.a variants={fadeUp} href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-[#78716C] py-2">How it works</motion.a>
                <motion.div variants={fadeUp}>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-[#78716C] py-2">Sign in</Link>
                </motion.div>
                <motion.div variants={fadeUp}>
                  <Link href="/signup" className="block bg-[#1C1917] text-white rounded-xl px-4 py-2.5 text-sm font-semibold text-center">Get Started Free</Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
