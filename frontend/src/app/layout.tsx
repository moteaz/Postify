import type { Metadata } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import { defaultMetadata } from "@/config/seo";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { QueryProvider } from "@/components/QueryProvider";
import Script from "next/script";
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
      <head>
        <link rel="canonical" href="https://postify.app" />
        <meta name="theme-color" content="#6366F1" />
      </head>
      <body className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] antialiased font-[family-name:var(--font-body)]">
        <QueryProvider>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </QueryProvider>
      </body>
      <Script
        id="schema-org"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Postify",
            "description": "AI-powered cover letter generator for job applications",
            "url": "https://postify.app",
            "applicationCategory": "BusinessApplication",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "operatingSystem": "Web Browser",
            "browserRequirements": "Requires JavaScript. Requires HTML5."
          })
        }}
      />
    </html>
  );
}
