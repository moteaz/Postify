"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/utils/api";
import {
    Plus,
    Send,
    History as HistoryIcon,
    FileText,
    LogOut,
    Upload,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Bot,
    ArrowRight,
    Trash2,
    Sparkles,
    Mail
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function Dashboard() {
    const router = useRouter();
    const { user, setUser, logout } = useAuthStore();
    const [activeTab, setActiveTab] = useState<"new" | "history" | "cvs">("new");
    const [jobDescription, setJobDescription] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedContent, setGeneratedContent] = useState<any>(null);
    const [applicationId, setApplicationId] = useState<string | null>(null);
    const [isSending, setIsSending] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState<any>(null);
    const [cvs, setCvs] = useState<any[]>([]);
    const [isLoadingCvs, setIsLoadingCvs] = useState(false);
    const [isUpdatingCV, setIsUpdatingCV] = useState(false);
    const [systemStatus, setSystemStatus] = useState<any>({ api: 'checking', ai: 'checking' });

    // Auth protection
    useEffect(() => {
        if (!user) {
            api.get("/auth/me")
                .then((res) => setUser(res.data.user))
                .catch(() => router.push("/login?error=unauthorized"));
        }
    }, [user, router, setUser]);

    // Fetch history
    const fetchHistory = async () => {
        setIsLoadingHistory(true);
        try {
            const res = await api.get("/email/history");
            setHistory(res.data.history);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    // Fetch CVs
    const fetchCvs = async () => {
        setIsLoadingCvs(true);
        try {
            const res = await api.get("/cv");
            setCvs(res.data.cvs);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoadingCvs(false);
        }
    };

    const checkSystem = async () => {
        try {
            const res = await api.get("/health");
            setSystemStatus({
                api: 'online',
                ai: res.data.ai_status,
                provider: res.data.ai_provider
            });
        } catch (err) {
            setSystemStatus({ api: 'offline', ai: 'offline' });
        }
    };

    // Initial load and periodic check
    useEffect(() => {
        if (user) {
            fetchHistory();
            fetchCvs();
            checkSystem();
            const interval = setInterval(checkSystem, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    // Refresh on tab change
    useEffect(() => {
        if (!user) return;
        if (activeTab === "history") fetchHistory();
        if (activeTab === "cvs") fetchCvs();
    }, [activeTab, user]);

    const handleUploadCV = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("cv", file);

        try {
            await api.post("/cv/upload", formData);
            setSuccess("CV uploaded successfully!");
            fetchCvs();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteCV = async (id: string) => {
        if (!confirm("Are you sure you want to delete this CV?")) return;
        try {
            await api.delete(`/cv/${id}`);
            setSuccess("CV deleted.");
            fetchCvs();
        } catch (error) {
            console.error(error);
        }
    };

    const handleSetActiveCV = async (id: string) => {
        setIsUpdatingCV(true);
        try {
            // Note: We'll implement a 'patch' or similar in backend if not already done, 
            // for now we re-upload or use existing upload logic if it sets active.
            // Since our backend sets the newest as active, we might need a dedicated endpoint.
            // Let's assume we implement PUT /api/cv/:id/active
            await api.put(`/cv/${id}/active`);
            fetchCvs();
            setSuccess("Active CV updated!");
        } catch (error) {
            console.error(error);
        } finally {
            setIsUpdatingCV(false);
        }
    };

    const handleGenerate = async () => {
        if (!jobDescription.trim()) return;

        setIsGenerating(true);
        setSuccess(null);
        try {
            const res = await api.post("/ai/generate", { jobDescription });
            setGeneratedContent(res.data.content);
            setApplicationId(res.data.applicationId);
        } catch (error: any) {
            console.error(error);
            const message = error.response?.data?.message || "Failed to generate application.";
            const details = error.response?.data?.details;

            // Set a user-friendly error instead of an alert
            setSuccess(null);
            alert(`${message}${details ? `\n\nDetails: ${details}` : ''}`);

            if (message.includes("CV")) setActiveTab("cvs");
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

    const handleLogout = async () => {
        try {
            // await api.post("/auth/logout"); // Removed as per instruction context
        } catch (error) {
            console.error(error);
        } finally {
            logout();
            router.push("/login");
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

                <div className="p-4 border-t border-border space-y-4">
                    <div className="px-2 py-3 rounded-xl bg-white/5 border border-white/5 space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                            <span>System Status</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px]">
                            <div className={`w-1.5 h-1.5 rounded-full ${systemStatus.api === 'online' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                            <span>API {systemStatus.api}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px]">
                            <div className={`w-1.5 h-1.5 rounded-full ${systemStatus.ai === 'online' || systemStatus.ai?.includes('openai') ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className="capitalize">{systemStatus.provider || 'AI'} {systemStatus.ai}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 px-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border border-white/10 shadow-inner">
                            {user?.avatarUrl ? (
                                <img src={user.avatarUrl} alt={user.name} />
                            ) : (
                                <span className="text-xs font-bold text-primary">{user?.name?.charAt(0)}</span>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate">{user?.name}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full h-11 flex items-center justify-center gap-2 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all font-medium"
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
                                <span className="font-bold">{success}</span>
                            </div>
                        )}

                        {!generatedContent ? (
                            <div className="space-y-6">
                                {/* Active CV Check */}
                                {!cvs.some(c => c.isActive) && !isLoadingCvs && (
                                    <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <AlertCircle className="text-amber-500" size={24} />
                                            <div>
                                                <h4 className="font-bold text-amber-500">No Active CV Found</h4>
                                                <p className="text-amber-500/70 text-sm">You need an active CV for AI to tailor your application.</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setActiveTab("cvs")}
                                            className="px-6 h-10 bg-amber-500 text-white rounded-full font-bold text-sm shadow-lg shadow-amber-500/20 hover:scale-105 transition-all"
                                        >
                                            Fix Now
                                        </button>
                                    </div>
                                )}

                                <div className="relative group">
                                    <textarea
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                        placeholder="Paste the job description here (e.g., from LinkedIn or Indeed)..."
                                        className="w-full h-80 p-8 rounded-[2.5rem] bg-card border border-border focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all resize-none text-lg leading-relaxed shadow-sm disabled:opacity-50"
                                        disabled={!cvs.some(c => c.isActive)}
                                    />
                                    <div className="absolute top-6 right-8 flex items-center gap-3">
                                        {jobDescription && (
                                            <button
                                                onClick={() => setJobDescription("")}
                                                className="p-2 rounded-xl text-muted-foreground hover:bg-white/5 hover:text-white transition-all"
                                            >
                                                <Plus className="rotate-45" size={20} />
                                            </button>
                                        )}
                                        <div className="p-2 px-3 rounded-lg bg-primary/10 text-primary font-mono text-[10px] font-black uppercase tracking-widest border border-primary/20">
                                            JD Analyzer v1
                                        </div>
                                        {cvs.find(c => c.isActive) && (
                                            <div className="p-2 px-3 rounded-lg bg-green-500/10 text-green-500 font-mono text-[10px] font-black uppercase tracking-widest border border-green-500/20 flex items-center gap-1.5">
                                                <CheckCircle2 size={12} />
                                                Using: {cvs.find(c => c.isActive).fileName}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={handleGenerate}
                                    disabled={!jobDescription.trim() || isGenerating || !cvs.some(c => c.isActive)}
                                    className="w-full h-16 bg-primary text-white rounded-[2rem] font-black text-xl hover:shadow-2xl hover:shadow-primary/30 active:scale-[0.98] disabled:opacity-30 disabled:grayscale transition-all flex items-center justify-center gap-4 overflow-hidden relative group"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="animate-spin" />
                                            <span>AI is Crafting Magic...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={24} />
                                            <span>Generate Targeted Application</span>
                                        </>
                                    )}
                                </button>

                                <div className="grid grid-cols-3 gap-6 pt-4">
                                    {[
                                        { label: "AI Tailoring", icon: <Bot size={18} /> },
                                        { label: "Grammar Check", icon: <CheckCircle2 size={18} /> },
                                        { label: "Gmail Link", icon: <Mail size={18} /> }
                                    ].map((badge, i) => (
                                        <div key={i} className="flex items-center gap-2 text-muted-foreground/50 font-bold text-xs justify-center uppercase tracking-widest">
                                            {badge.icon}
                                            {badge.label}
                                        </div>
                                    ))}
                                </div>
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

                {activeTab === "history" && (
                    <div className="max-w-5xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {isLoadingHistory ? (
                            <div className="flex flex-col items-center justify-center p-20 gap-4">
                                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                                <p className="text-muted-foreground">Loading your journey...</p>
                            </div>
                        ) : history.length > 0 ? (
                            <div className="grid gap-4">
                                {history.map((app) => (
                                    <div key={app.id} className="p-6 rounded-2xl bg-card border border-border flex items-center justify-between hover:shadow-md transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-12 h-12 rounded-xl flex items-center justify-center",
                                                app.status === "SENT" ? "bg-green-500/10 text-green-500" :
                                                    app.status === "FAILED" ? "bg-red-500/10 text-red-500" : "bg-primary/10 text-primary"
                                            )}>
                                                {app.status === "SENT" ? <CheckCircle2 size={24} /> :
                                                    app.status === "FAILED" ? <AlertCircle size={24} /> : <FileText size={24} />}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg truncate max-w-md">{app.subject || "No Subject"}</h4>
                                                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                                    <span>{app.recruiterEmail}</span>
                                                    <span>•</span>
                                                    <span>{new Date(app.generatedAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                                app.status === "SENT" ? "bg-green-500/10 text-green-500" :
                                                    app.status === "FAILED" ? "bg-red-500/10 text-red-500" : "bg-primary/10 text-primary"
                                            )}>
                                                {app.status}
                                            </span>
                                            <button
                                                onClick={() => setSelectedApplication(app)}
                                                className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-accent transition-all text-primary"
                                            >
                                                <ArrowRight size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center p-20 space-y-4 border-2 border-dashed border-border rounded-[2.5rem]">
                                <HistoryIcon size={48} className="mx-auto text-muted-foreground/30" />
                                <h3 className="text-xl font-bold">No Applications Yet</h3>
                                <p className="text-muted-foreground text-lg">Start by creating your first tailored application!</p>
                                <button onClick={() => setActiveTab("new")} className="text-primary font-black hover:underline group flex items-center gap-2 mx-auto transition-all">
                                    Get Started <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* History Detail Modal */}
                {selectedApplication && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                        <div className="w-full max-w-3xl bg-card border border-border rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
                            <div className="p-8 border-b border-border flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black">{selectedApplication.subject}</h3>
                                    <p className="text-muted-foreground text-sm font-medium">To: {selectedApplication.recruiterEmail}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedApplication(null)}
                                    className="p-3 rounded-2xl hover:bg-accent transition-all"
                                >
                                    <Plus className="rotate-45" size={24} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-8 space-y-8">
                                <div className="space-y-3">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Cover Letter</span>
                                    <div className="bg-background/50 p-8 rounded-3xl border border-border whitespace-pre-wrap font-serif text-lg leading-relaxed italic text-foreground/80">
                                        {selectedApplication.coverLetter}
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">Used CV</span>
                                        <div className="flex items-center gap-3">
                                            <FileText className="text-primary" size={20} />
                                            <span className="font-bold text-sm">{selectedApplication.cv?.fileName || "Unknown CV"}</span>
                                        </div>
                                    </div>
                                    <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">Metadata</span>
                                        <div className="space-y-1 text-xs font-medium">
                                            <p>Generated: {new Date(selectedApplication.generatedAt).toLocaleString()}</p>
                                            <p>Status: <span className="text-primary">{selectedApplication.status}</span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 border-t border-border flex justify-end">
                                <button
                                    onClick={() => setSelectedApplication(null)}
                                    className="px-8 h-12 bg-primary text-white rounded-2xl font-black hover:shadow-lg transition-all active:scale-95"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "cvs" && (
                    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid gap-4">
                            {isLoadingCvs ? (
                                <div className="flex justify-center p-12">
                                    <Loader2 className="animate-spin text-primary" />
                                </div>
                            ) : cvs.length > 0 ? (
                                cvs.map((cv: any) => (
                                    <div key={cv.id} className="p-6 rounded-2xl bg-card border border-border flex items-center justify-between hover:border-primary/30 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                                <FileText size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg">{cv.fileName}</h4>
                                                <p className="text-sm text-muted-foreground">{(cv.fileSize / 1024).toFixed(1)} KB • Uploaded on {new Date(cv.uploadedAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {cv.isActive ? (
                                                <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-wider">Active</span>
                                            ) : (
                                                <button
                                                    disabled={isUpdatingCV}
                                                    onClick={() => handleSetActiveCV(cv.id)}
                                                    className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-muted-foreground text-[10px] font-bold uppercase tracking-wider hover:text-primary hover:border-primary/50 transition-all disabled:opacity-50"
                                                >
                                                    Set Active
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDeleteCV(cv.id)}
                                                className="p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-all ml-2"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : !isLoadingCvs && (
                                <div className="text-center p-10 text-muted-foreground italic">
                                    No CVs found. Upload one to get started!
                                </div>
                            )}
                        </div>

                        <div className="p-12 rounded-[2.5rem] border-2 border-dashed border-border bg-card/30 flex flex-col items-center text-center space-y-4 hover:border-primary/50 transition-all group">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <Upload size={32} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-bold">Upload Your CV</h3>
                                <p className="text-muted-foreground">PDF or DOCX (max 5MB). AI will use it to tailor letters.</p>
                            </div>
                            <input
                                type="file"
                                id="cv-upload"
                                className="hidden"
                                accept=".pdf,.docx"
                                onChange={handleUploadCV}
                            />
                            <label
                                htmlFor="cv-upload"
                                className="h-12 px-8 bg-primary text-white rounded-full font-bold hover:shadow-lg transition-all cursor-pointer flex items-center justify-center"
                            >
                                Choose File
                            </label>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
