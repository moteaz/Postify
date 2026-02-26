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


