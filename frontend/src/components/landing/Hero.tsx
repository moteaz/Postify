import Link from "next/link";

interface HeroProps {
  mounted: boolean;
}

export default function Hero({ mounted }: HeroProps) {
  return (
    <section className="pt-24 pb-20 px-4 text-center max-w-4xl mx-auto relative overflow-hidden">
      <div className="w-80 h-80 bg-[#7C9EE8]/12 rounded-full blur-3xl absolute -top-20 -left-20 pointer-events-none" />
      <div className="w-96 h-96 bg-[#F0A8C0]/12 rounded-full blur-3xl absolute -bottom-20 -right-20 pointer-events-none" />

      <div className={`transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '100ms' }}>
        <div className="inline-flex items-center gap-2 bg-white border border-[#EAE7E3] rounded-full px-4 py-1.5 text-xs font-semibold text-[#7C9EE8] shadow-sm mb-6">
          ✦ AI-Powered Cover Letters — Free to use
        </div>
      </div>

      <h1 className={`font-[family-name:var(--font-display)] font-bold tracking-tight text-4xl sm:text-5xl lg:text-6xl text-[#1C1917] max-w-3xl mx-auto leading-[1.1] transition-all duration-600 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '200ms' }}>
        Land Your Dream Job{" "}
        <span className="relative inline-block">
          One Click Away
          <span className="absolute h-3 bg-[#F0A8C0]/40 bottom-1 left-0 right-0 -z-10 rounded" />
        </span>
      </h1>

      <p className={`text-lg sm:text-xl text-[#78716C] mt-6 max-w-xl mx-auto leading-relaxed transition-all duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '300ms' }}>
        Paste any job description, get a tailored cover letter in seconds, review it, and send it directly — all in one place.
      </p>

      <div className={`flex flex-col sm:flex-row items-center justify-center gap-3 mt-10 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '400ms' }}>
        <Link href="/auth?mode=signup" className="bg-gradient-to-br from-[#7C9EE8] to-[#6B8DD6] text-white px-7 py-3.5 rounded-2xl text-sm font-semibold hover:shadow-[0_8px_24px_rgba(124,158,232,0.3)] hover:-translate-y-0.5 transition-all duration-200 active:scale-95">
          Start Writing for Free →
        </Link>
        <a href="#how-it-works" className="bg-white border border-[#EAE7E3] text-[#78716C] px-7 py-3.5 rounded-2xl text-sm font-medium hover:border-[#7C9EE8] hover:text-[#7C9EE8] transition-all duration-200">
          See How It Works
        </a>
      </div>

      <div className="text-xs text-[#A8A29E] flex flex-wrap items-center justify-center gap-4 mt-5">
        <span>✓ No credit card required</span>
        <span>✓ Free forever</span>
        <span>✓ Send in 60 seconds</span>
      </div>

      <div className={`mt-16 rounded-3xl overflow-hidden border border-[#EAE7E3] shadow-[0_20px_60px_rgba(0,0,0,0.1)] max-w-3xl mx-auto transition-all duration-600 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: '500ms' }}>
        <div className="hidden sm:grid grid-cols-3 divide-x divide-[#EAE7E3]">
          <div className="bg-[#F5F3F0] p-6">
            <div className="text-xs font-semibold text-[#78716C] mb-3">Job Description</div>
            <div className="text-xs text-[#A8A29E] leading-relaxed">We're looking for a passionate Frontend Developer...</div>
          </div>
          <div className="bg-white p-6 relative overflow-hidden">
            <div className="text-xs font-semibold text-[#1C1917] mb-3">Generated Cover Letter</div>
            <div className="text-xs text-[#78716C] leading-relaxed">Dear Hiring Manager, I am excited to apply for the Frontend Developer position...</div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#7C9EE8]/10 to-transparent animate-shimmer" />
          </div>
          <div className="bg-white p-6 space-y-2">
            <button className="w-full bg-[#F5F3F0] text-[#1C1917] rounded-lg px-4 py-2 text-xs font-medium">Review</button>
            <button className="w-full bg-[#85D4B8] text-white rounded-lg px-4 py-2 text-xs font-semibold">Send via Email</button>
          </div>
        </div>
        <div className="sm:hidden bg-white p-6">
          <div className="text-xs font-semibold text-[#1C1917] mb-3">Generated Cover Letter</div>
          <div className="text-xs text-[#78716C] leading-relaxed mb-4">Dear Hiring Manager, I am excited to apply...</div>
          <button className="w-full bg-[#85D4B8] text-white rounded-lg px-4 py-2 text-xs font-semibold">Send via Email</button>
        </div>
      </div>
    </section>
  );
}
