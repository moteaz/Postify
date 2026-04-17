import Link from "next/link";

export default function CTABanner() {
  return (
    <section className="py-20 px-4 max-w-4xl mx-auto text-center">
      <div className="bg-gradient-to-br from-[#1C1917] to-[#2D2A27] rounded-3xl p-12 sm:p-16 relative overflow-hidden">
        <div className="w-64 h-64 bg-[#7C9EE8]/20 rounded-full blur-3xl absolute -top-10 -right-10 pointer-events-none" />
        <div className="w-48 h-48 bg-[#F0A8C0]/15 rounded-full blur-2xl absolute -bottom-8 -left-8 pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-block bg-white/10 text-white/70 text-xs rounded-full px-3 py-1 mb-6">✦ Free forever — no credit card needed</div>
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-white tracking-tight">Ready to write your next cover letter?</h2>
          <p className="text-[#A8A29E] text-base mt-4 max-w-md mx-auto">Join thousands of job seekers using Postify to stand out and get hired faster.</p>
          <Link href="/auth" className="inline-block mt-8 bg-gradient-to-br from-[#7C9EE8] to-[#6B8DD6] text-white px-8 py-4 rounded-2xl text-base font-semibold hover:shadow-[0_8px_24px_rgba(124,158,232,0.4)] hover:-translate-y-0.5 transition-all duration-200 active:scale-95">
            Start for Free →
          </Link>
          <div className="mt-4">
            <Link href="/auth" className="text-sm text-white/40 hover:text-white/70 transition">Already have an account? Sign in</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
