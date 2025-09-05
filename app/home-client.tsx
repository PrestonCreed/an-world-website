'use client';
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import HeroCarousel from "../components/HeroCarousel";
import StreamingSwitch from "../components/StreamingSwitch";
import WelcomeSection from "../components/WelcomeSection";
import ContactTiles from "../components/ContactTiles";
import WelcomeModal from "../components/WelcomeModal";

/**
 * Reads `layout` from URL (?layout=A|B) and writes changes shallowly on toggle.
 */
export default function HomeClient(){
  const search = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initialMode = useMemo<"A"|"B">(() => {
    const q = (search.get("layout") || "A").toUpperCase();
    return q === "B" ? "B" : "A";
  }, [search]);

  const [mode, setMode] = useState<"A"|"B">(initialMode);

  // Sync state if URL changes externally
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // When mode changes via toggle, push shallow URL
  const handleModeChange = (m: "A"|"B") => {
    setMode(m);
    const params = new URLSearchParams(search.toString());
    if (m === "A") params.delete("layout"); else params.set("layout", "B");
    const url = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(url, { scroll: false });
  };

  return (
    <>
      {/* Show hero only in Version A */}
      {mode === "A" && <HeroCarousel />}

      <StreamingSwitch mode={mode} onModeChange={handleModeChange} />

      <WelcomeSection />

      {/* New contact/inquiries row */}
      <ContactTiles />

      <WelcomeModal />
    </>
  )
}