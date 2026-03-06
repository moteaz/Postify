"use client";

import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Twitter, Github, Linkedin, ArrowUp, Clock, Send, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import Logo from "@/assets/Logo.png";

const PRODUCT_LINKS = [
  { href: "/", label: "Home" },
  { href: "/auth?mode=signup", label: "Generate Cover Letter" },
  { href: "/#how-it-works", label: "How it Works" },
];

const LEGAL_LINKS = [
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/privacy", label: "Privacy Policy" },
];


export default function LandingFooter() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative border-t border-[#EAE7E3] bg-gradient-to-b from-[#F5F3F0] to-[#F9F7F4]">
      {/* Main Footer */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 w-fit">
                <Image src={Logo} alt="Postify" width={30} height={30} className="object-contain" />
              <span className="font-[family-name:var(--font-display)] font-bold text-xl text-[#1C1917]">Postify</span>
            </Link>
            <p className="text-sm text-[#78716C] leading-relaxed max-w-xs">
              AI-powered cover letters that land interviews. Fast, personalized, and professional.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#85D4B8]">
              <ShieldCheck size={14} />
              <span className="font-medium">Secured by Google OAuth</span>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#1C1917] mb-4">Product</h3>
            <ul className="space-y-3">
              {PRODUCT_LINKS.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-[#78716C] hover:text-[#7C9EE8] transition-colors duration-200 inline-block hover:translate-x-0.5"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#1C1917] mb-4">Legal</h3>
            <ul className="space-y-3">
              {LEGAL_LINKS.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-[#78716C] hover:text-[#7C9EE8] transition-colors duration-200 inline-block hover:translate-x-0.5"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#1C1917] mb-4">Contact</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:support@postify.app"
                  className="text-sm text-[#78716C] hover:text-[#7C9EE8] transition-colors duration-200 flex items-center gap-2 group"
                >
                  <Mail size={14} className="group-hover:scale-110 transition-transform" />
                  support@postify.app
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@postify.app?subject=Support Request"
                  className="text-sm text-[#78716C] hover:text-[#7C9EE8] transition-colors duration-200 flex items-center gap-2 group"
                >
                  <Send size={14} className="group-hover:scale-110 transition-transform" />
                  Send us a message
                </a>
              </li>
              <li className="flex items-center gap-2 text-xs text-[#A8A29E]">
                <Clock size={14} />
                <span>Mon-Fri, 9AM-6PM EST</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#EAE7E3]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#78716C] order-2 sm:order-1">
            © {new Date().getFullYear()} Postify • Made with ❤️ by Moetaz, for job seekers
          </p>
          <div className="flex items-center gap-5 order-1 sm:order-2">
            <Link href="/terms" className="text-xs font-medium text-[#78716C] hover:text-[#7C9EE8] transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="text-xs font-medium text-[#78716C] hover:text-[#7C9EE8] transition-colors">
              Privacy
            </Link>
            {showBackToTop && (
              <button
                onClick={scrollToTop}
                className="ml-2 w-9 h-9 rounded-xl bg-white border border-[#EAE7E3] text-[#78716C] flex items-center justify-center hover:border-[#7C9EE8] hover:text-[#7C9EE8] hover:shadow-sm transition-all duration-200 group"
                aria-label="Back to top"
              >
                <ArrowUp size={15} strokeWidth={2} className="group-hover:-translate-y-0.5 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
