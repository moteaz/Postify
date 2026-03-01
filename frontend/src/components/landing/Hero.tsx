import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Hero() {
  return (
    <section className="w-full py-12 sm:py-16 md:py-24 lg:py-32 xl:py-40">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8 max-w-4xl mx-auto">
          <Badge variant="secondary" className="gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Job Applications
          </Badge>
          <Heading />
          <Description />
          <CTAButtons />
        </div>
      </div>
    </section>
  );
}

function Heading() {
  return (
    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-foreground leading-tight">
      Land Your Dream Job <span className="text-primary">In Seconds</span>
    </h1>
  );
}

function Description() {
  return (
    <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed px-4">
      Upload your CV once. Let our AI analyze job descriptions and craft perfectly tailored applications sent directly from your Gmail.
    </p>
  );
}

function CTAButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 w-full sm:w-auto px-4 sm:px-0">
      <Button size="lg" asChild>
        <Link href="/signup">
          Start Applying for Free
          <ArrowRight className="w-4 h-4" />
        </Link>
      </Button>
      <Button size="lg" variant="outline" asChild>
        <Link href="#features">See How It Works</Link>
      </Button>
    </div>
  );
}


