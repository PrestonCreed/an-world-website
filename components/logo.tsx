'use client';
import Image from "next/image";
import { useState } from "react";

export default function Logo({ className }: { className?: string }) {
  const [fallback, setFallback] = useState(false);

  if (fallback) {
    // Minimal fallback mark until /public/images/an-logo.png exists
    return <span className={`font-extrabold text-2xl tracking-tight ${className ?? ""}`}>AN</span>;
  }

  return (
    <Image
      src="/images/an-logo.png"
      alt="Anything World"
      width={160}
      height={48}
      priority
      className={className ?? "h-7 w-auto"}
      onError={() => setFallback(true)}
    />
  );
}