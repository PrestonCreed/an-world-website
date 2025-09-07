// lib/ip-allowlist.ts
/**
 * If ADMIN_IP_WHITELIST is empty, allow all IPs.
 * Otherwise, only allow when request IP is in the comma-separated list.
 * Accepts X-Forwarded-For (may be a list).
 */
export function isIpAllowed(xff: string | null) {
  const raw = (process.env.ADMIN_IP_WHITELIST || "").trim();
  if (!raw) return true; // no whitelist = don't enforce

  const allow = raw.split(",").map((s) => s.trim()).filter(Boolean);
  if (allow.length === 0) return true;

  const candidates = (xff || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  // Local aliases for convenience when whitelisting "localhost"
  const localAliases = new Set(["127.0.0.1", "::1", "::ffff:127.0.0.1"]);

  for (const ip of candidates) {
    if (allow.includes(ip)) return true;
    if (allow.includes("localhost") && localAliases.has(ip)) return true;
  }
  return false;
}
