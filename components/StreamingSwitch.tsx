'use client';
import ContentRail from "./ContentRail";
import StreamingSlideshow from "./StreamingSlideshow";

export default function StreamingSwitch({
  mode,
  onModeChange
}: {
  mode: "A" | "B";
  onModeChange: (m: "A" | "B") => void;
}) {
  return (
    <section className="container pt-6">
      <div className="flex items-center gap-3">
        <div className="text-sm opacity-80">Streaming Layout:</div>
        <div className="inline-flex rounded-full border border-white/15 overflow-hidden">
          <button onClick={() => onModeChange("A")} className={`px-3 py-1.5 text-sm ${mode==="A"?"bg-white/10":""}`}>Version A</button>
          <button onClick={() => onModeChange("B")} className={`px-3 py-1.5 text-sm ${mode==="B"?"bg-white/10":""}`}>Version B</button>
        </div>
      </div>

      {mode === "A" ? (
        <>
          <ContentRail title="Latest Releases" />
          <ContentRail title="All Releases" />
          <ContentRail title="Coming Soon" />
        </>
      ) : (
        /* Version B: full-bleed Latest, no hero above */
        <StreamingSlideshow />
      )}
    </section>
  );
}