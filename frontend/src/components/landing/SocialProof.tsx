export default function SocialProof() {
  return (
    <section className="py-10 border-y border-[#EAE7E3] bg-[#F5F3F0]">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-xs uppercase tracking-widest text-[#A8A29E] mb-6 text-center">Trusted by job seekers worldwide</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#EAE7E3]">
          <div className="px-10 py-4 sm:py-0 text-center">
            <div className="text-2xl font-bold font-[family-name:var(--font-display)] text-[#1C1917]">10,000+</div>
            <div className="text-xs text-[#78716C] mt-0.5">Cover letters generated</div>
          </div>
          <div className="px-10 py-4 sm:py-0 text-center">
            <div className="text-2xl font-bold font-[family-name:var(--font-display)] text-[#1C1917]">95%</div>
            <div className="text-xs text-[#78716C] mt-0.5">Email delivery rate</div>
          </div>
          <div className="px-10 py-4 sm:py-0 text-center">
            <div className="text-2xl font-bold font-[family-name:var(--font-display)] text-[#1C1917]">&lt; 30s</div>
            <div className="text-xs text-[#78716C] mt-0.5">To generate</div>
          </div>
        </div>
      </div>
    </section>
  );
}
