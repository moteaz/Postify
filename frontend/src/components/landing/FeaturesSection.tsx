import { Sparkles, Mail, ShieldCheck, Eye, History, FileText } from "lucide-react";

export default function FeaturesSection() {
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
        <div className="text-center">
          <div className="text-xs font-bold uppercase tracking-widest text-[#7C9EE8] mb-3">FEATURES</div>
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-[#1C1917] tracking-tight">Everything you need to get hired faster</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
          {features.map((feature, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-[#EAE7E3] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div className={`rounded-xl p-2.5 w-fit mb-4 ${feature.bg}`}>
                <feature.icon className={feature.color} size={18} />
              </div>
              <h3 className="text-sm font-semibold text-[#1C1917] mb-1.5">{feature.title}</h3>
              <p className="text-xs text-[#78716C] leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
