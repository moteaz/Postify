import type { Metadata } from "next";

export const siteConfig = {
  name: "Postify",
  description: "AI-powered cover letter generator that creates personalized job applications in seconds. Upload your CV, paste job descriptions, and send professional cover letters directly via Gmail.",
  url: "https://postify.app",
  ogImage: "/og-image.png",
  links: {
    twitter: "https://twitter.com/postify",
    github: "https://github.com/postify",
  },
};

export const defaultMetadata: Metadata = {
  title: {
    default: "Postify | Free AI Cover Letter Generator - Create Professional Job Applications in Seconds",
    template: "%s | Postify",
  },
  description: "Generate personalized, professional cover letters instantly with AI. Upload your CV, paste any job description, and send applications directly via Gmail. 100% free forever. No credit card required.",
  keywords: [
    "AI cover letter generator",
    "job application automation",
    "personalized cover letters",
    "AI job applications",
    "cover letter writer",
    "Gmail integration",
    "CV management",
    "job search tools",
    "career automation",
    "free cover letter generator"
  ],
  authors: [{ name: "Postify Team" }],
  creator: "Postify",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@postify",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
};
