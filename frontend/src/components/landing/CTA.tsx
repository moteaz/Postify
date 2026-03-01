import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="w-full py-12 sm:py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground px-4">
            Ready to start your next chapter?
          </h2>
          <Button size="lg" asChild className="h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg">
            <Link href="/signup">Create Your Free Account</Link>
          </Button>
          <p className="flex items-center justify-center gap-2 text-sm sm:text-base text-muted-foreground font-medium">
            <CheckCircle2 className="text-green-500 w-4 h-4 sm:w-5 sm:h-5" />
            20 free generations daily
          </p>
        </div>
      </div>
    </section>
  );
}
