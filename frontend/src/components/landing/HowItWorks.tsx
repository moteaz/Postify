import { ClipboardPaste, Sparkles, Send } from "lucide-react";

export default function HowItWorks() {
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
      <div className="text-center">
        <div className="text-xs font-bold uppercase tracking-widest text-[#7C9EE8] mb-3">HOW IT WORKS</div>
        <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-[#1C1917] tracking-tight">From job post to sent letter in 3 steps</h2>
        <p className="text-base text-[#78716C] mt-3 max-w-lg mx-auto">Simple, fast, and effective. Get your application out the door in under a minute.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-14">
        {steps.map((step) => (
          <div key={step.number} className="bg-white rounded-2xl p-7 border border-[#EAE7E3] hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
            <div className={`rounded-2xl p-3.5 w-fit mb-5 ${step.bg}`}>
              <step.icon className={step.color} size={22} />
            </div>
            <div className="text-[10px] font-bold text-[#A8A29E] uppercase tracking-widest mb-2">Step {step.number}</div>
            <h3 className="text-base font-semibold text-[#1C1917] font-[family-name:var(--font-display)] mb-2">{step.title}</h3>
            <p className="text-sm text-[#78716C] leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
