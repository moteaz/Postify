"use client";

import { Bot, LogIn, Sparkles } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    const handleGoogleLogin = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/google`;
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4 relative overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                {/* Branding Area */}
                <div className="flex flex-col items-center mb-10 space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="w-20 h-20 rounded-[2rem] bg-primary flex items-center justify-center text-white shadow-2xl shadow-primary/40 group hover:rotate-6 transition-transform cursor-pointer">
                        <Bot size={40} />
                    </div>
                    <div className="text-center space-y-1">
                        <h1 className="text-4xl font-black tracking-tight flex items-center gap-2">
                            Postify <Sparkles className="text-primary w-6 h-6 animate-pulse" />
                        </h1>
                        <p className="text-muted-foreground text-lg">Welcome back, Job Hunter.</p>
                    </div>
                </div>

                {/* Auth Card */}
                <div className="p-10 rounded-[2.5rem] border border-white/10 glass shadow-2xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">

                    {error && (
                        <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium text-center">
                            Authentication failed. Please try again.
                        </div>
                    )}

                    <div className="space-y-4">
                        <button
                            onClick={handleGoogleLogin}
                            className="w-full h-16 flex items-center justify-center gap-4 bg-white text-slate-900 rounded-2xl font-bold text-lg shadow-sm hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98] transition-all border border-slate-200 group"
                        >
                            <img
                                src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
                                alt="Google"
                                className="w-7 h-7 group-hover:scale-110 transition-transform"
                            />
                            Continue with Google
                        </button>

                        <p className="text-xs text-center text-muted-foreground/60 leading-relaxed max-w-[240px] mx-auto">
                            Secure login with Google OAuth. Your data is always protected.
                        </p>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border"></span>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-[#0f172a] px-4 text-[10px] font-bold tracking-widest text-muted-foreground/40 uppercase">
                                New to Postify?
                            </span>
                        </div>
                    </div>

                    <div className="text-center">
                        <Link
                            href="/signup"
                            className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all group"
                        >
                            Create an account
                            <LogIn size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* Footer Meta */}
                <div className="mt-8 flex justify-center gap-6 text-[11px] font-medium text-muted-foreground/40 uppercase tracking-widest">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <span className="cursor-default">•</span>
                    <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
                    <span className="cursor-default">•</span>
                    <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
                </div>
            </div>
        </div>
    );
}
