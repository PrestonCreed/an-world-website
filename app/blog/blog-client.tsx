'use client';
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Post = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  image?: string;
  type: "blog" | "research" | "announcements";
};

export default function BlogClient({ initialType, posts }: { initialType: "blog"|"research"|"announcements"; posts: Post[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();

  const filters: Post["type"][] = ["blog","research","announcements"];
  const type = (search.get("type") as Post["type"]) || initialType;

  const setType = (t: Post["type"]) => {
    const params = new URLSearchParams(search.toString());
    if (t === "blog") params.delete("type"); else params.set("type", t);
    router.replace(params.toString() ? `${pathname}?${params}` : pathname, { scroll:false });
  };

  const filtered = posts.filter(p => p.type === type);

  return (
    <section className="container py-10">
      {/* Top-center logo */}
      <div className="flex justify-center mb-8">
        <img src="/images/an-logo.png" alt="Anything World" className="h-8 w-auto" />
      </div>

      {/* Filters (33/33/33) */}
      <div className="grid grid-cols-3 gap-3 items-center mb-8">
        {filters.map((f, i) => {
          const active = type === f;
          return (
            <button
              key={f}
              onClick={() => setType(f)}
              className={`text-sm py-2 rounded-full border transition
                ${active ? "border-white/60 bg-white/10" : "border-white/15 bg-white/5 opacity-70 hover:opacity-100"}`}
              style={{ justifySelf: i===1 ? "center" : (i===0 ? "start" : "end"), width: "100%" }}
            >
              {f.charAt(0).toUpperCase()+f.slice(1)}
            </button>
          );
        })}
      </div>

      {/* Grid like Runway (layout only) */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(post => (
          <article key={post.id} className="rounded-xl border border-white/10 overflow-hidden bg-white/[0.03] hover:bg-white/[0.05] transition">
            {/* Image top */}
            <div>
              {post.image ? (
                <img src={post.image} alt="" className="w-full aspect-[16/9] object-cover" />
              ) : (
                <div className="w-full aspect-[16/9]" style={{background:"linear-gradient(120deg, rgba(255,255,255,.06), rgba(15,126,221,.18)), rgba(255,255,255,.04)"}} />
              )}
            </div>

            {/* Text block */}
            <div className="p-4">
              <h2 className="text-lg font-semibold leading-snug">{post.title}</h2>
              <div className="mt-1 text-xs opacity-60">
                Anything World • {new Date(post.date).toLocaleDateString()}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
