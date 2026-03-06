"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TOCItem {
  id: string;
  title: string;
}

interface TableOfContentsProps {
  items: TOCItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -80% 0px" }
    );

    items.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className="space-y-1">
      <p className="text-xs font-bold uppercase tracking-widest text-[#A8A29E] mb-4">On this page</p>
      {items.map(({ id, title }) => (
        <a
          key={id}
          href={`#${id}`}
          className={cn(
            "block py-2 px-3 text-sm rounded-xl transition-all duration-150",
            activeId === id
              ? "bg-[#7C9EE8]/10 text-[#7C9EE8] font-semibold"
              : "text-[#78716C] hover:text-[#1C1917] hover:bg-[#F5F3F0]"
          )}
        >
          {title}
        </a>
      ))}
    </nav>
  );
}
