import Link from "next/link";
import { Mail } from "lucide-react";

export default function LandingFooter() {
  return (
    <footer className="border-t border-[#EAE7E3] bg-[#F5F3F0] py-10 px-4">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <div className="rounded-xl p-1.5 bg-gradient-to-br from-[#7C9EE8] to-[#F0A8C0]">
              <Mail className="text-white" size={14} />
            </div>
            <span className="font-[family-name:var(--font-display)] font-bold text-xl text-[#1C1917]">Postify</span>
          </div>
          <div className="text-xs text-[#A8A29E] mt-1">© 2026 Postify. All rights reserved.</div>
        </div>

        <div className="hidden sm:flex items-center gap-6">
          <a href="#features" className="text-xs text-[#A8A29E] hover:text-[#78716C] transition">Features</a>
          <a href="#how-it-works" className="text-xs text-[#A8A29E] hover:text-[#78716C] transition">How it works</a>
          <Link href="#" className="text-xs text-[#A8A29E] hover:text-[#78716C] transition">Privacy</Link>
          <Link href="#" className="text-xs text-[#A8A29E] hover:text-[#78716C] transition">Terms</Link>
        </div>

        <div className="text-xs text-[#A8A29E]">Made with ♥ for job seekers</div>
      </div>
    </footer>
  );
}
