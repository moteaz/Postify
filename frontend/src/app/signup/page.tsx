"use client";

import { Bot, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
    const handleGoogleSignup = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/google`;
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-8">
            <div className="w-full max-w-5xl grid md:grid-cols-2 gap-0 overflow-hidden rounded-xl sm:rounded-2xl border border-neutral-200 bg-white shadow-elevated">
                {/* Left: Value Prop */}
                <div className="hidden md:flex flex-col justify-between p-8 lg:p-12 bg-primary/5">
                    <div className="space-y-4 lg:space-y-6">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-primary flex items-center justify-center text-white shadow-sm">
                            <Bot size={20} className="lg:w-6 lg:h-6" />
                        </div>
                        <h2 className="text-xl lg:text-2xl font-bold text-neutral-900 leading-tight">Join the future of job hunting</h2>
                        <ul className="space-y-3 lg:space-y-4">
                            {[
                                "20 AI generations / day",
                                "Multiple CV management",
                                "Auto-detect JD language",
                                "Direct Gmail delivery"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-2 lg:gap-3 text-xs lg:text-sm text-neutral-600">
                                    <CheckCircle2 size={16} className="lg:w-[18px] lg:h-[18px] text-primary flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <p className="text-xs text-neutral-500 italic hidden lg:block">
                        "Applying used to take hours. Now it takes 30 seconds."
                    </p>
                </div>

                {/* Right: Auth */}
                <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-12 space-y-5 sm:space-y-6">
                    <div className="space-y-1 sm:space-y-2">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">Create Account</h1>
                        <p className="text-sm sm:text-base text-neutral-600">Start applying smarter today</p>
                    </div>

                    <button
                        onClick={handleGoogleSignup}
                        className="w-full h-11 sm:h-12 flex items-center justify-center gap-3 bg-white text-neutral-900 rounded-lg sm:rounded-xl font-semibold shadow-sm hover:shadow-md transition-all border border-neutral-300 hover:border-neutral-400 text-sm sm:text-base"
                    >
                        <img
                            src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
                            alt="Google"
                            className="w-5 h-5"
                        />
                        Sign up with Google
                    </button>

                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-neutral-200"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase font-medium text-neutral-400">
                            <span className="bg-white px-2">Fast Access</span>
                        </div>
                    </div>

                    <p className="text-xs text-center text-neutral-500 leading-relaxed px-2">
                        No long forms. We'll use your Google profile to set up your Postify workspace instantly.
                    </p>

                    <div className="text-center pt-2 sm:pt-4">
                        <p className="text-xs sm:text-sm text-neutral-600">
                            Already have an account?{" "}
                            <Link href="/login" className="text-primary font-semibold hover:underline">
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
