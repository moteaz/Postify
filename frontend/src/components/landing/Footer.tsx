import Link from "next/link";
import { Bot, Shield } from "lucide-react";

const FOOTER_LINKS = {
  platform: [
    { href: "/auth?mode=login", label: "Login" },
    { href: "/auth?mode=signup", label: "Sign Up" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="w-full py-8 sm:py-12 border-t border-border bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8">
          <Logo />
          <FooterLinks />
          <FooterInfo />
        </div>
      </div>
    </footer>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
        <Bot size={18} />
      </div>
      <span className="font-bold text-base sm:text-lg text-foreground">Postify</span>
    </div>
  );
}

function FooterLinks() {
  return (
    <div className="flex gap-8 sm:gap-12">
      <FooterLinkGroup title="Platform" links={FOOTER_LINKS.platform} />
      <FooterLinkGroup title="Legal" links={FOOTER_LINKS.legal} />
    </div>
  );
}

function FooterLinkGroup({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div className="flex flex-col gap-3 text-center md:text-left">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</span>
      {links.map((link) => (
        <Link key={link.href} href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          {link.label}
        </Link>
      ))}
    </div>
  );
}

function FooterInfo() {
  return (
    <div className="text-center md:text-right">
      <p className="text-xs sm:text-sm text-muted-foreground">© 2026 Postify AI. Build your future faster.</p>
      <div className="flex items-center justify-center md:justify-end gap-2 mt-2">
        <Shield className="w-3 h-3 text-green-500" />
        <span className="text-xs text-muted-foreground font-medium">Secure OAuth Integration</span>
      </div>
    </div>
  );
}
