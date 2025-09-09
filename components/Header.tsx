"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import Logo from "@/components/logo";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

const links = [
  { href: "/", label: "Home" },
  { href: "/learn", label: "Learn More" },
  { href: "/creator-program", label: "Creator Program" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className ?? "h-5 w-5"}>
      <path d="M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14Zm9.3 14.9-3.6-3.6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className ?? "h-5 w-5"}>
      <path d="M12 12c2.76 0 5-2.24 5-5S14.76 2 12 2 7 4.24 7 7s2.24 5 5 5Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z" fill="currentColor" />
    </svg>
  );
}

export default function Header() {
  const pathname = usePathname();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getUser().then(({ data }: { data: { user: User | null } }) => {
      if (!mounted) return;
      setStatus(data.user ? "authenticated" : "unauthenticated");
    });

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_evt: AuthChangeEvent, session: Session | null) => setStatus(session?.user ? "authenticated" : "unauthenticated")
    );

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <header className="sticky top-0 z-40 backdrop-blur border-b border-white/10 bg-black/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Left: Logo & mobile toggle */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="sm:hidden p-2 rounded hover:bg-white/10"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>

            {/* Bigger-looking logo, same click area */}
            <div className="header-logo-wrapper" aria-label="AN World">
              <Logo className="h-7 w-auto header-logo-zoom" />
            </div>
          </div>

          {/* Center: Pill Buttons */}
          <nav className="hidden sm:block">
            <ul className="flex items-center gap-3">
              {links.map((l) => {
                const active = pathname === l.href;
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className={`pill ${active ? "active" : ""}`}
                      aria-current={active ? "page" : undefined}
                    >
                      {l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <button className="p-2 rounded hover:bg-white/10" aria-label="Search">
              <SearchIcon />
            </button>

            {status === "loading" && <div className="h-8 w-8 rounded-full bg-white/10 animate-pulse" />}

            {status === "unauthenticated" && (
              <Link href="/signin" className="text-sm rounded bg-white text-black px-3 py-1.5 hover:opacity-90">
                Sign in
              </Link>
            )}

            {status === "authenticated" && <UserMenu />}
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="sm:hidden py-2">
            <div className="flex flex-col gap-1">
              {links.map((l) => {
                const active = pathname === l.href;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`px-3 py-2 rounded text-sm ${active ? "bg-white/10" : "hover:bg-white/10"}`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </div>

      {/* Component-scoped styles */}
      <style jsx>{`
        /* Bigger-looking logo, same click area */
        .header-logo-wrapper {
          height: 1.75rem; /* matches h-7 */
          width: auto;
          overflow: hidden;
          display: grid;
          place-items: center;
        }
        .header-logo-zoom {
          transform: scale(1.18); /* visual zoom-in only */
          transform-origin: left center;
        }

        /* Pill buttons */
        .pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem 0.95rem;
          border-radius: 9999px; /* oval */
          border: 1.5px solid rgba(255, 255, 255, 1);
          color: rgba(255, 255, 255, 0.95);
          background: transparent;
          text-decoration: none;
          transition: background 120ms ease, box-shadow 120ms ease, color 120ms ease, border-color 120ms ease;
        }
        .pill:hover {
          background: rgba(255, 255, 255, 0.08);
        }
        .pill.active {
          border-color: #ffffff;
          color: #ffffff;
          box-shadow:
            inset 0 0 0 1px rgba(255, 255, 255, 0.35),
            0 0 16px var(--an-blue-glow, rgba(15, 126, 221, 0.35)); /* portal blue glow */
        }
      `}</style>
    </header>
  );
}

function UserMenu() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="h-8 w-8 rounded-full overflow-hidden ring-1 ring-white/30 hover:ring-white/60 transition-shadow grid place-items-center bg-white/10"
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((v) => !v)}
      >
        <UserIcon />
      </button>

      {menuOpen && (
        <div role="menu" className="absolute right-0 mt-2 w-56 rounded border border-white/10 bg-black/90 p-1 shadow-lg">
          <Link href="/account" role="menuitem" className="block px-3 py-2 rounded text-sm hover:bg-white/10" onClick={() => setMenuOpen(false)}>
            Account Settings
          </Link>
          <Link href="/settings/display" role="menuitem" className="block px-3 py-2 rounded text-sm hover:bg-white/10" onClick={() => setMenuOpen(false)}>
            Display Settings
          </Link>
          <Link href="/watch" role="menuitem" className="block px-3 py-2 rounded text-sm hover:bg-white/10" onClick={() => setMenuOpen(false)}>
            Watch History
          </Link>
          <Link href="/favorites" role="menuitem" className="block px-3 py-2 rounded text-sm hover:bg-white/10" onClick={() => setMenuOpen(false)}>
            Favorites
          </Link>
          <Link href="/creator-program" role="menuitem" className="block px-3 py-2 rounded text-sm hover:bg-white/10" onClick={() => setMenuOpen(false)}>
            Creator Program
          </Link>
          <div className="my-1 h-px bg-white/10" />
          <button
            role="menuitem"
            className="block w-full text-left px-3 py-2 rounded text-sm hover:bg-white/10 text-red-400"
            onClick={async () => {
              await supabase.auth.signOut();
              setMenuOpen(false);
            }}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
