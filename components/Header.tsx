'use client';
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import Logo from "./logo";

const links = [
  { href: "/", label: "Home" },
  { href: "/learn", label: "Learn More" },
  { href: "/creator-program", label: "Creator Program", pill: true },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 header-glass">
      <div className="container h-16 flex items-center justify-between">
        <Link href="/" aria-label="Anything World Home" className="flex items-center">
          <Logo className="h-7 w-auto" />
        </Link>

        {/* Desktop nav, linked like nodes */}
        <nav className="hidden md:block">
          <ul className="nav-net">
            {links.map((l) => {
              const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={`text-sm hover:opacity-100 transition ${l.pill ? "pill-outline" : "cta"} ${active ? "opacity-100" : "opacity-70"}`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-3">
          <button className="search-button" aria-label="Search">search</button>
          <a href="/signup" className="text-sm rounded-full border border-white/20 px-4 py-2 hover:bg-white/10 transition">Sign Up</a>
        </div>

        {/* Mobile nav toggle */}
        <button
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-white/10"
          aria-label="Open menu"
          onClick={() => setOpen(v => !v)}
        >
          ☰
        </button>
      </div>

      {/* Mobile sheet */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-black/90 backdrop-blur-sm">
          <div className="container py-3 flex flex-col gap-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`py-2 ${l.pill ? "pill-outline inline-block w-max" : ""}`}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-2 flex gap-3">
              <a href="/signup" className="rounded-full border border-white/20 px-4 py-2">Sign Up</a>
              <button className="search-button">search</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}