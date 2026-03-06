import type { Metadata } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import { defaultMetadata } from "@/config/seo";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { QueryProvider } from "@/components/QueryProvider";
import "./globals.css";

const bricolage = Bricolage_Grotesque({ 
  subsets: ["latin"], 
  display: "swap",
  variable: "--font-display"
});

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"], 
  display: "swap",
  variable: "--font-body"
});

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bricolage.variable} ${jakarta.variable}`}>
      <body className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] antialiased font-[family-name:var(--font-body)]">
        <QueryProvider>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </QueryProvider>
      </body>
    </html>
  );
}
