import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function CTA() {
  return (
    <section className="w-full py-12 sm:py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 px-4">
            Ready to start your next chapter?
          </h2>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center h-12 sm:h-14 px-8 sm:px-10 rounded-full bg-primary text-white text-base sm:text-lg font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
          >
            Create Your Free Account
          </Link>
          <p className="flex items-center justify-center gap-2 text-sm sm:text-base text-neutral-600 font-medium">
            <CheckCircle2 className="text-green-500 w-4 h-4 sm:w-5 sm:h-5" />
            20 free generations daily
          </p>
        </div>
      </div>
    </section>
  );
}
