'use client';
import { useRef, useState } from "react";

export default function InteractiveBackdrop({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  function setFromEvent(clientX: number, clientY: number) {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const x = ((clientX - r.left) / r.width) * 100;
    const y = ((clientY - r.top) / r.height) * 100;
    setPos({ x, y });
  }

  return (
    <div
      ref={ref}
      className="interactive-wrap"
      onMouseMove={(e) => setFromEvent(e.clientX, e.clientY)}
      onTouchMove={(e) => {
        const t = e.touches?.[0];
        if (t) setFromEvent(t.clientX, t.clientY);
      }}
    >
      <div
        className="interactive-backdrop"
        aria-hidden
        style={{
          background: `radial-gradient(40% 30% at ${pos.x}% ${pos.y}%, rgba(15,126,221,0.14), transparent 60%)`
        }}
      />
      {children}
    </div>
  );
}