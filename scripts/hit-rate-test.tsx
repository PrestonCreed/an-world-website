const BASE = process.env.BASE_URL ?? "http://localhost:3000";

async function main() {
  const url = `${BASE}/api/tests/rate-test`;
  for (let i = 1; i <= 70; i++) {
    const res = await fetch(url, { method: "GET" });
    const data = await res.json().catch(() => ({}));
    const limit = res.headers.get("X-RateLimit-Limit");
    const remaining = res.headers.get("X-RateLimit-Remaining");
    const reset = res.headers.get("X-RateLimit-Reset");
    console.log(
      `${i.toString().padStart(2, "0")} → ${res.status} | rem=${remaining}/${limit} reset=${reset}s | ${JSON.stringify(
        data
      )}`
    );
    await new Promise((r) => setTimeout(r, 200)); // small delay between hits
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});