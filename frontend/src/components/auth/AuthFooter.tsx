import Link from "next/link";
import { Fragment } from "react";

const FOOTER_LINKS = [
  { href: "/", label: "Home" },
  { href: "#privacy", label: "Privacy" },
  { href: "#terms", label: "Terms" },
];

export default function AuthFooter() {
  return (
    <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-4 sm:gap-6 text-xs font-medium text-muted-foreground">
      {FOOTER_LINKS.map((link, index) => (
        <Fragment key={link.href}>
          <Link href={link.href} className="hover:text-foreground transition-colors">
            {link.label}
          </Link>
          {index < FOOTER_LINKS.length - 1 && <span>•</span>}
        </Fragment>
      ))}
    </div>
  );
}
