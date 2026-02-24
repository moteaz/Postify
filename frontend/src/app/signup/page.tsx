"use client";

import { Bot, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
    const handleGoogleSignup = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/google`;
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4 relative">
            {/* Decorative Background Elements */}
            <div className="absolute top-20 left-20 w-64 h-64 bg-primary/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse delay-700" />

            <div className="w-full max-w-xl grid md:grid-cols-2 gap-0 overflow-hidden rounded-[2.5rem] border border-white/10 glass shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">

                {/* Left Side: Marketing/Value Prop */}
                <div className="hidden md:flex flex-col justify-between p-10 bg-primary/5 border-r border-white/5">
                    <div className="space-y-6">
                        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg">
                            <Bot size={28} />
                        </div>
                        <h2 className="text-2xl font-bold leading-tight">Join the future of job hunting.</h2>
                        <ul className="space-y-4">
                            {[
                                "20 AI generations / day",
                                "Multiple CV management",
                                "Auto-detect JD language",
                                "Direct Gmail delivery"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <CheckCircle2 size={18} className="text-primary" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <p className="text-xs text-muted-foreground/60 italic">
                        "Applying used to take hours. Now it takes 30 seconds."
                    </p>
                </div>

                {/* Right Side: Auth Action */}
                <div className="flex flex-col justify-center p-10 space-y-8 bg-card/30">
                    <div className="space-y-2 text-center md:text-left">
                        <h1 className="text-3xl font-extrabold tracking-tight">Create Account</h1>
                        <p className="text-muted-foreground text-sm">Start applying smarter today.</p>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={handleGoogleSignup}
                            className="w-full h-14 flex items-center justify-center gap-3 bg-white text-slate-900 rounded-2xl font-bold shadow-sm hover:shadow-xl active:scale-[0.98] transition-all border border-slate-200 group"
                        >
                            <img
                                src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
                                alt="Google"
                                className="w-6 h-6 group-hover:scale-110 transition-transform"
                            />
                            Sign up with Google
                        </button>

                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border"></span>
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                                <span className="bg-transparent px-2">Fast Access</span>
                            </div>
                        </div>

                        <p className="text-[10px] text-center text-muted-foreground/80 leading-relaxed">
                            No long forms. We'll use your Google profile to set up your Postify workspace instantly.
                        </p>
                    </div>

                    <footer className="text-center pt-4">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link href="/login" className="text-primary font-bold hover:underline">
                                Log in
                            </Link>
                        </p>
                    </footer>
                </div>
            </div>
        </div>
    );
}
