import Link from "next/link";
import { ArrowRight, Bot, Mail, Shield, Upload } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full hero-gradient pointer-events-none -z-10" />

      <header className="px-4 lg:px-6 h-14 flex items-center border-b border-white/10 glass sticky top-0 z-50">
        <Link className="flex items-center justify-center space-x-2" href="/">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Bot className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">Postify</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#features">
            Features
          </Link>
          <Link
            className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-full hover:opacity-90 transition-all"
            href="/login"
          >
            Sign In
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 flex flex-col items-center text-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="inline-block rounded-lg bg-primary/20 px-3 py-1 text-sm text-primary animate-pulse">
                New: AI Language Detection
              </div>
              <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Land Your Dream Job <br className="hidden md:block" />
                <span className="text-primary italic">Faster</span> with AI.
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl text-lg">
                Upload your CV once. Paste a job description. Let AI do the heavy lifting of writing and sending your
                application in seconds.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link
                  href="/login"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-white shadow transition-all hover:scale-105 hover:shadow-primary/25"
                >
                  Start Applying Now
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
                <Link
                  href="#features"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-background px-8 text-sm font-medium shadow-sm transition-all hover:bg-muted"
                >
                  How it works
                </Link>
              </div>
              <div className="mt-12 w-full max-w-5xl mx-auto rounded-xl border border-white/10 glass p-2">
                <div className="w-full aspect-video rounded-lg bg-slate-900 overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center text-white/20 font-mono italic">
                    [ Dashboard Preview Image ]
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-slate-50 dark:bg-slate-900/50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-3">
              <div className="flex flex-col items-start space-y-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Upload className="text-primary w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Smart CV Management</h3>
                <p className="text-muted-foreground">
                  Upload multiple CVs and choose the right one for each role. Postify stores them securely.
                </p>
              </div>
              <div className="flex flex-col items-start space-y-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Bot className="text-primary w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">AI Personalized Letters</h3>
                <p className="text-muted-foreground">
                  Our AI analyzes the job description and your CV to write a perfectly tailored cover letter in the
                  appropriate language.
                </p>
              </div>
              <div className="flex flex-col items-start space-y-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Mail className="text-primary w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Direct Gmail Sending</h3>
                <p className="text-muted-foreground">
                  Send applications directly from your own Gmail account. No nore "via platform" emails that get missed
                  by recruiters.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-6 bg-background border-t">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© 2026 Postify AI. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <Shield className="w-4 h-4 text-muted-foreground line-through" />
            <span className="text-sm text-muted-foreground uppercase tracking-widest font-semibold italic">Secure & Private</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
