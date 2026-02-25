"use client";

import { Bot, LogIn, Sparkles } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { env } from "@/config/env";

export default function LoginPage() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    const handleGoogleLogin = () => {
        window.location.href = `${env.apiUrl}/auth/google`;
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-8">
            <div className="w-full max-w-md">
                {/* Branding */}
                <div className="flex flex-col items-center mb-6 sm:mb-8 space-y-3 sm:space-y-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-primary flex items-center justify-center text-white shadow-md">
                        <Bot size={28} className="sm:w-8 sm:h-8" />
                    </div>
                    <div className="text-center space-y-1">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">Welcome back</h1>
                        <p className="text-sm sm:text-base text-neutral-600">Sign in to continue to Postify</p>
                    </div>
                </div>

                {/* Auth Card */}
                <div className="p-6 sm:p-8 rounded-xl sm:rounded-2xl border border-neutral-200 bg-white shadow-card space-y-5 sm:space-y-6">
                    {error && (
                        <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs sm:text-sm font-medium text-center">
                            Authentication failed. Please try again.
                        </div>
                    )}

                    <button
                        onClick={handleGoogleLogin}
                        className="w-full h-11 sm:h-12 flex items-center justify-center gap-3 bg-white text-neutral-900 rounded-lg sm:rounded-xl font-semibold shadow-sm hover:shadow-md transition-all border border-neutral-300 hover:border-neutral-400 text-sm sm:text-base"
                    >
                        <img
                            src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
                            alt="Google"
                            className="w-5 h-5"
                        />
                        Continue with Google
                    </button>

                    <p className="text-xs text-center text-neutral-500 leading-relaxed px-2">
                        Secure login with Google OAuth. Your data is always protected.
                    </p>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-neutral-200"></span>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-white px-3 sm:px-4 text-xs font-medium text-neutral-400 uppercase tracking-wider">
                                New to Postify?
                            </span>
                        </div>
                    </div>

                    <div className="text-center">
                        <Link
                            href="/signup"
                            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline text-sm sm:text-base"
                        >
                            Create an account
                            <LogIn size={16} />
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-4 sm:gap-6 text-xs font-medium text-neutral-400">
                    <Link href="/" className="hover:text-neutral-600 transition-colors">Home</Link>
                    <span>•</span>
                    <Link href="#" className="hover:text-neutral-600 transition-colors">Privacy</Link>
                    <span>•</span>
                    <Link href="#" className="hover:text-neutral-600 transition-colors">Terms</Link>
                </div>
            </div>
        </div>
    );
}
