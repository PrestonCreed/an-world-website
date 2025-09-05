'use client';
import { useState } from "react";

const slides = Array.from({length:5}).map((_,i)=> ({
  id: `hero-${i}`,
  title: `Hero Slide ${i+1}`,
  // Placeholder gradient; swap with real image via background-image or <Image />
  bg: `linear-gradient(120deg, rgba(15,126,221,.25), rgba(2,22,71,.25) ${20+i*10}%), rgba(255,255,255,.04)`
}));

export default function HeroCarousel(){
  const [idx, setIdx] = useState(0);
  const next = () => setIdx((i)=> (i+1)%slides.length);
  const prev = () => setIdx((i)=> (i-1+slides.length)%slides.length);

  return (
    <section className="pt-4" data-content-click>
      <div className="edge-to-edge">
        <div className="carousel">
          <div className="slides" style={{gridTemplateColumns: `repeat(${slides.length}, 1fr)`}}>
            {slides.map((s, i)=> (
              <div
                key={s.id}
                aria-hidden={i!==idx}
                className="overflow-hidden"
                style={{display: i===idx ? 'block':'none'}}
              >
                {/* 16:9 full-bleed, but height-limited so rails are visible */}
                <div
                  className="w-full aspect-[16/9] max-h-[65vh] min-h-[240px] md:max-h-[60vh] lg:max-h-[55vh] border border-white/10 rounded-none md:rounded-xl"
                  style={{background: s.bg}}
                />
              </div>
            ))}
          </div>
          <div className="nav px-2">
            <button aria-label="Previous" onClick={prev}>‹</button>
            <button aria-label="Next" onClick={next}>›</button>
          </div>
          <div className="dots">
            {slides.map((_,i)=> <div key={i} className={`dot ${i===idx?'active':''}`} onClick={()=>setIdx(i)} />)}
          </div>
        </div>
      </div>
    </section>
  );
}