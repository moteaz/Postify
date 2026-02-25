import type { Metadata } from "next";

export const siteConfig = {
  name: "Postify",
  description: "Automate your job applications with AI. Generate personalized cover letters and send them directly from your Gmail in seconds.",
  url: "https://postify.app",
  ogImage: "/og-image.png",
  links: {
    twitter: "https://twitter.com/postify",
    github: "https://github.com/postify",
  },
};

export const defaultMetadata: Metadata = {
  title: {
    default: "Postify | AI-Powered Job Applications",
    template: "%s | Postify",
  },
  description: siteConfig.description,
  keywords: ["job applications", "AI", "cover letter", "automation", "Gmail", "career"],
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
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};
