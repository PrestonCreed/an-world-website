// components/Header.tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import Logo from "./logo";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

const links = [
  { href: "/", label: "Home" },
  { href: "/learn", label: "Learn More" },
  { href: "/creator-program", label: "Creator Program" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className ?? "h-4 w-4"}>
      <path
        d="M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14Zm9.3 14.9-3.6-3.6"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className ?? "h-5 w-5"}>
      <path
        d="M12 12c2.76 0 5-2.24 5-5S14.76 2 12 2 7 4.24 7 7s2.24 5 5 5Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Header() {
  const pathname = usePathname();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;

    // Prime auth state
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setStatus(data.user ? "authenticated" : "unauthenticated");
    });

    // Subscribe to auth changes
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      if (!mounted) return;
      setStatus(session?.user ? "authenticated" : "unauthenticated");
    });

    // Click outside to close the user menu
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("click", onDocClick);

    return () => {
      mounted = false;
      document.removeEventListener("click", onDocClick);
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <header className="sticky top-0 z-40 backdrop-blur border-b border-white/10">
      <div className="container flex items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-7 w-auto" />
          <span className="sr-only">AN World</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:block">
          <ul className="connected-nav flex items-center gap-3">
            {links.map((l, i) => {
              const active = pathname === l.href;
              return (
                <li key={l.href} className="relative">
                  <Link
                    href={l.href}
                    className={`connected-pill ${active ? "bg-white/10" : "hover:bg-white/5"}`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right side actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Search button */}
          <button
            type="button"
            className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 hover:bg-white/5"
            aria-label="Search"
            onClick={() => alert('Search coming soon')}
          >
            <SearchIcon className="h-4 w-4 opacity-80" />
            <span className="text-sm tracking-wide opacity-90">Search</span>
          </button>

          {status === "authenticated" ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center justify-center rounded-full border border-white/20 p-2 hover:bg-white/5"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                aria-label="User menu"
              >
                <UserIcon className="h-5 w-5 opacity-90" />
              </button>
              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-60 rounded-xl border border-white/10 bg-black/90 backdrop-blur shadow-lg shadow-cyan-500/10 p-2"
                >
                  <div className="px-3 pb-2 pt-1 text-xs uppercase tracking-wide opacity-70">
                    Account
                  </div>
                  <button className="menu-item" onClick={(e) => e.preventDefault()}>Profile Settings</button>
                  <button className="menu-item" onClick={(e) => e.preventDefault()}>Plan</button>
                  <Link href="/creator-program" className="menu-item">Sign Up for Creator Program</Link>
                  <button className="menu-item" onClick={(e) => e.preventDefault()}>Watch History</button>
                  <button className="menu-item" onClick={(e) => e.preventDefault()}>Favorites</button>
                  <button className="menu-item" onClick={(e) => e.preventDefault()}>Settings</button>
                  <div className="my-1 border-t border-white/10" />
                  <button
                    className="menu-item !text-red-400 hover:!bg-red-500/10"
                    onClick={async () => {
                      await supabase.auth.signOut();
                      window.location.assign("/");
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/signin" className="rounded-full border border-white/20 px-4 py-2 hover:bg-white/5">
                Sign in
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden rounded border border-white/20 px-3 py-1"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          Menu
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10">
          <div className="container py-3 space-y-3">
            <div className="flex gap-2">
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-2 rounded border border-white/20 px-4 py-2"
                onClick={() => alert('Search coming soon')}
              >
                <SearchIcon className="h-4 w-4 opacity-80" />
                <span className="text-sm tracking-wide opacity-90">Search</span>
              </button>
              {status === "unauthenticated" && (
                <Link
                  href="/signin"
                  className="flex-1 text-center rounded border border-white/20 px-4 py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign in
                </Link>
              )}
            </div>

            <nav className="grid gap-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`block px-3 py-2 rounded ${pathname === l.href ? "bg-white/10" : "hover:bg-white/5"}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
              {status === "authenticated" && (
                <button
                  className="mt-2 w-full rounded border border-white/20 px-4 py-2 text-left"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    window.location.assign("/");
                  }}
                >
                  Sign Out
                </button>
              )}
            </nav>
          </div>
        </div>
      )}

      {/* Local styles for the connected node effect and menu items */}
      <style jsx global>{`
        .connected-nav .connected-pill {
          position: relative;
          display: inline-flex;
          align-items: center;
          padding: 0.375rem 0.75rem; /* px-3 py-1.5 */
          border-radius: 9999px;
          border: 1px solid rgba(255,255,255,0.2);
          box-shadow: 0 0 24px rgba(56,189,248,0.28);
          transition: background-color 120ms ease, box-shadow 200ms ease;
        }
        .connected-nav li {
          position: relative;
        }
        /* Connector line */
        .connected-nav li::after {
          content: "";
          position: absolute;
          top: 50%;
          right: -10px;
          width: 20px;
          height: 1px;
          transform: translateY(-50%);
          background: linear-gradient(
            to right,
            rgba(255,255,255,0.3),
            rgba(56,189,248,0.7),
            rgba(255,255,255,0.3)
          );
          filter: drop-shadow(0 0 6px rgba(56,189,248,0.8));
        }
        .connected-nav li:last-child::after {
          display: none;
        }
        /* Connector dot at the end of each line */
        .connected-nav li::before {
          content: "";
          position: absolute;
          top: 50%;
          right: -12px;
          width: 6px;
          height: 6px;
          border-radius: 9999px;
          transform: translate(50%, -50%);
          background: #0ea5e9; /* brand blue */
          border: 1px solid rgba(255,255,255,0.9);
          box-shadow: 0 0 10px rgba(56,189,248,0.7);
        }
        .connected-nav li:last-child::before {
          display: none;
        }
        /* Dropdown menu item */
        .menu-item {
          width: 100%;
          text-align: left;
          padding: 0.5rem 0.75rem;
          border-radius: 0.5rem;
          font-size: 0.95rem;
          line-height: 1.25rem;
          color: rgba(255,255,255,0.92);
        }
        .menu-item:hover {
          background: rgba(255,255,255,0.06);
        }
      `}</style>
    </header>
  );
}
