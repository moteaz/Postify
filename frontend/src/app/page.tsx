import Link from "next/link";
import { ArrowRight, Bot, Mail, Shield, Upload, Sparkles, CheckCircle2, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-[#020617] text-slate-50">
      {/* Dynamic Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[150px] pointer-events-none" />

      <header className="px-6 lg:px-12 h-20 flex items-center border-b border-white/5 glass sticky top-0 z-50">
        <Link className="flex items-center justify-center space-x-3 group" href="/">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25 group-hover:rotate-6 transition-transform">
            <Bot className="text-white w-6 h-6" />
          </div>
          <span className="font-black text-2xl tracking-tighter">Postify</span>
        </Link>
        <nav className="ml-auto flex gap-8 items-center">
          <Link className="text-sm font-semibold text-slate-400 hover:text-white transition-colors hidden md:block" href="#features">
            Features
          </Link>
          <Link className="text-sm font-semibold text-slate-400 hover:text-white transition-colors hidden md:block" href="#how-it-works">
            How it works
          </Link>
          <div className="flex items-center gap-4">
            <Link
              className="text-sm font-bold text-slate-300 hover:text-white transition-colors"
              href="/login"
            >
              Sign In
            </Link>
            <Link
              className="text-sm font-bold bg-primary text-white px-6 py-2.5 rounded-full hover:shadow-xl hover:shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
              href="/signup"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 lg:py-32 xl:py-40 flex flex-col items-center text-center relative z-10">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-sm font-medium text-primary animate-in fade-in slide-in-from-top-4 duration-1000">
                <Sparkles size={16} />
                <span>AI-Powered Job Hunting</span>
              </div>

              <h1 className="text-5xl font-black tracking-tight sm:text-7xl md:text-8xl lg:text-9xl max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                Land Your Dream Job <br className="hidden md:block" />
                <span className="bg-gradient-to-r from-primary via-purple-400 to-primary bg-[length:200%_auto] animate-gradient text-transparent bg-clip-text">In Seconds.</span>
              </h1>

              <p className="mx-auto max-w-[800px] text-slate-400 md:text-2xl text-lg leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                Upload your CV once. Let our AI analyze job descriptions and craft perfectly tailored applications
                sent directly from your Gmail.
              </p>

              <div className="flex flex-col sm:row gap-6 mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                <Link
                  href="/signup"
                  className="inline-flex h-16 items-center justify-center rounded-2xl bg-primary px-10 text-lg font-bold text-white shadow-2xl shadow-primary/30 transition-all hover:scale-105 hover:shadow-primary/50 active:scale-95"
                >
                  Start Applying for Free
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Link>
                <Link
                  href="#features"
                  className="inline-flex h-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm px-10 text-lg font-bold shadow-sm transition-all hover:bg-white/10"
                >
                  See How It Works
                </Link>
              </div>

              {/* Mock Dashboard Preview */}
              <div className="mt-20 w-full max-w-6xl mx-auto rounded-[2.5rem] border border-white/10 glass p-4 shadow-2xl relative group animate-in zoom-in-95 duration-1000 delay-500">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/30 transition-colors" />
                <div className="w-full aspect-[16/10] rounded-[2rem] bg-[#0f172a] overflow-hidden relative shadow-inner">
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-full h-full p-8 space-y-6">
                      <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <div className="flex gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500/50" />
                          <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                          <div className="w-3 h-3 rounded-full bg-green-500/50" />
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Dashboard Preview</div>
                      </div>
                      <div className="grid grid-cols-12 gap-6">
                        <aside className="col-span-3 space-y-4">
                          <div className="h-10 bg-primary/10 rounded-xl w-full" />
                          <div className="h-10 bg-white/5 rounded-xl w-full" />
                          <div className="h-10 bg-white/5 rounded-xl w-full" />
                        </aside>
                        <div className="col-span-9 space-y-4">
                          <div className="h-40 bg-white/5 rounded-2xl w-full p-6 flex flex-col justify-center items-center text-slate-700 italic border border-dashed border-white/5">
                            [ AI analyzing job description... ]
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="h-20 bg-white/5 rounded-2xl w-full" />
                            <div className="h-20 bg-white/5 rounded-2xl w-full" />
                          </div>
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
        <section id="features" className="w-full py-24 bg-[#0a0f1e]">
          <div className="container px-6 mx-auto">
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-4xl md:text-5xl font-black">Everything you need to <span className="text-primary italic">win</span>.</h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">Stop wasting hours on repetitive cover letters. Focus on the interview, let AI handle the intro.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  icon: <Upload className="w-8 h-8" />,
                  title: "Smart CV Storage",
                  desc: "Upload multiple resumes. Postify lets you toggle between specialized versions for different roles instantly."
                },
                {
                  icon: <Zap className="w-8 h-8" />,
                  title: "Instant Tailoring",
                  desc: "Our AI doesn't just copy-paste. It analyzes tone, keywords, and job requirements to write like a human expert."
                },
                {
                  icon: <Mail className="w-8 h-8" />,
                  title: "Direct Delivery",
                  desc: "Applications are sent directly from YOUR Gmail. No platform proxy emails. Just pure, professional outreach."
                }
              ].map((f, i) => (
                <div key={i} className="group p-10 rounded-[2.5rem] border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-500 flex flex-col items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-3 transition-all">
                    {f.icon}
                  </div>
                  <h3 className="text-2xl font-bold">{f.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="w-full py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/10 animate-pulse" />
          <div className="container px-6 mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-black mb-8">Ready to start your next chapter?</h2>
            <Link
              href="/signup"
              className="inline-flex h-20 items-center justify-center rounded-[2rem] bg-white text-slate-950 px-12 text-2xl font-black hover:scale-105 hover:shadow-2xl transition-all active:scale-95"
            >
              Create Your Free Account
            </Link>
            <p className="mt-6 text-slate-400 font-medium tracking-wide flex items-center justify-center gap-2">
              <CheckCircle2 className="text-green-500 w-5 h-5" /> 20 free generations daily
            </p>
          </div>
        </section>
      </main>

      <footer className="w-full py-12 bg-[#020617] border-t border-white/5 px-6">
        <div className="container mx-auto flex flex-col md:row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
              <Bot size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight">Postify</span>
          </div>

          <div className="flex gap-12">
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Platform</span>
              <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors">Login</Link>
              <Link href="/signup" className="text-sm text-slate-400 hover:text-white transition-colors">Sign Up</Link>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Legal</span>
              <Link href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Privacy</Link>
              <Link href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Terms</Link>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-slate-500">© 2026 Postify AI. Build your future faster.</p>
            <div className="flex items-center justify-end gap-2 mt-2">
              <Shield className="w-3 h-3 text-green-500" />
              <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest italic line-through">Secure OAuth Integration</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
