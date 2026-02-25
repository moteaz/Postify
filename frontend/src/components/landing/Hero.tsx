import { ArrowRight, Sparkles } from "lucide-react";
import Button from "./Button";

export default function Hero() {
  return (
    <section className="w-full py-12 sm:py-16 md:py-24 lg:py-32 xl:py-40">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8 max-w-4xl mx-auto">
          <Badge />
          <Heading />
          <Description />
          <CTAButtons />
          <DashboardPreview />
        </div>
      </div>
    </section>
  );
}

function Badge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-primary">
      <Sparkles size={14} />
      <span>AI-Powered Job Applications</span>
    </div>
  );
}

function Heading() {
  return (
    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-neutral-900 leading-tight">
      Land Your Dream Job <span className="text-primary">In Seconds</span>
    </h1>
  );
}

function Description() {
  return (
    <p className="text-base sm:text-lg md:text-xl text-neutral-600 max-w-2xl leading-relaxed px-4">
      Upload your CV once. Let our AI analyze job descriptions and craft perfectly tailored applications sent directly from your Gmail.
    </p>
  );
}

function CTAButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 w-full sm:w-auto px-4 sm:px-0">
      <Button href="/signup" variant="primary">
        Start Applying for Free
        <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
      </Button>
      <Button href="#features" variant="secondary">
        See How It Works
      </Button>
    </div>
  );
}

function DashboardPreview() {
  return (
    <div className="mt-12 sm:mt-16 w-full max-w-5xl mx-auto rounded-xl sm:rounded-2xl border border-neutral-200 bg-white p-1 sm:p-2 shadow-elevated">
      <div className="w-full aspect-[16/9] rounded-lg sm:rounded-xl bg-neutral-50 overflow-hidden">
        <div className="w-full h-full p-4 sm:p-6 md:p-8 space-y-3 sm:space-y-4">
          <PreviewHeader />
          <PreviewContent />
        </div>
      </div>
    </div>
  );
}

function PreviewHeader() {
  return (
    <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-neutral-200">
      <div className="flex gap-1.5 sm:gap-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-neutral-300" />
        ))}
      </div>
      <div className="text-[10px] sm:text-xs font-medium text-neutral-400 uppercase tracking-wider">
        Dashboard Preview
      </div>
    </div>
  );
}

function PreviewContent() {
  return (
    <div className="grid grid-cols-12 gap-2 sm:gap-3 md:gap-4">
      <div className="col-span-12 sm:col-span-3 space-y-2 sm:space-y-3">
        <div className="h-8 sm:h-10 bg-primary/10 rounded-lg" />
        <div className="h-8 sm:h-10 bg-white rounded-lg border border-neutral-200" />
        <div className="hidden sm:block h-10 bg-white rounded-lg border border-neutral-200" />
      </div>
      <div className="col-span-12 sm:col-span-9 space-y-2 sm:space-y-3">
        <div className="h-24 sm:h-32 bg-white rounded-lg sm:rounded-xl border border-neutral-200 flex items-center justify-center">
          <span className="text-xs sm:text-sm text-neutral-400">AI analyzing job description...</span>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div className="h-16 sm:h-20 bg-white rounded-lg sm:rounded-xl border border-neutral-200" />
          <div className="h-16 sm:h-20 bg-white rounded-lg sm:rounded-xl border border-neutral-200" />
        </div>
      </div>
    </div>
  );
}
