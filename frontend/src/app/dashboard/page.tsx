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
        <div className="flex flex-col lg:flex-row h-screen bg-neutral-50 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-neutral-200 bg-white flex flex-col">
                <div className="p-4 sm:p-6 flex items-center justify-between lg:justify-start gap-2 border-b border-neutral-200">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                            <Bot size={20} />
                        </div>
                        <span className="font-bold text-base sm:text-lg text-neutral-900">Postify</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="lg:hidden p-2 rounded-lg text-neutral-600 hover:bg-red-50 hover:text-red-600 transition-all"
                    >
                        <LogOut size={20} />
                    </button>
                </div>

                <nav className="flex lg:flex-col flex-1 p-2 sm:p-4 space-y-0 lg:space-y-1 overflow-x-auto lg:overflow-x-visible">
                    <div className="flex lg:flex-col gap-1 min-w-max lg:min-w-0 w-full">
                        <button
                            onClick={() => setActiveTab("new")}
                            className={cn(
                                "flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-all text-xs sm:text-sm font-medium whitespace-nowrap",
                                activeTab === "new" ? "bg-primary text-white" : "text-neutral-600 hover:bg-neutral-100"
                            )}
                        >
                            <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
                            <span className="hidden sm:inline">New Application</span>
                            <span className="sm:hidden">New</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("history")}
                            className={cn(
                                "flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-all text-xs sm:text-sm font-medium whitespace-nowrap",
                                activeTab === "history" ? "bg-primary text-white" : "text-neutral-600 hover:bg-neutral-100"
                            )}
                        >
                            <HistoryIcon size={16} className="sm:w-[18px] sm:h-[18px]" />
                            History
                        </button>
                        <button
                            onClick={() => setActiveTab("cvs")}
                            className={cn(
                                "flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-all text-xs sm:text-sm font-medium whitespace-nowrap",
                                activeTab === "cvs" ? "bg-primary text-white" : "text-neutral-600 hover:bg-neutral-100"
                            )}
                        >
                            <FileText size={16} className="sm:w-[18px] sm:h-[18px]" />
                            <span className="hidden sm:inline">My CVs</span>
                            <span className="sm:hidden">CVs</span>
                        </button>
                    </div>
                </nav>

                <div className="hidden lg:flex p-4 border-t border-neutral-200 flex-col space-y-4">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                            {user?.avatarUrl ? (
                                <img src={user.avatarUrl} alt={user.name} className="rounded-full" />
                            ) : (
                                <span className="text-xs font-semibold text-primary">{user?.name?.charAt(0)}</span>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-neutral-900 truncate">{user?.name}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full h-10 flex items-center justify-center gap-2 rounded-lg text-neutral-600 hover:bg-red-50 hover:text-red-600 transition-all text-sm font-medium"
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
                    <header className="mb-6 sm:mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
                            {activeTab === "new" ? "Create New Application" :
                                activeTab === "history" ? "Application History" : "Manage CVs"}
                        </h1>
                        <p className="text-sm sm:text-base text-neutral-600 mt-1">
                            {activeTab === "new" ? "Paste a job description to get started" :
                                activeTab === "history" ? "Review your past applications" : "Upload or update your professional CVs"}
                        </p>
                    </header>

                {activeTab === "new" && (
                    <div className="space-y-4 sm:space-y-6">
                        {success && (
                            <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-green-50 border border-green-200 text-green-700 flex items-center gap-2 sm:gap-3 text-sm">
                                <CheckCircle2 size={18} className="flex-shrink-0" />
                                <span className="font-medium">{success}</span>
                            </div>
                        )}

                        {!generatedContent ? (
                            <div className="space-y-4 sm:space-y-6">
                                {!cvs.some(c => c.isActive) && !isLoadingCvs && (
                                    <div className="p-4 sm:p-6 rounded-lg sm:rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                                        <div className="flex items-start gap-3 sm:gap-4">
                                            <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
                                            <div>
                                                <h4 className="font-semibold text-amber-900 text-sm sm:text-base">No Active CV Found</h4>
                                                <p className="text-amber-700 text-xs sm:text-sm mt-0.5">You need an active CV for AI to tailor your application</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setActiveTab("cvs")}
                                            className="w-full sm:w-auto px-4 sm:px-5 h-9 sm:h-10 bg-amber-600 text-white rounded-lg font-medium text-xs sm:text-sm hover:bg-amber-700 transition-all whitespace-nowrap"
                                        >
                                            Fix Now
                                        </button>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    {cvs.find(c => c.isActive) && (
                                        <div className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg bg-green-50 text-green-700 text-[10px] sm:text-xs font-medium border border-green-200 flex items-center gap-1 sm:gap-1.5 w-fit">
                                            <CheckCircle2 size={10} className="sm:w-3 sm:h-3 flex-shrink-0" />
                                            <span className="truncate">{cvs.find(c => c.isActive).fileName}</span>
                                        </div>
                                    )}
                                    <textarea
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                        placeholder="Paste the job description here (e.g., from LinkedIn or Indeed)..."
                                        className="w-full h-64 sm:h-80 p-4 sm:p-6 rounded-lg sm:rounded-xl bg-white border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none text-sm sm:text-base leading-relaxed disabled:opacity-50 disabled:bg-neutral-50"
                                        disabled={!cvs.some(c => c.isActive)}
                                    />
                                </div>
                                <button
                                    onClick={handleGenerate}
                                    disabled={!jobDescription.trim() || isGenerating || !cvs.some(c => c.isActive)}
                                    className="w-full h-11 sm:h-12 bg-primary text-white rounded-lg sm:rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="animate-spin" size={18} />
                                            <span className="hidden sm:inline">AI is Crafting Magic...</span>
                                            <span className="sm:hidden">Generating...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={18} />
                                            <span className="hidden sm:inline">Generate Targeted Application</span>
                                            <span className="sm:hidden">Generate</span>
                                        </>
                                    )}
                                </button>

                                <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-2">
                                    {[
                                        { label: "AI Tailoring", icon: <Bot size={14} className="sm:w-4 sm:h-4" /> },
                                        { label: "Grammar Check", icon: <CheckCircle2 size={14} className="sm:w-4 sm:h-4" /> },
                                        { label: "Gmail Link", icon: <Mail size={14} className="sm:w-4 sm:h-4" /> }
                                    ].map((badge, i) => (
                                        <div key={i} className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-neutral-500 text-[10px] sm:text-xs font-medium justify-center">
                                            {badge.icon}
                                            <span className="text-center">{badge.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4 sm:space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs sm:text-sm font-semibold text-neutral-700">Recruiter Email</label>
                                        <input
                                            type="text"
                                            value={generatedContent.recruiterEmail || ""}
                                            onChange={(e) => setGeneratedContent({ ...generatedContent, recruiterEmail: e.target.value })}
                                            className="w-full p-2.5 sm:p-3 rounded-lg bg-white border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs sm:text-sm font-semibold text-neutral-700">Subject Line</label>
                                        <input
                                            type="text"
                                            value={generatedContent.subject}
                                            onChange={(e) => setGeneratedContent({ ...generatedContent, subject: e.target.value })}
                                            className="w-full p-2.5 sm:p-3 rounded-lg bg-white border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs sm:text-sm font-semibold text-neutral-700">Tailored Cover Letter</label>
                                    <textarea
                                        value={generatedContent.coverLetter}
                                        onChange={(e) => setGeneratedContent({ ...generatedContent, coverLetter: e.target.value })}
                                        className="w-full h-64 sm:h-96 p-4 sm:p-6 rounded-lg sm:rounded-xl bg-white border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none text-sm sm:text-base leading-relaxed"
                                    />
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                    <button
                                        onClick={() => setGeneratedContent(null)}
                                        className="flex-1 h-11 sm:h-12 rounded-lg sm:rounded-xl border border-neutral-300 bg-white font-semibold hover:bg-neutral-50 transition-all text-sm sm:text-base"
                                    >
                                        <span className="hidden sm:inline">Discard & Start Over</span>
                                        <span className="sm:hidden">Discard</span>
                                    </button>
                                    <button
                                        onClick={handleSend}
                                        disabled={isSending}
                                        className="flex-1 sm:flex-[2] h-11 sm:h-12 bg-primary text-white rounded-lg sm:rounded-xl font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 sm:gap-3 shadow-sm hover:shadow-md text-sm sm:text-base"
                                    >
                                        {isSending ? (
                                            <>
                                                <Loader2 className="animate-spin" size={18} />
                                                <span className="hidden sm:inline">Sending via Gmail...</span>
                                                <span className="sm:hidden">Sending...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Send size={18} />
                                                <span className="hidden sm:inline">Send Application Now</span>
                                                <span className="sm:hidden">Send Now</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "history" && (
                    <div className="space-y-3 sm:space-y-4">
                        {isLoadingHistory ? (
                            <div className="flex flex-col items-center justify-center p-12 sm:p-20 gap-4">
                                <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-primary" />
                                <p className="text-sm sm:text-base text-neutral-600">Loading your journey...</p>
                            </div>
                        ) : history.length > 0 ? (
                            <div className="grid gap-2 sm:gap-3">
                                {history.map((app) => (
                                    <div key={app.id} className="p-3 sm:p-5 rounded-lg sm:rounded-xl bg-white border border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:shadow-card transition-all group">
                                        <div className="flex items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                                            <div className={cn(
                                                "w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                                                app.status === "SENT" ? "bg-green-50 text-green-600" :
                                                    app.status === "FAILED" ? "bg-red-50 text-red-600" : "bg-primary/10 text-primary"
                                            )}>
                                                {app.status === "SENT" ? <CheckCircle2 size={16} className="sm:w-5 sm:h-5" /> :
                                                    app.status === "FAILED" ? <AlertCircle size={16} className="sm:w-5 sm:h-5" /> : <FileText size={16} className="sm:w-5 sm:h-5" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-sm sm:text-base text-neutral-900 truncate">{app.subject || "No Subject"}</h4>
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm text-neutral-500 mt-0.5">
                                                    <span className="truncate">{app.recruiterEmail}</span>
                                                    <span className="hidden sm:inline">•</span>
                                                    <span>{new Date(app.generatedAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
                                            <span className={cn(
                                                "px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider",
                                                app.status === "SENT" ? "bg-green-50 text-green-700" :
                                                    app.status === "FAILED" ? "bg-red-50 text-red-700" : "bg-primary/10 text-primary"
                                            )}>
                                                {app.status}
                                            </span>
                                            <button
                                                onClick={() => setSelectedApplication(app)}
                                                className="p-2 rounded-lg sm:opacity-0 sm:group-hover:opacity-100 hover:bg-neutral-100 transition-all text-primary"
                                            >
                                                <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center p-12 sm:p-20 space-y-3 sm:space-y-4 border-2 border-dashed border-neutral-200 rounded-xl sm:rounded-2xl bg-white">
                                <HistoryIcon size={40} className="sm:w-12 sm:h-12 mx-auto text-neutral-300" />
                                <h3 className="text-lg sm:text-xl font-semibold text-neutral-900">No Applications Yet</h3>
                                <p className="text-sm sm:text-base text-neutral-600 px-4">Start by creating your first tailored application!</p>
                                <button onClick={() => setActiveTab("new")} className="text-primary font-semibold hover:underline flex items-center gap-2 mx-auto text-sm sm:text-base">
                                    Get Started <ArrowRight size={14} className="sm:w-4 sm:h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* History Detail Modal */}
                {selectedApplication && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="w-full max-w-3xl bg-white border border-neutral-200 rounded-xl sm:rounded-2xl shadow-elevated flex flex-col max-h-[90vh] overflow-hidden">
                            <div className="p-4 sm:p-6 border-b border-neutral-200 flex items-start sm:items-center justify-between gap-3">
                                <div className="space-y-1 flex-1 min-w-0">
                                    <h3 className="text-base sm:text-xl font-bold text-neutral-900 line-clamp-2">{selectedApplication.subject}</h3>
                                    <p className="text-neutral-600 text-xs sm:text-sm truncate">To: {selectedApplication.recruiterEmail}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedApplication(null)}
                                    className="p-2 rounded-lg hover:bg-neutral-100 transition-all flex-shrink-0"
                                >
                                    <Plus className="rotate-45" size={20} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
                                <div className="space-y-2">
                                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-primary">Cover Letter</span>
                                    <div className="bg-neutral-50 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-neutral-200 whitespace-pre-wrap text-sm sm:text-base leading-relaxed text-neutral-700">
                                        {selectedApplication.coverLetter}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-neutral-50 border border-neutral-200">
                                        <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-2">Used CV</span>
                                        <div className="flex items-center gap-2">
                                            <FileText className="text-primary flex-shrink-0" size={16} />
                                            <span className="font-medium text-xs sm:text-sm text-neutral-900 truncate">{selectedApplication.cv?.fileName || "Unknown CV"}</span>
                                        </div>
                                    </div>
                                    <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-neutral-50 border border-neutral-200">
                                        <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-2">Metadata</span>
                                        <div className="space-y-1 text-[10px] sm:text-xs text-neutral-600">
                                            <p className="truncate">Generated: {new Date(selectedApplication.generatedAt).toLocaleDateString()}</p>
                                            <p>Status: <span className="text-primary font-medium">{selectedApplication.status}</span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 sm:p-6 border-t border-neutral-200 flex justify-end">
                                <button
                                    onClick={() => setSelectedApplication(null)}
                                    className="px-5 sm:px-6 h-9 sm:h-10 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-all text-sm"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "cvs" && (
                    <div className="space-y-4 sm:space-y-6">
                        <div className="grid gap-2 sm:gap-3">
                            {isLoadingCvs ? (
                                <div className="flex justify-center p-8 sm:p-12">
                                    <Loader2 className="animate-spin text-primary" size={28} />
                                </div>
                            ) : cvs.length > 0 ? (
                                cvs.map((cv: any) => (
                                    <div key={cv.id} className="p-3 sm:p-5 rounded-lg sm:rounded-xl bg-white border border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-primary/30 transition-all">
                                        <div className="flex items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                                                <FileText size={16} className="sm:w-5 sm:h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-sm sm:text-base text-neutral-900 truncate">{cv.fileName}</h4>
                                                <p className="text-xs sm:text-sm text-neutral-500 truncate">{(cv.fileSize / 1024).toFixed(1)} KB • {new Date(cv.uploadedAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                                            {cv.isActive ? (
                                                <span className="px-2 sm:px-3 py-1 rounded-full bg-green-50 text-green-700 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Active</span>
                                            ) : (
                                                <button
                                                    disabled={isUpdatingCV}
                                                    onClick={() => handleSetActiveCV(cv.id)}
                                                    className="px-2 sm:px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-600 text-[10px] sm:text-xs font-medium hover:text-primary hover:border-primary/50 transition-all disabled:opacity-50"
                                                >
                                                    Set Active
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDeleteCV(cv.id)}
                                                className="p-1.5 sm:p-2 rounded-lg text-red-600 hover:bg-red-50 transition-all"
                                            >
                                                <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : !isLoadingCvs && (
                                <div className="text-center p-8 sm:p-10 text-sm sm:text-base text-neutral-500">
                                    No CVs found. Upload one to get started!
                                </div>
                            )}
                        </div>

                        <div className="p-8 sm:p-12 rounded-xl sm:rounded-2xl border-2 border-dashed border-neutral-300 bg-white flex flex-col items-center text-center space-y-3 sm:space-y-4 hover:border-primary/50 transition-all group">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <Upload size={24} className="sm:w-7 sm:h-7" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-base sm:text-lg font-semibold text-neutral-900">Upload Your CV</h3>
                                <p className="text-neutral-600 text-xs sm:text-sm px-4">PDF or DOCX (max 5MB). AI will use it to tailor letters.</p>
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
                                className="h-10 px-5 sm:px-6 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-all cursor-pointer flex items-center justify-center text-sm"
                            >
                                Choose File
                            </label>
                        </div>
                    </div>
                )}
            </div>
        </main>
    </div>
);
}
