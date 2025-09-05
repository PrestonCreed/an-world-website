'use client';
import InteractiveBackdrop from "./interactive/InteractiveBackdrop";

export default function WelcomeSection() {
  return (
    <section className="container py-16">
      <InteractiveBackdrop>
        <div className="relative z-10 text-center py-16">
          <h2 className="text-3xl font-bold">Welcome to Anything World</h2>
          <p className="opacity-80 max-w-2xl mx-auto mt-3">
            A next-generation entertainment brand and creator ecosystem. This is a centered
            section placed below the streaming area as requested.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="/learn" className="cta cta-green">Learn More</a>
            <a href="/creator-program" className="cta cta-blue">Creator Program</a>
            <a href="/blog" className="cta cta-purple">Read Our Blog</a>
            <a href="/coming-soon" className="cta cta-red">Coming Soon</a>
          </div>
        </div>
      </InteractiveBackdrop>
    </section>
  );
}
