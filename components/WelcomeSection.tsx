'use client';

import InteractiveBackdrop from "./interactive/InteractiveBackdrop";
import Image from "next/image";
import { useMemo, useState, useCallback } from "react";

type Tile = {
  title: string;
  href: string;
  imageSrc?: string;
};

const TILES: Tile[] = [
  { title: "Learn More",        href: "/learn",            imageSrc: "/images/ANPinkClouds.png" },
  { title: "Creator Program",   href: "/creator-program",  imageSrc: "/images/ANPinkClouds.png" },
  { title: "Blog",              href: "/blog",             imageSrc: "/images/ANPinkClouds.png" },
  { title: "Coming Soon",       href: "/coming-soon",      imageSrc: "/images/ANPinkClouds.png" },
];

export default function WelcomeSection() {
  return (
    <section className="container py-16">
      <InteractiveBackdrop>
        <div className="relative z-10 py-12">
          {/* === Wide Image Placeholder (replaces old title) === */}
          <div className="mx-auto w-full max-w-4xl aspect-[21/9] border border-dashed border-white/30 rounded-lg bg-white/5 grid place-items-center">
            <span className="text-xs uppercase tracking-widest text-white/60">Wide Image Placeholder</span>
          </div>

          {/* Subtitle */}
          <p className="mt-6 text-center text-sm uppercase tracking-widest text-white/70">
            From Screens to Mountains
          </p>

          {/* Description */}
          <p className="mt-2 text-center opacity-85">
            Learn more about us and check out our offerings.
          </p>

          {/* Version B ONLY: Linear “Xbox-style” stack */}
          <LinearStack tiles={TILES} />
        </div>
      </InteractiveBackdrop>
    </section>
  );
}

/* =========================
   Version B: Linear stack
   ========================= */

function LinearStack({ tiles }: { tiles: Tile[] }) {
  const [active, setActive] = useState(0);
  const count = tiles.length;

  const orderFor = useCallback(
    (idx: number) => (idx - active + count) % count, 
    [active, count]
  );

  const goNext = useCallback(() => setActive((i) => (i + 1) % count), [count]);
  const goPrev = useCallback(() => setActive((i) => (i - 1 + count) % count), [count]);

  const front = useMemo(() => tiles[active], [tiles, active]);

  return (
    // Shift the whole stack slightly LEFT so the composition feels centered.
    <div className="mt-10 pb-10">
      <div
        className="relative mx-auto w-full max-w-4xl h-80 sm:h-96 -translate-x-6 sm:-translate-x-8"
        style={{ perspective: 1000 }}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") { e.preventDefault(); goNext(); }
          if (e.key === "ArrowLeft")  { e.preventDefault(); goPrev(); }
        }}
        aria-roledescription="carousel"
        aria-label="Featured entries"
      >
        {/* stacked cards aligned left->right */}
        {tiles.map((tile, idx) => {
          const ord = orderFor(idx);
          const style = styleForLinearOrder(ord);
          const zIndex = zForLinearOrder(ord);
          const ariaHidden = ord !== 0;

          return (
            <a
              key={tile.title}
              href={tile.href}
              className="absolute top-1/2 left-1/2 w-[74%] sm:w-[62%] -translate-y-1/2 rounded-xl overflow-hidden border border-white/10 bg-black"
              style={{
                transform: style.transform,
                opacity: style.opacity,
                zIndex,
                boxShadow: style.boxShadow,
                transition: "transform 240ms ease, opacity 200ms ease, box-shadow 240ms ease",
              }}
              aria-hidden={ariaHidden}
              tabIndex={ariaHidden ? -1 : 0}
            >
              <div className="aspect-[16/9] relative">
                {tile.imageSrc && (
                  <Image
                    src={tile.imageSrc}
                    alt={tile.title}
                    fill
                    className="object-cover"
                    priority
                  />
                )}
              </div>
              <div className="p-3 text-center font-semibold" style={{ color: "var(--an-blue-light, #0f7edd)" }}>
                {tile.title}
              </div>
            </a>
          );
        })}

        {/* Live region */}
        <span className="sr-only" aria-live="polite">
          Showing {front?.title}
        </span>

        {/* Side controls — circular holographic rings (neutral), one on each side */}
        <button
          onClick={goPrev}
          className="holoBtn z-[70] absolute left-2 sm:left-4 top-1/2 -translate-y-1/2"
          aria-label="Previous"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={goNext}
          className="holoBtn z-[70] absolute right-2 sm:right-4 top-1/2 -translate-y-1/2"
          aria-label="Next"
        >
          <ChevronRight />
        </button>

        <style jsx>{`
          .holoBtn {
            height: 34px;
            width: 34px;
            display: grid;
            place-items: center;
            border-radius: 9999px;
            position: absolute;
            border: 1px solid rgba(255,255,255,0.65);
            background: radial-gradient(60% 60% at 50% 50%, rgba(255,255,255,0.12), rgba(255,255,255,0.03));
            backdrop-filter: blur(6px);
            box-shadow:
              0 0 0 1px rgba(255,255,255,0.2) inset,
              0 6px 14px rgba(0,0,0,0.35),
              0 0 20px rgba(255,255,255,0.12);
            color: #fff;
            transition: transform 120ms ease, box-shadow 160ms ease, background 160ms ease, border-color 160ms ease;
          }
          .holoBtn:hover, .holoBtn:focus-visible {
            transform: translateY(-1px);
            outline: none;
            border-color: rgba(255,255,255,0.9);
            background: radial-gradient(60% 60% at 50% 50%, rgba(255,255,255,0.18), rgba(255,255,255,0.05));
            box-shadow:
              0 0 0 1px rgba(255,255,255,0.28) inset,
              0 10px 20px rgba(0,0,0,0.4),
              0 0 28px rgba(255,255,255,0.18);
          }
          .holoBtn:active {
            transform: translateY(0);
            background: radial-gradient(60% 60% at 50% 50%, rgba(255,255,255,0.12), rgba(255,255,255,0.02));
          }
        `}</style>
      </div>
    </div>
  );
}

/** linear stack styling: front at center; others march to the RIGHT in a line */
function styleForLinearOrder(ord: number) {
  // tighter spacing so the next three only peek out a little
  const xOffsets = [0, 80, 140, 200];
  const scales   = [1.0, 0.985, 0.97, 0.955];
  const tilts    = [0, -2, -2, -2];
  const opac     = [1, 0.97, 0.94, 0.9];

  const i = Math.min(Math.max(ord, 0), 3);
  return {
    transform: `translate(calc(-50% + ${xOffsets[i]}px), -50%) scale(${scales[i]}) rotateY(${tilts[i]}deg)`,
    opacity: opac[i],
    boxShadow:
      i === 0
        ? "0 10px 28px rgba(0,0,0,0.35), 0 0 20px rgba(255,255,255,0.18)"
        : "0 6px 18px rgba(0,0,0,0.28)",
  };
}

function zForLinearOrder(ord: number) {
  // Highest z for active, then decreasing as they move right/back
  switch (ord) {
    case 0: return 60;
    case 1: return 50;
    case 2: return 40;
    case 3: return 30;
    default: return 10;
  }
}

/* Simple chevrons */
function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M14.5 5.5 8 12l6.5 6.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M9.5 5.5 16 12l-6.5 6.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}


