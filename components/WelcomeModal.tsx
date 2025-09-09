'use client';
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function WelcomeModal() {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const timerRef = useRef<number | null>(null);
  const startedByScroll = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("an_welcome_seen")) return;

    // Cancel only if a click is on content (cards, hero, slideshow)
    const onAnyClickCapture = (e: Event) => {
      const t = e.target as Element | null;
      if (t && t.closest && t.closest("[data-content-click]")) {
        if (timerRef.current) window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
    document.addEventListener("click", onAnyClickCapture, true);

    // On first scroll, start a ~12s timer (your "10–15s while scrolling")
    const startTimer = () => {
      if (timerRef.current) return;
      startedByScroll.current = true;
      timerRef.current = window.setTimeout(() => setOpen(true), 12000);
      window.removeEventListener("scroll", startTimer);
    };
    window.addEventListener("scroll", startTimer, { passive: true, once: true });

    // Fallback: 15s after load if no scroll occurs
    timerRef.current = window.setTimeout(() => {
      if (!startedByScroll.current) setOpen(true);
    }, 15000);

    return () => {
      document.removeEventListener("click", onAnyClickCapture, true);
      window.removeEventListener("scroll", startTimer);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  if (!open || dismissed) return null;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/70 backdrop-blur-sm">
      <div className="max-w-lg w-full mx-4 rounded-2xl border border-white/15 bg-black/90 p-6 relative">
        <button
          className="absolute right-3 top-3 opacity-70 hover:opacity-100"
          onClick={() => { setDismissed(true); localStorage.setItem("an_welcome_seen", "1"); }}
          aria-label="Close"
        >
          ✕
        </button>

        <div className="flex items-center gap-3 mb-3">
          {/* Logo (height ~ h-7 to match old styling) */}
          <div className="relative h-7 w-[140px]">
            <Image
              src="/images/an-logo.png"
              alt="Anything World logo"
              fill
              className="object-contain"
              priority
              sizes="140px"
            />
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-2">Welcome to Anything World</h3>
        <p className="opacity-80">
          We’re building a next-generation entertainment brand and creator ecosystem. Explore our worlds,
          follow the journey, and get involved as we invent new, living story spaces.
        </p>
        <p className="opacity-80 mt-2">
          Join us as we reimagine how stories are made, discovered, and shared.
        </p>

        <div className="mt-5 flex gap-3">
          <a
            href="/learn"
            className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
          >
            Learn More
          </a>
        </div>
      </div>
    </div>
  );
}
