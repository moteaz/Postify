import { Upload, Zap, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const FEATURES = [
  {
    icon: <Upload className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: "Smart CV Storage",
    description: "Upload multiple resumes. Postify lets you toggle between specialized versions for different roles instantly.",
  },
  {
    icon: <Zap className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: "Instant Tailoring",
    description: "Our AI doesn't just copy-paste. It analyzes tone, keywords, and job requirements to write like a human expert.",
  },
  {
    icon: <Mail className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: "Direct Delivery",
    description: "Applications are sent directly from YOUR Gmail. No platform proxy emails. Just pure, professional outreach.",
  },
];

export default function Features() {
  return (
    <section id="features" className="w-full py-12 sm:py-16 md:py-24 bg-muted/50" aria-labelledby="features-heading">
      <div className="container mx-auto px-4 sm:px-6">
        <SectionHeader />
        <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {FEATURES.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHeader() {
  return (
    <div className="text-center mb-12 sm:mb-16 space-y-3 sm:space-y-4">
      <h2 id="features-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
        Everything you need to <span className="text-primary">win</span>
      </h2>
      <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
        Stop wasting hours on repetitive cover letters. Focus on the interview, let AI handle the intro.
      </p>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border">
      <CardContent className="p-6 sm:p-8">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">{title}</h3>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}
