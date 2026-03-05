"use client";

import { motion } from "framer-motion";
import { ClipboardPaste, Sparkles, Send } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { staggerContainer, staggerContainerSlow, fadeUp, popIn, cardEntrance } from "@/lib/animations";

export default function HowItWorks() {
  const { ref, isInView } = useScrollReveal();

  const steps = [
    {
      icon: ClipboardPaste,
      bg: "bg-[#EEF3FD]",
      color: "text-[#7C9EE8]",
      number: "01",
      title: "Paste the Job Description",
      description: "Copy any job posting URL or text and paste it into Postify. We'll extract the key requirements automatically."
    },
    {
      icon: Sparkles,
      bg: "bg-[#FFF0F6]",
      color: "text-[#F0A8C0]",
      number: "02",
      title: "AI Crafts Your Letter",
      description: "Our AI analyzes the job and your profile to generate a personalized, professional cover letter in seconds."
    },
    {
      icon: Send,
      bg: "bg-[#EDFAF5]",
      color: "text-[#85D4B8]",
      number: "03",
      title: "Review & Send via Email",
      description: "Read through your letter, make any tweaks, then hit Send. It goes straight to the employer's inbox — no copy-paste needed."
    }
  ];

  return (
    <section id="how-it-works" className="py-24 px-4 max-w-5xl mx-auto">
      <motion.div 
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="text-center"
      >
        <motion.div variants={popIn} className="text-xs font-bold uppercase tracking-widest text-[#7C9EE8] mb-3">HOW IT WORKS</motion.div>
        <motion.h2 variants={fadeUp} className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-[#1C1917] tracking-tight">From job post to sent letter in 3 steps</motion.h2>
        <motion.p variants={fadeUp} className="text-base text-[#78716C] mt-3 max-w-lg mx-auto">Simple, fast, and effective. Get your application out the door in under a minute.</motion.p>
      </motion.div>

      <motion.div 
        variants={staggerContainerSlow}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-14"
      >
        {steps.map((step, i) => (
          <motion.div 
            key={step.number} 
            variants={cardEntrance}
            whileHover={{ y: -6, boxShadow: "0 12px 32px rgba(0,0,0,0.1)", transition: { duration: 0.2 } }}
            className="bg-white rounded-2xl p-7 border border-[#EAE7E3] hover:shadow-lg transition-all duration-200"
          >
            <motion.div 
              initial={{ scale: 0, rotate: -10 }}
              animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -10 }}
              transition={{ delay: 0.2 + i * 0.12, type: "spring", stiffness: 300, damping: 20 }}
              className={`rounded-2xl p-3.5 w-fit mb-5 ${step.bg}`}
            >
              <step.icon className={step.color} size={22} />
            </motion.div>
            <div className="text-[10px] font-bold text-[#A8A29E] uppercase tracking-widest mb-2">Step {step.number}</div>
            <h3 className="text-base font-semibold text-[#1C1917] font-[family-name:var(--font-display)] mb-2">{step.title}</h3>
            <p className="text-sm text-[#78716C] leading-relaxed">{step.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
