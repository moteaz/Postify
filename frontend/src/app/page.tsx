"use client";

import Link from "next/link";
import { ArrowRight, Bot, Mail, Shield, Upload, Sparkles, CheckCircle2, Zap, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <Link className="flex items-center space-x-2 group" href="/">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
              <Bot className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-lg sm:text-xl text-neutral-900">Postify</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors" href="#features">
              Features
            </Link>
            <Link className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors" href="#how-it-works">
              How it works
            </Link>
            <Link
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
              href="/login"
            >
              Sign In
            </Link>
            <Link
              className="inline-flex items-center justify-center h-10 px-4 lg:px-6 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm hover:shadow-md"
              href="/signup"
            >
              Get Started
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 bg-white">
            <nav className="container mx-auto px-4 py-4 flex flex-col space-y-3">
              <Link className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors py-2" href="#features" onClick={() => setMobileMenuOpen(false)}>
                Features
              </Link>
              <Link className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors py-2" href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>
                How it works
              </Link>
              <Link
                className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors py-2"
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm mt-2"
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 sm:py-16 md:py-24 lg:py-32 xl:py-40">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8 max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-primary">
                <Sparkles size={14} />
                <span>AI-Powered Job Applications</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-neutral-900 leading-tight">
                Land Your Dream Job{" "}
                <span className="text-primary">In Seconds</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-neutral-600 max-w-2xl leading-relaxed px-4">
                Upload your CV once. Let our AI analyze job descriptions and craft perfectly tailored applications sent directly from your Gmail.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 w-full sm:w-auto px-4 sm:px-0">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center h-12 sm:h-12 px-6 sm:px-8 rounded-full bg-primary text-white font-semibold hover:bg-primary/90 transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
                >
                  Start Applying for Free
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
                <Link
                  href="#features"
                  className="inline-flex items-center justify-center h-12 sm:h-12 px-6 sm:px-8 rounded-full border border-neutral-300 bg-white text-neutral-900 font-semibold hover:bg-neutral-50 transition-all text-sm sm:text-base"
                >
                  See How It Works
                </Link>
              </div>

              {/* Dashboard Preview */}
              <div className="mt-12 sm:mt-16 w-full max-w-5xl mx-auto rounded-xl sm:rounded-2xl border border-neutral-200 bg-white p-1 sm:p-2 shadow-elevated">
                <div className="w-full aspect-[16/9] rounded-lg sm:rounded-xl bg-neutral-50 overflow-hidden">
                  <div className="w-full h-full p-4 sm:p-6 md:p-8 space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-neutral-200">
                      <div className="flex gap-1.5 sm:gap-2">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-neutral-300" />
                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-neutral-300" />
                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-neutral-300" />
                      </div>
                      <div className="text-[10px] sm:text-xs font-medium text-neutral-400 uppercase tracking-wider">Dashboard Preview</div>
                    </div>
                    <div className="grid grid-cols-12 gap-2 sm:gap-3 md:gap-4">
                      <div className="col-span-12 sm:col-span-3 space-y-2 sm:space-y-3">
                        <div className="h-8 sm:h-10 bg-primary/10 rounded-lg" />
                        <div className="h-8 sm:h-10 bg-white rounded-lg border border-neutral-200" />
                        <div className="hidden sm:block h-10 bg-white rounded-lg border border-neutral-200" />
                      </div>
                      <div className="col-span-12 sm:col-span-9 space-y-2 sm:space-y-3">
                        <div className="h-24 sm:h-32 bg-white rounded-lg sm:rounded-xl border border-neutral-200 flex items-center justify-center">
                          <span className="text-xs sm:text-sm text-neutral-400">AI analyzing job description...</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                          <div className="h-16 sm:h-20 bg-white rounded-lg sm:rounded-xl border border-neutral-200" />
                          <div className="h-16 sm:h-20 bg-white rounded-lg sm:rounded-xl border border-neutral-200" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="w-full py-12 sm:py-16 md:py-24 bg-neutral-50" aria-labelledby="features-heading">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16 space-y-3 sm:space-y-4">
              <h2 id="features-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900">Everything you need to <span className="text-primary">win</span></h2>
              <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto px-4">Stop wasting hours on repetitive cover letters. Focus on the interview, let AI handle the intro.</p>
            </div>
            <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {[
                {
                  icon: <Upload className="w-5 h-5 sm:w-6 sm:h-6" />,
                  title: "Smart CV Storage",
                  desc: "Upload multiple resumes. Postify lets you toggle between specialized versions for different roles instantly."
                },
                {
                  icon: <Zap className="w-5 h-5 sm:w-6 sm:h-6" />,
                  title: "Instant Tailoring",
                  desc: "Our AI doesn't just copy-paste. It analyzes tone, keywords, and job requirements to write like a human expert."
                },
                {
                  icon: <Mail className="w-5 h-5 sm:w-6 sm:h-6" />,
                  title: "Direct Delivery",
                  desc: "Applications are sent directly from YOUR Gmail. No platform proxy emails. Just pure, professional outreach."
                }
              ].map((f, i) => (
                <div key={i} className="group p-6 sm:p-8 rounded-xl sm:rounded-2xl border border-neutral-200 bg-white hover:shadow-card transition-all duration-300">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                    {f.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-2 sm:mb-3">{f.title}</h3>
                  <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 sm:py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 px-4">Ready to start your next chapter?</h2>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center h-12 sm:h-14 px-8 sm:px-10 rounded-full bg-primary text-white text-base sm:text-lg font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
              >
                Create Your Free Account
              </Link>
              <p className="flex items-center justify-center gap-2 text-sm sm:text-base text-neutral-600 font-medium">
                <CheckCircle2 className="text-green-500 w-4 h-4 sm:w-5 sm:h-5" /> 20 free generations daily
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 sm:py-12 border-t border-neutral-200 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Bot size={18} />
              </div>
              <span className="font-bold text-base sm:text-lg text-neutral-900">Postify</span>
            </div>

            <div className="flex gap-8 sm:gap-12">
              <div className="flex flex-col gap-3 text-center md:text-left">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Platform</span>
                <Link href="/login" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">Login</Link>
                <Link href="/signup" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">Sign Up</Link>
              </div>
              <div className="flex flex-col gap-3 text-center md:text-left">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Legal</span>
                <Link href="#" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">Privacy</Link>
                <Link href="#" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">Terms</Link>
              </div>
            </div>

            <div className="text-center md:text-right">
              <p className="text-xs sm:text-sm text-neutral-500">© 2026 Postify AI. Build your future faster.</p>
              <div className="flex items-center justify-center md:justify-end gap-2 mt-2">
                <Shield className="w-3 h-3 text-green-500" />
                <span className="text-xs text-neutral-400 font-medium">Secure OAuth Integration</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
