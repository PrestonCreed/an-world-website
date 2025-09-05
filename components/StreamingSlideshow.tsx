'use client';
import { useState } from "react";

export default function StreamingSlideshow() {
  const slides = Array.from({length:10}).map((_,i)=> ({
    id:`slide-${i}`,
    title:`Latest Slide ${i+1}`
  }));
  const [idx, setIdx] = useState(0);
  const next = ()=> setIdx((i)=> (i+1)%slides.length);
  const prev = ()=> setIdx((i)=> (i-1+slides.length)%slides.length);

  return (
    <section className="pt-4" data-content-click>
      <div className="edge-to-edge">
        <div className="container">
          <div className="flex items-end justify-between mb-3">
            <h3 className="text-lg font-semibold">Latest Content</h3>
          </div>
        </div>

        <div className="carousel">
          <div className="slides" style={{gridTemplateColumns: `repeat(${slides.length}, 1fr)`}}>
            {slides.map((s,i)=> (
              <div key={s.id} aria-hidden={i!==idx} style={{display: i===idx?'block':'none'}} className="overflow-hidden">
                <div
                  className="w-full aspect-[16/9] max-h-[65vh] min-h-[240px] md:max-h-[60vh] lg:max-h-[55vh] border border-white/10 rounded-none md:rounded-xl"
                  style={{background:`linear-gradient(120deg, rgba(255,255,255,.06), rgba(15,126,221,.18)), rgba(255,255,255,.04)`}}
                />
                <div className="container">
                  <div className="p-4 pl-0 md:pl-0">
                    <h4 className="text-base font-medium">{s.title}</h4>
                    <p className="text-sm opacity-70">Subtitle text to showcase the look.</p>
                  </div>
                </div>
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