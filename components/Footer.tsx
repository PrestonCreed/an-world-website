import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10">
      <div className="container py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand / tagline */}
        <div>
          <div className="mb-3">
            <Logo className="h-8 w-auto" />
          </div>
          <p className="text-sm opacity-80 max-w-sm">
            You can build worlds, you can do anything
          </p>
        </div>

        {/* Company */}
        <nav className="text-sm">
          <div className="opacity-60 mb-2">Company</div>
          <a className="block opacity-80 hover:opacity-100" href="/learn">Learn More</a>
          <a className="block opacity-80 hover:opacity-100" href="/mission-and-values">Mission and Values</a>
          <a className="block opacity-80 hover:opacity-100" href="/join">Join the Mission</a>
        </nav>

        {/* Explore */}
        <nav className="text-sm">
          <div className="opacity-60 mb-2">Explore</div>
          <a className="block opacity-80 hover:opacity-100" href="/creator-program">Creator Program</a>
          <a className="block opacity-80 hover:opacity-100" href="/blog">Blog</a>
          <a className="block opacity-80 hover:opacity-100" href="/story-worlds">Story Worlds</a>
          <a className="block opacity-80 hover:opacity-100" href="/an-universe">AN Universe</a>
          <a className="block opacity-80 hover:opacity-100" href="/an-network">AN Network</a>
          <a className="block opacity-80 hover:opacity-100" href="/reads">Important Reads</a>
          <a className="block opacity-80 hover:opacity-100" href="/wtf">What the hell is this?</a>
        </nav>

        {/* Contact & Social */}
        <div className="text-sm space-y-2">
          <div className="opacity-60">Contact</div>
          <a className="block opacity-80 hover:opacity-100" href="mailto:contact@an.world">contact@an.world</a>
          <div className="flex gap-4 pt-2">
            <a className="opacity-80 hover:opacity-100" href="https://x.com/watchanworld" target="_blank" rel="noopener noreferrer">X</a>
            <a className="opacity-80 hover:opacity-100" href="https://www.instagram.com/watchanworld/" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a className="opacity-80 hover:opacity-100" href="https://www.tiktok.com/@watchanworld?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer">TikTok</a>
          </div>
          <p className="opacity-60 pt-6">© 2025 The Anything World Company. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}