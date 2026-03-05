"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import SocialProof from "@/components/landing/SocialProof";
import HowItWorks from "@/components/landing/HowItWorks";
import FeaturesSection from "@/components/landing/FeaturesSection";
import CTABanner from "@/components/landing/CTABanner";
import LandingFooter from "@/components/landing/LandingFooter";

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F7F4] overflow-x-hidden">
      <div className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-[#7C9EE8] to-[#F0A8C0] z-[100] transition-all duration-150" style={{ width: `${scrollProgress}%` }} />
      <Navbar />
      <Hero mounted={mounted} />
      <SocialProof />
      <HowItWorks />
      <FeaturesSection />
      <CTABanner />
      <LandingFooter />
      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}
