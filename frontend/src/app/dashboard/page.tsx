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
    LayoutDashboard,
    Upload,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Bot,
    ArrowRight,
    Trash2
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function Dashboard() {
    const router = useRouter();
    const { user, logout, token } = useAuthStore();
    const [activeTab, setActiveTab] = useState<"new" | "history" | "cvs">("new");
    const [jobDescription, setJobDescription] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedContent, setGeneratedContent] = useState<any>(null);
    const [applicationId, setApplicationId] = useState<string | null>(null);
    const [isSending, setIsSending] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [cvs, setCvs] = useState<any[]>([]);
    const [isLoadingCvs, setIsLoadingCvs] = useState(false);

    // Auth protection
    useEffect(() => {
        if (!token) {
            router.push("/login?error=unauthorized");
        }
    }, [token, router]);

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

    // Fetch data based on tab
    useEffect(() => {
        if (!token) return;
        if (activeTab === "history") fetchHistory();
        if (activeTab === "cvs") fetchCvs();
    }, [activeTab, token]);

    const handleUploadCV = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("cv", file);

        try {
            await api.post("/cv/upload", formData);
            setSuccess("CV uploaded successfully!");
            fetchCvs();
            // Optional: update user object in store if needed
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteCV = async (id: string) => {
        if (!confirm("Are you sure you want to delete this CV?")) return;
        try {
            await api.delete(`/cv/${id}`);
            fetchCvs();
            setSuccess("CV deleted.");
        } catch (error) {
            console.error(error);
        }
    };

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
                                                "px-3 py-1 rounded-full text-xs font-bold uppercase",
                                                app.status === "SENT" ? "bg-green-500/10 text-green-500" :
                                                    app.status === "FAILED" ? "bg-red-500/10 text-red-500" : "bg-primary/10 text-primary"
                                            )}>
                                                {app.status}
                                            </span>
                                            <button className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-accent transition-all">
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
                                <p className="text-muted-foreground">Start by creating your first tailored application!</p>
                                <button onClick={() => setActiveTab("new")} className="text-primary font-bold hover:underline">
                                    Get Started →
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "cvs" && (
                    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* CV List */}
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
                                            {cv.isActive && (
                                                <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold uppercase tracking-wider">Active</span>
                                            )}
                                            <button
                                                onClick={() => handleDeleteCV(cv.id)}
                                                className="p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-all"
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

                {/* Other tabs components... */}
            </main>
        </div>
    );
}
