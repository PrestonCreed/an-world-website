// lib/watch-gate.ts
// Cookie-based gate so anonymous users can watch first, then must sign up.
// Keys:
//  - aw_last_media: last mediaId watched
//  - aw_watched_secs: max seconds watched on last media
//  - aw_completed: "1" if a full show/stream was watched
//  - aw_prompted: "1" if we've already shown the signup popup

export function setCookie(name: string, value: string, days = 7) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; samesite=lax`;
}
export function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  return document.cookie.split("; ").reduce((r, c) => {
    const [k, v] = c.split("=");
    return k === name ? decodeURIComponent(v) : r;
  }, null as string | null);
}

export function markProgress(mediaId: string, seconds: number) {
  const last = getCookie("aw_last_media");
  if (!last || last !== mediaId) setCookie("aw_last_media", mediaId);
  const prev = Number(getCookie("aw_watched_secs") || "0");
  if (seconds > prev) setCookie("aw_watched_secs", String(seconds));
  if (seconds >= 60) {
    // mark threshold reached (1 minute watched)
    // we use aw_watched_secs >= 60 as the signal
  }
}

export function markCompleted(mediaId: string) {
  setCookie("aw_last_media", mediaId);
  setCookie("aw_completed", "1");
}

export function resetPrompt() {
  setCookie("aw_prompted", "0");
}

export function shouldGateOnNext(mediaId: string): boolean {
  const last = getCookie("aw_last_media");
  const secs = Number(getCookie("aw_watched_secs") || "0");
  const completed = getCookie("aw_completed") === "1";
  const prompted = getCookie("aw_prompted") === "1";

  // Gate when: (completed a previous item) OR (watched >=60s of a previous item),
  // AND the user is attempting to watch a different item, AND we haven't prompted yet.
  const different = !!last && last !== mediaId;
  return !prompted && different && (completed || secs >= 60);
}

export function markPromptShown() {
  setCookie("aw_prompted", "1");
}
