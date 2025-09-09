export default function LearnMorePage() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* === Top: Logo Placeholder instead of "Learn More" title === */}
        <header className="text-center space-y-6">
          <div className="mx-auto h-16 w-48 border border-dashed border-white/30 rounded grid place-items-center">
            <span className="text-xs uppercase tracking-wide text-white/60">Logo Placeholder</span>
          </div>
        </header>

        {/* === Anything World Section (above Founder) === */}
        <section aria-labelledby="anything-world" className="space-y-6">
          <h2 id="anything-world" className="text-2xl font-bold text-center">Anything World</h2>

          {/* Image space like AN Universe */}
          <div className="mx-auto w-full max-w-3xl aspect-[16/9] border border-dashed border-white/30 rounded-lg bg-white/5" />

          {/* Subtitle */}
          <p className="text-center text-sm uppercase tracking-widest text-white/70">
            From screens to mountains — AN World
          </p>

          {/* Snappy brand-true description */}
          <p className="text-lg opacity-90 text-center">
            We’re building the largest new‑age entertainment studio—replacing the legacy Hollywood
            system with a creator‑first ecosystem where technology and imagination scale together.
          </p>
        </section>

        {/* === Founder Section === */}
        <section aria-labelledby="founder" className="space-y-6">
          <h2 id="founder" className="text-2xl font-bold">Founder</h2>

          {/* Founder image space */}
          <div className="mx-auto w-40 h-40 border border-dashed border-white/30 rounded-full bg-white/5" />

          <p className="opacity-90">
            I’m <span className="font-semibold">Preston Creed</span>, the founder of Anything World.
            My role is to guide the vision, build the systems, and rally the creators who will shape
            the next generation of entertainment with us.
          </p>
        </section>

        {/* === Mission (image placeholder only, centered; no title) === */}
        <section aria-label="Mission" className="space-y-6">
          <div className="mx-auto w-full max-w-3xl aspect-[16/9] border border-dashed border-white/30 rounded-lg grid place-items-center">
            <span className="text-xs uppercase tracking-widest text-white/60">
              Mission Statement Placeholder
            </span>
          </div>
        </section>

        {/* === The AN Vision === */}
        <section aria-labelledby="an-vision" className="space-y-4">
          <h2 id="an-vision" className="text-2xl font-bold">The AN Vision</h2>
          <p className="opacity-90">
            We’re designing a studio where ideas leap straight from visualization to creation. Our
            tools and pipelines are built so creators can move fast, collaborate fluidly, and retain
            their voice—without waiting on the old machine to catch up.
          </p>
          <p className="opacity-90">
            Our long game is a tapestry of persistent worlds and living stories.
            AN is equal parts lab and stage: a home for boundary‑pushing creators and a destination
            for audiences who want to explore, not just watch.
          </p>

          <div className="grid gap-4">
            <div>
              <h3 className="font-semibold">Visualization‑to‑Creation Freedom</h3>
              <p className="opacity-90">
                Intuitive workflows and toolchains that shorten the distance from concept to release,
                putting creative control back in the hands of makers.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">World Model Entertainment</h3>
              <p className="opacity-90">
                We treat IP as evolving worlds powered by “world models,” enabling stories, games,
                and experiences that expand indefinitely.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">AN Network</h3>
              <p className="opacity-90">
                A new kind of streaming platform—part studio, part distribution, part playground for
                interactive, creator‑led entertainment.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Simulation as Entertainment</h3>
              <p className="opacity-90">
                Worlds that react at a deep systems level, turning audiences into participants and
                creators into world‑builders.
              </p>
            </div>
          </div>
        </section>

        {/* === World‑Building === */}
        <section aria-labelledby="world-building" className="space-y-4">
          <h2 id="world-building" className="text-2xl font-bold">World‑Building</h2>
          <p className="opacity-90">
            We don’t just make content—we build worlds with infinite possibilities. Characters,
            places, systems, and lore persist across mediums, inviting collaboration, remixing, and
            exploration. AN itself is a world‑building project.
          </p>
        </section>

        {/* === AN Universe — Vision Teaser (unchanged) === */}
        <section aria-labelledby="an-universe" className="space-y-6">
          <h2 id="an-universe" className="text-2xl font-bold text-center">AN Universe — Vision Teaser</h2>

          {/* Logo placeholder */}
          <div className="mx-auto h-16 w-48 border border-dashed border-white/30 rounded grid place-items-center">
            <span className="text-xs uppercase tracking-wide text-white/60">Logo Placeholder</span>
          </div>

          {/* Centered image space under the logo */}
          <div className="mx-auto w-full max-w-3xl aspect-[16/9] border border-dashed border-white/30 rounded-lg bg-white/5" />

          {/* Subtitle */}
          <p className="text-center text-sm uppercase tracking-widest text-white/70">
            From screens to mountains — AN World
          </p>

          {/* Copy */}
          <div className="space-y-4 opacity-90">
            <p>
              The AN Universe is our living canvas—a place where stories leap across formats and where audiences
              become collaborators. It’s a long‑term vision that blends art, play, and real‑world experiences.
            </p>
            <p>
              We’re opening the doors one chapter at a time. If you’re curious about the worlds we’re building and
              the tools that power them, we’d love to have you along for the journey.
            </p>
          </div>

          {/* CTA */}
          <div className="text-center">
            <a
              href="/universe"
              className="font-semibold underline hover:no-underline"
              style={{ color: "var(--an-blue-light)" }}
            >
              Explore AN Universe
            </a>
            <span className="ml-2 text-white/50 text-sm">(More info coming soon)</span>
          </div>
        </section>

        {/* === How we can support you === */}
        <section aria-labelledby="support-you" className="space-y-6">
          <h2 id="support-you" className="text-2xl font-bold">How We Can Support You</h2>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Submissions Program */}
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <h3 className="font-semibold">Submissions Program</h3>
              <p className="opacity-90">
                We distribute your AI media to reach a wider audience—and you get paid.
              </p>
              <a
                href="/submissions"
                className="inline-block mt-3 font-semibold underline hover:no-underline"
                style={{ color: "var(--an-blue-light, #0f7edd)" }}
              >
                Learn More
              </a>
            </div>

            {/* Creator Program */}
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <h3 className="font-semibold">Creator Program (Pre‑Sign)</h3>
              <p className="opacity-90">
                Receive funding for projects with unbeatable revenue shares—and growth support for your brand.
              </p>
              <a
                href="/creator-program"
                className="inline-block mt-3 font-semibold underline hover:no-underline"
                style={{ color: "var(--an-blue-light, #0f7edd)" }}
              >
                Learn More
              </a>
            </div>

            {/* Explore new worlds daily */}
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 sm:col-span-2">
              <div className="w-full aspect-[16/9] border border-dashed border-white/30 rounded mb-3" />
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Explore new worlds daily</h3>
                <a
                  href="/"
                  className="font-semibold underline hover:no-underline"
                  style={{ color: "var(--an-blue-light, #0f7edd)" }}
                >
                  Back to an.world
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* === Support the mission === */}
        <section aria-labelledby="support-mission" className="space-y-4">
          <h2 id="support-mission" className="text-2xl font-bold">Support the Mission</h2>
          <ul className="list-disc pl-6 space-y-2 opacity-90">
            <li><a href="/newsletter" className="underline decoration-white/40 hover:decoration-white">Sign up for our newsletter</a></li>
            <li><a href="/shop" className="underline decoration-white/40 hover:decoration-white">Check out AN Shop</a></li>
            <li><a href="/partners" className="underline decoration-white/40 hover:decoration-white">Become a sponsor or partner</a></li>
            <li>Tell your friends!</li>
          </ul>
        </section>
      </div>
    </section>
  );
}
