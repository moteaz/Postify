"use client";

import Link from "next/link";
import { Bot, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Logo />
        <DesktopNav />
        <MobileMenuButton isOpen={mobileMenuOpen} toggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
      </div>
      {mobileMenuOpen && <MobileNav onClose={() => setMobileMenuOpen(false)} />}
    </header>
  );
}

function Logo() {
  return (
    <Link className="flex items-center space-x-2 group" href="/">
      <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
        <Bot className="text-primary-foreground w-5 h-5" />
      </div>
      <span className="font-bold text-xl text-foreground">Postify</span>
    </Link>
  );
}

function DesktopNav() {
  return (
    <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          href={link.href}
        >
          {link.label}
        </Link>
      ))}
      <Button variant="ghost" asChild>
        <Link href="/login">Sign In</Link>
      </Button>
      <Button asChild>
        <Link href="/signup">Get Started</Link>
      </Button>
    </nav>
  );
}

function MobileMenuButton({ isOpen, toggle }: { isOpen: boolean; toggle: () => void }) {
  return (
    <button
      onClick={toggle}
      className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
      aria-label="Toggle navigation menu"
      aria-expanded={isOpen}
    >
      {isOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  );
}

function MobileNav({ onClose }: { onClose: () => void }) {
  return (
    <div className="md:hidden border-t border-border bg-background">
      <nav className="container mx-auto px-4 py-4 flex flex-col space-y-3">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
            href={link.href}
            onClick={onClose}
          >
            {link.label}
          </Link>
        ))}
        <Button variant="ghost" asChild className="justify-start">
          <Link href="/login" onClick={onClose}>Sign In</Link>
        </Button>
        <Button asChild>
          <Link href="/signup" onClick={onClose}>Get Started</Link>
        </Button>
      </nav>
    </div>
  );
}
