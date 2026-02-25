import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <FileQuestion className="w-8 h-8 text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-neutral-900">Page Not Found</h2>
          <p className="text-neutral-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex h-11 px-6 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-all items-center justify-center"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
