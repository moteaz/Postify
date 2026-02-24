"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/utils/api";
import {
    Plus,
    Send,
    History as HistoryIcon,
    FileText,
    LogOut,
    LayoutDashboard,
    Upload,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Bot
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function Dashboard() {
    const { user, logout } = useAuthStore();
    const [activeTab, setActiveTab] = useState<"new" | "history" | "cvs">("new");
    const [jobDescription, setJobDescription] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedContent, setGeneratedContent] = useState<any>(null);
    const [applicationId, setApplicationId] = useState<string | null>(null);
    const [isSending, setIsSending] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);

    // Components for different tabs would go here

    const handleGenerate = async () => {
        setIsGenerating(true);
        setSuccess(null);
        try {
            const res = await api.post("/ai/generate", { jobDescription });
            setGeneratedContent(res.data.content);
            setApplicationId(res.data.applicationId);
        } catch (error) {
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSend = async () => {
        setIsSending(true);
        try {
            await api.post("/email/send", {
                applicationId,
                to: generatedContent.recruiterEmail,
                subject: generatedContent.subject,
                body: generatedContent.coverLetter
            });
            setSuccess("Application sent successfully!");
            setGeneratedContent(null);
            setJobDescription("");
        } catch (error) {
            console.error(error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="flex h-screen bg-background overflow-hidden text-foreground">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border bg-card flex flex-col">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
                        <Bot size={24} />
                    </div>
                    <span className="font-bold text-xl">Postify</span>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <button
                        onClick={() => setActiveTab("new")}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                            activeTab === "new" ? "bg-primary/10 text-primary font-medium" : "hover:bg-accent"
                        )}
                    >
                        <Plus size={20} />
                        New Application
                    </button>
                    <button
                        onClick={() => setActiveTab("history")}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                            activeTab === "history" ? "bg-primary/10 text-primary font-medium" : "hover:bg-accent"
                        )}
                    >
                        <HistoryIcon size={20} />
                        History
                    </button>
                    <button
                        onClick={() => setActiveTab("cvs")}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                            activeTab === "cvs" ? "bg-primary/10 text-primary font-medium" : "hover:bg-accent"
                        )}
                    >
                        <FileText size={20} />
                        My CVs
                    </button>
                </nav>

                <div className="p-4 border-t border-border">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                            {user?.avatarUrl ? (
                                <img src={user.avatarUrl} alt={user.name} />
                            ) : (
                                <span className="text-xs">{user?.name?.charAt(0)}</span>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user?.name}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full h-10 flex items-center justify-center gap-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Window */}
            <main className="flex-1 overflow-y-auto p-8 relative">
                <header className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">
                            {activeTab === "new" ? "Create New Application" :
                                activeTab === "history" ? "Application History" : "Manage CVs"}
                        </h1>
                        <p className="text-muted-foreground mt-1 text-lg">
                            {activeTab === "new" ? "Paste a job description to get started." :
                                activeTab === "history" ? "Review your past applications." : "Upload or update your professional CVs."}
                        </p>
                    </div>
                </header>

                {activeTab === "new" && (
                    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {success && (
                            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 flex items-center gap-3">
                                <CheckCircle2 size={24} />
                                <span className="font-medium">{success}</span>
                            </div>
                        )}

                        {!generatedContent ? (
                            <div className="space-y-4">
                                <div className="relative group">
                                    <textarea
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                        placeholder="Paste the job description here..."
                                        className="w-full h-64 p-6 rounded-2xl bg-card border border-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none text-lg shadow-sm group-hover:shadow-md"
                                    />
                                    <div className="absolute top-4 right-4 text-xs font-mono text-muted-foreground opacity-50">
                                        JD ANALYZER
                                    </div>
                                </div>
                                <button
                                    onClick={handleGenerate}
                                    disabled={!jobDescription || isGenerating}
                                    className="w-full h-14 bg-primary text-white rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-primary/25 active:scale-95 disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-3"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="animate-spin" />
                                            AI is Crafting...
                                        </>
                                    ) : (
                                        <>
                                            <Bot />
                                            Generate Application
                                        </>
                                    )}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-in zoom-in-95 duration-300">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Recruiter Email</label>
                                        <input
                                            type="text"
                                            value={generatedContent.recruiterEmail || ""}
                                            onChange={(e) => setGeneratedContent({ ...generatedContent, recruiterEmail: e.target.value })}
                                            className="w-full p-4 rounded-xl bg-card border border-border focus:ring-2 focus:ring-primary outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Subject Line</label>
                                        <input
                                            type="text"
                                            value={generatedContent.subject}
                                            onChange={(e) => setGeneratedContent({ ...generatedContent, subject: e.target.value })}
                                            className="w-full p-4 rounded-xl bg-card border border-border focus:ring-2 focus:ring-primary outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Tailored Cover Letter</label>
                                    <textarea
                                        value={generatedContent.coverLetter}
                                        onChange={(e) => setGeneratedContent({ ...generatedContent, coverLetter: e.target.value })}
                                        className="w-full h-96 p-6 rounded-2xl bg-card border border-border focus:ring-2 focus:ring-primary outline-none resize-none font-serif text-lg leading-relaxed shadow-inner"
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setGeneratedContent(null)}
                                        className="flex-1 h-14 rounded-2xl border border-border bg-background font-bold text-lg hover:bg-accent transition-all"
                                    >
                                        Discard & Start Over
                                    </button>
                                    <button
                                        onClick={handleSend}
                                        disabled={isSending}
                                        className="flex-[2] h-14 bg-primary text-white rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-primary/25 active:scale-95 transition-all flex items-center justify-center gap-3"
                                    >
                                        {isSending ? (
                                            <>
                                                <Loader2 className="animate-spin" />
                                                Sending via Gmail...
                                            </>
                                        ) : (
                                            <>
                                                <Send />
                                                Send Application Now
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "cvs" && (
                    <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="p-12 rounded-3xl border-2 border-dashed border-border bg-card flex flex-col items-center text-center space-y-4 hover:border-primary/50 transition-all group">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <Upload size={32} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-bold">Upload Your CV</h3>
                                <p className="text-muted-foreground">PDF or DOCX (max 5MB). AI will use it to tailor letters.</p>
                            </div>
                            <button className="h-12 px-8 bg-primary text-white rounded-full font-bold hover:shadow-lg transition-all">
                                Choose File
                            </button>
                        </div>
                    </div>
                )}

                {/* Other tabs components... */}
            </main>
        </div>
    );
}
