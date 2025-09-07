// components/Header.tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Logo from "./logo";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const links = [
  { href: "/", label: "Home" },
  { href: "/learn", label: "Learn More" },
  { href: "/creator-program", label: "Creator Program", pill: true },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [email, setEmail] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setEmail(data.user?.email ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      setEmail(session?.user?.email ?? null);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Logo />
          <span className="font-medium">Anything World</span>
        </Link>

        <nav className="hidden md:flex items-center gap-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-1.5 rounded ${pathname === l.href ? "bg-white/10" : "hover:bg-white/5"}`}
            >
              {l.label}
              {l.pill ? <span className="ml-2 text-xs rounded-full bg-white/10 px-2 py-0.5">New</span> : null}
            </Link>
          ))}
          {email ? (
            <button
              className="rounded border border-white/20 px-3 py-1.5"
              onClick={async () => {
                await supabase.auth.signOut();
                setEmail(null);
              }}
            >
              Sign out
            </button>
          ) : (
            <Link href="/signin" className="rounded border border-white/20 px-3 py-1.5">
              Sign in
            </Link>
          )}
        </nav>

        {/* mobile menu toggle */}
        <button className="md:hidden rounded border border-white/20 px-3 py-1.5" onClick={() => setOpen(!open)}>
          Menu
        </button>
      </div>

      {/* mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-black/80 backdrop-blur">
          <div className="mx-auto max-w-6xl p-4 grid gap-3">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="rounded px-3 py-2 hover:bg-white/5" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            {email ? (
              <button
                className="rounded border border-white/20 px-3 py-2"
                onClick={async () => {
                  await supabase.auth.signOut();
                  setEmail(null);
                  setOpen(false);
                }}
              >
                Sign out
              </button>
            ) : (
              <Link href="/signin" className="rounded border border-white/20 px-3 py-2" onClick={() => setOpen(false)}>
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
