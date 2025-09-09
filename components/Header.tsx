"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image"; // swapped in for Logo
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

function Logo() {
  return (
    <Link href="/" aria-label="Home" className="flex items-center gap-2">
      <Image src="/logo.svg" width={28} height={28} alt="Logo" />
      <span className="font-semibold">AN World</span>
    </Link>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        d="M3 6h18M3 12h18M3 18h18"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        d="m6 6 12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className ?? "h-5 w-5"}>
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
    supabase.auth.getUser().then(({ data }: { data: { user: User | null } }) => {
      if (!mounted) return;
      setStatus(data.user ? "authenticated" : "unauthenticated");
    });

    // Subscribe to auth changes
    const { data: sub } = supabase.auth.onAuthStateChange(
      (_evt: AuthChangeEvent, session: Session | null) => {
        if (!mounted) return;
        setStatus(session?.user ? "authenticated" : "unauthenticated");
      }
    );

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
    <header className="sticky top-0 z-40 backdrop-blur border-b border-white/10 bg-black/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="sm:hidden p-2 rounded hover:bg-white/10"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
            <Logo />
          </div>

          {/* Center: Nav (desktop) */}
          <nav className="hidden sm:flex items-center gap-6">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`text-sm transition-colors ${
                    active ? "text-white" : "text-white/70 hover:text-white"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <button className="p-2 rounded hover:bg-white/10" aria-label="Search">
              <SearchIcon />
            </button>

            {status === "loading" && (
              <div className="h-8 w-8 rounded-full bg-white/10 animate-pulse" />
            )}

            {status === "unauthenticated" && (
              <Link
                href="/signin"
                className="text-sm rounded bg-white text-black px-3 py-1.5 hover:opacity-90"
              >
                Sign in
              </Link>
            )}

            {status === "authenticated" && (
              <div className="relative" ref={menuRef}>
                <button
                  className="p-2 rounded hover:bg-white/10"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((v) => !v)}
                >
                  <UserIcon />
                </button>

                {menuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-40 rounded border border-white/10 bg-black/90 p-1 shadow-lg"
                  >
                    <Link
                      href="/admin"
                      role="menuitem"
                      className="block px-3 py-2 rounded text-sm hover:bg-white/10"
                      onClick={() => setMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      role="menuitem"
                      className="block w-full text-left px-3 py-2 rounded text-sm hover:bg-white/10"
                      onClick={async () => {
                        await supabase.auth.signOut();
                        setMenuOpen(false);
                      }}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            )}
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
                    className={`px-3 py-2 rounded text-sm ${
                      active ? "bg-white/10" : "hover:bg-white/10"
                    }`}
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
    </header>
  );
}

