// components/Header.tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "./logo";
import { useSession, signOut } from "next-auth/react";

const links = [
  { href: "/", label: "Home" },
  { href: "/learn", label: "Learn More" },
  { href: "/creator-program", label: "Creator Program", pill: true },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  // close mobile menu on route change
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-40 backdrop-blur border-b border-white/10">
      <div className="container flex items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-7 w-auto" />
          <span className="sr-only">AN World</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-4">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-1 rounded-full transition ${
                  l.pill ? "border border-white/20" : ""
                } ${active ? "bg-white/10" : "hover:bg-white/5"}`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* your existing search button could live here */}
          {/* <button className="search-button">search</button> */}
          {status === "authenticated" ? (
            <>
              <span className="text-sm opacity-80">
                {session.user?.name ?? session.user?.email ?? "Account"}
              </span>
              <button
                className="rounded-full border border-white/20 px-4 py-2"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Sign out
              </button>
            </>
          ) : (
            <Link href="/signin" className="rounded-full border border-white/20 px-4 py-2">
              Sign in
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden rounded border border-white/20 px-3 py-1"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          Menu
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-white/10">
          <div className="container py-3 space-y-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`block px-3 py-2 rounded ${pathname === l.href ? "bg-white/10" : "hover:bg-white/5"}`}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-2 flex gap-3">
              {status === "authenticated" ? (
                <button
                  className="flex-1 rounded border border-white/20 px-4 py-2"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Sign out
                </button>
              ) : (
                <Link
                  href="/signin"
                  className="flex-1 text-center rounded border border-white/20 px-4 py-2"
                  onClick={() => setOpen(false)}
                >
                  Sign in
                </Link>
              )}
              {/* <button className="search-button flex-1 rounded border border-white/20 px-4 py-2">search</button> */}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
