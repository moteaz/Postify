"use client";

import { useState, useEffect } from "react";
import { AuthCheck } from "@/components/AuthCheck";
import ScrollProgressBar from "@/components/landing/ui/ScrollProgressBar";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import SocialProof from "@/components/landing/SocialProof";
import HowItWorks from "@/components/landing/HowItWorks";
import FeaturesSection from "@/components/landing/FeaturesSection";
import CTABanner from "@/components/landing/CTABanner";
import LandingFooter from "@/components/landing/LandingFooter";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <AuthCheck>
      <div className="min-h-screen bg-[#F9F7F4]">
        <ScrollProgressBar />
        <Navbar />
        <main id="main-content">
          <Hero mounted={mounted} />
          <SocialProof />
          <HowItWorks />
          <FeaturesSection />
          <CTABanner />
        </main>
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
    </AuthCheck>
  );
}
