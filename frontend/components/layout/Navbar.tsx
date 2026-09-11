"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import SearchPalette from "@/components/SearchPalette";

export default function Navbar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const link = (href: string, label: string) => {
    const active = path === href || (href !== "/" && path.startsWith(href));
    return (
      <Link
        href={href}
        className={`font-mono text-[11px] tracking-[0.18em] transition-colors ${
          active ? "text-white" : "text-[#8a8f98] hover:text-white"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#22262c] bg-[#0a0b0d]/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-5 md:px-10">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-baseline gap-2">
              <span className="text-[17px] font-bold tracking-tight">TUTES</span>
              <span className="hidden font-mono text-[9px] tracking-[0.2em] text-[#555b64] sm:inline">
                ALGO/LAB
              </span>
            </Link>
            <nav className="hidden items-center gap-6 md:flex">
              {link("/algorithms", "ALGORITHMS")}
              {link("/algorithms/backtracking", "PLAYGROUND")}
              {link("/#how", "LEARN")}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden font-mono text-[10px] tracking-[0.15em] text-[#555b64] lg:inline">
              EXECUTION ENGINE // READY
            </span>
            <button
              onClick={() => setOpen(true)}
              aria-label="Search algorithms"
              className="flex items-center gap-2 border border-[#22262c] bg-[#0f1114] px-3 py-1.5 font-mono text-[11px] text-[#8a8f98] transition-colors hover:border-[#2f5bff] hover:text-white"
            >
              <Search size={13} />
              <span className="hidden sm:inline">SEARCH</span>
              <kbd className="border border-[#22262c] px-1 text-[10px]">⌘K</kbd>
            </button>
          </div>
        </div>
      </header>
      <SearchPalette open={open} onClose={() => setOpen(false)} />
    </>
  );
}
