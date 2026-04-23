"use client";

import { motion } from "framer-motion";
import { Sparkles, Mail, ShieldCheck, Eye, History, FileText } from "lucide-react";
import { useScrollReveal } from "@/shared/hooks/use-scroll-reveal";
import { staggerContainer, fadeUp, popIn, cardEntrance } from "@/lib/animations";

export default function FeaturesSection() {
  const { ref, isInView } = useScrollReveal();

  const features = [
    { icon: Sparkles, bg: "bg-[#EEF3FD]", color: "text-[#7C9EE8]", title: "AI Cover Letter Generation", description: "Tailored to every job description. Professional, personal, and ready in seconds." },
    { icon: Mail, bg: "bg-[#FFF0F6]", color: "text-[#F0A8C0]", title: "One-Click Email Send", description: "Send your cover letter directly to employers without leaving the app." },
    { icon: ShieldCheck, bg: "bg-[#EDFAF5]", color: "text-[#85D4B8]", title: "OAuth Login", description: "Sign in securely with Google or your email. No passwords to remember." },
    { icon: Eye, bg: "bg-[#FFF4ED]", color: "text-[#F5C4A0]", title: "Smart Review Mode", description: "Read through your letter before sending. Edit inline with live preview." },
    { icon: History, bg: "bg-[#EEF3FD]", color: "text-[#7C9EE8]", title: "Application History", description: "Track every application you've sent. Never lose track of where you applied." },
    { icon: FileText, bg: "bg-[#FFF0F6]", color: "text-[#F0A8C0]", title: "Multiple CV Support", description: "Upload multiple CVs and choose the right one for each application." }
  ];

  return (
    <section id="features" className="py-24 px-4 bg-[#F5F3F0]">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center"
        >
          <motion.div variants={popIn} className="text-xs font-bold uppercase tracking-widest text-[#7C9EE8] mb-3">FEATURES</motion.div>
          <motion.h2 variants={fadeUp} className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-[#1C1917] tracking-tight">Everything you need to get hired faster</motion.h2>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12"
        >
          {features.map((feature, i) => (
            <motion.div 
              key={i} 
              variants={cardEntrance}
              whileHover={{ y: -4, scale: 1.01, boxShadow: "0 8px 24px rgba(0,0,0,0.08)", transition: { duration: 0.15 } }}
              whileTap={{ scale: 0.99 }}
              className="bg-white rounded-2xl p-6 border border-[#EAE7E3] hover:shadow-md transition-all duration-200"
            >
              <motion.div 
                whileHover={{ rotate: [0, -8, 8, 0] }}
                transition={{ duration: 0.4 }}
                className={`rounded-xl p-2.5 w-fit mb-4 ${feature.bg}`}
              >
                <feature.icon className={feature.color} size={18} />
              </motion.div>
              <h3 className="text-sm font-semibold text-[#1C1917] mb-1.5">{feature.title}</h3>
              <p className="text-xs text-[#78716C] leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
