"use client";

import Link from "next/link";
import { Bot, Menu, X } from "lucide-react";
import { useState } from "react";

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "/login", label: "Sign In" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-md">
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
      <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
        <Bot className="text-white w-5 h-5" />
      </div>
      <span className="font-bold text-lg sm:text-xl text-neutral-900">Postify</span>
    </Link>
  );
}

function DesktopNav() {
  return (
    <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
          href={link.href}
        >
          {link.label}
        </Link>
      ))}
      <Link
        className="inline-flex items-center justify-center h-10 px-4 lg:px-6 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm hover:shadow-md"
        href="/signup"
      >
        Get Started
      </Link>
    </nav>
  );
}

function MobileMenuButton({ isOpen, toggle }: { isOpen: boolean; toggle: () => void }) {
  return (
    <button
      onClick={toggle}
      className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
      aria-label="Toggle navigation menu"
      aria-expanded={isOpen}
    >
      {isOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  );
}

function MobileNav({ onClose }: { onClose: () => void }) {
  return (
    <div className="md:hidden border-t border-neutral-200 bg-white">
      <nav className="container mx-auto px-4 py-4 flex flex-col space-y-3">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors py-2"
            href={link.href}
            onClick={onClose}
          >
            {link.label}
          </Link>
        ))}
        <Link
          className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm mt-2"
          href="/signup"
          onClick={onClose}
        >
          Get Started
        </Link>
      </nav>
    </div>
  );
}
