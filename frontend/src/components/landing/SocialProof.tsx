"use client";

import { motion } from "framer-motion";
import { useScrollReveal } from "@/shared/hooks/use-scroll-reveal";
import { staggerContainer, fadeUp } from "@/lib/animations";

export default function SocialProof() {
  const { ref, isInView } = useScrollReveal();

  return (
    <motion.section 
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="py-10 border-y border-[#EAE7E3] bg-[#F5F3F0]"
    >
      <div className="max-w-5xl mx-auto px-4">
        <motion.div variants={fadeUp} className="text-xs uppercase tracking-widest text-[#A8A29E] mb-6 text-center">Trusted by job seekers worldwide</motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#EAE7E3]">
          <motion.div variants={fadeUp} className="px-10 py-4 sm:py-0 text-center">
            <div className="text-2xl font-bold font-[family-name:var(--font-display)] text-[#1C1917]">10,000+</div>
            <div className="text-xs text-[#78716C] mt-0.5">Cover letters generated</div>
          </motion.div>
          <motion.div variants={fadeUp} className="px-10 py-4 sm:py-0 text-center">
            <div className="text-2xl font-bold font-[family-name:var(--font-display)] text-[#1C1917]">95%</div>
            <div className="text-xs text-[#78716C] mt-0.5">Email delivery rate</div>
          </motion.div>
          <motion.div variants={fadeUp} className="px-10 py-4 sm:py-0 text-center">
            <div className="text-2xl font-bold font-[family-name:var(--font-display)] text-[#1C1917]">&lt; 30s</div>
            <div className="text-xs text-[#78716C] mt-0.5">To generate</div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
