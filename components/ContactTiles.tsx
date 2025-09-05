'use client';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/** Opens Gmail compose (prompts sign-in if needed). Falls back to mailto: if blocked. */
function openGmailCompose({ to, subject, body }: { to: string; subject: string; body: string }) {
  const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const win = window.open(gmail, "_blank", "noopener,noreferrer");
  if (!win) {
    // Fallback
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
}

export default function ContactTiles() {
  const router = useRouter();

  // Ask a question form + auto-expanding textarea
  const [question, setQuestion] = useState("");
  const questionLeft = 1000 - question.length;
  const askVisRef = useRef<HTMLDivElement>(null);
  const askTARef = useRef<HTMLTextAreaElement>(null);
  const [minAskHeight, setMinAskHeight] = useState(200); // initial; recalculated via ResizeObserver

  // Keep the initial visual space equal to a 16:9 area (same as image tiles)
  useEffect(() => {
    const el = askVisRef.current;
    const ta = askTARef.current;
    if (!el || !ta) return;

    const update = () => {
      const w = el.clientWidth;
      const h = Math.max(160, Math.round((w * 9) / 16)); // 16:9
      setMinAskHeight(h);
      // re-fit the textarea height (min = visual height; can grow beyond)
      requestAnimationFrame(() => {
        if (!ta) return;
        ta.style.height = "auto";
        ta.style.height = Math.max(h, ta.scrollHeight) + "px";
      });
    };

    const ro = new ResizeObserver(update);
    ro.observe(el);
    update();

    return () => ro.disconnect();
  }, []);

  const onQuestionChange = (v: string) => {
    const ta = askTARef.current;
    setQuestion(v.slice(0, 1000));
    if (!ta) return;
    ta.style.height = "auto";
    // maintain at least the initial 16:9 height, then expand
    ta.style.height = Math.max(minAskHeight, ta.scrollHeight) + "px";
  };

  const sendQuestion = () => {
    if (!question.trim()) return;
    openGmailCompose({
      to: "PrestonCreed@an.world",
      subject: "Question from Anything World website",
      body: `${question}\n\n— sent from anything.world`
    });
  };

  // Join tile micro-interaction
  const [showJoin, setShowJoin] = useState(true);
  const [rejected, setRejected] = useState(false);
  const onYes = () => router.push("/join");
  const onNo = () => {
    setRejected(true);
    setTimeout(() => setShowJoin(false), 1000);
  };

  return (
    <section className="container py-16">
      <h3 className="text-2xl font-semibold mb-8 text-center">Let your curiosity free-roam.</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {/* Ask a question */}
        <article className="h-full flex flex-col rounded-xl border border-white/15 bg-white/5 p-5">
          <h4 className="text-lg font-medium text-center">Ask a question</h4>

          {/* Visual space wrapper to measure width => compute 16:9 min height */}
          <div ref={askVisRef} className="mt-4">
            <textarea
              ref={askTARef}
              value={question}
              onChange={(e)=> onQuestionChange(e.target.value)}
              maxLength={1000}
              placeholder="Type up to 1000 characters…"
              className="w-full rounded-lg border border-white/15 bg-black/40 p-3 text-sm outline-none focus:border-white/30"
              style={{ minHeight: minAskHeight }}
            />
            <div className="text-xs opacity-60 mt-1 text-right">{questionLeft} chars left</div>
          </div>

          <div className="pt-4 mt-auto">
            <button
              onClick={sendQuestion}
              disabled={!question.trim()}
              className="w-full cta cta-blue justify-center disabled:opacity-40"
            >
              Send via Gmail
            </button>
          </div>
        </article>

        {/* Business inquiries (image + button that routes to /inquiries → 404 for now) */}
        <article className="h-full flex flex-col rounded-xl border border-white/15 bg-white/5 p-5">
          <h4 className="text-lg font-medium text-center">Business inquiries</h4>
          <p className="opacity-75 text-sm mt-1 text-center">Partnerships, licensing, opportunities.</p>

          {/* Image space (16:9) */}
          <div className="mt-4 rounded-lg border border-white/10 overflow-hidden">
            <div
              className="aspect-[16/9] w-full"
              style={{ background: "linear-gradient(120deg, rgba(15,126,221,.25), rgba(2,22,71,.25) 60%), rgba(255,255,255,.04)" }}
            />
          </div>

          <div className="pt-4 mt-auto">
            <Link href="/inquiries" className="w-full cta cta-green justify-center text-center">
              Contact
            </Link>
          </div>
        </article>

        {/* Join the mission (image space + yes/no) */}
        {showJoin && (
          <article className="h-full flex flex-col rounded-xl border border-white/15 bg-white/5 p-5 relative overflow-hidden">
            <h4 className="text-lg font-medium text-center">Join the mission</h4>
            <p className="opacity-75 text-sm mt-1 text-center">Anything World needs you. But do you need us???</p>

            {/* Image space (16:9) */}
            <div className="mt-4 rounded-lg border border-white/10 overflow-hidden">
              <div
                className="aspect-[16/9] w-full"
                style={{ background: "linear-gradient(120deg, rgba(180,108,255,.25), rgba(15,126,221,.25) 60%), rgba(255,255,255,.04)" }}
              />
            </div>

            <div className="mt-4 flex gap-3">
              {!rejected ? (
                <>
                  <button onClick={onYes} className="cta cta-purple flex-1 justify-center">Yes</button>
                  <button onClick={onNo} className="cta cta-red flex-1 justify-center">No</button>
                </>
              ) : (
                <div className="absolute inset-0 grid place-items-center">
                  <div className="text-5xl" style={{ imageRendering: "pixelated", filter: "saturate(0.6) brightness(0.8)" }}>☹️</div>
                </div>
              )}
            </div>
          </article>
        )}
      </div>
    </section>
  );
}