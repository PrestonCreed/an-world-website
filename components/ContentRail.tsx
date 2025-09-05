'use client';

type Card = { id:string; title:string; subtitle:string };
function PlaceholderCard({title, subtitle}: {title:string; subtitle:string}){
  return (
    <article className="card" data-content-click>
      <div className="thumb" />
      <h4>{title}</h4>
      <p>{subtitle}</p>
    </article>
  );
}

export default function ContentRail({ title, count = 8 }: { title: string; count?: number }) {
  const items: Card[] = Array.from({ length: count }).map((_,i)=> ({
    id: `${title}-${i}`,
    title: `${title} — Title ${i+1}`,
    subtitle: "Subtitle goes here"
  }));

  return (
    <section className="container my-8">
      <div className="flex items-end justify-between mb-3">
        <h3 className="text-lg font-semibold">{title}</h3>
        <a className="text-sm opacity-70 hover:opacity-100" href="#">See all</a>
      </div>
      <div className="rail fade-edges">
        {items.map((c)=>(<PlaceholderCard key={c.id} title={c.title} subtitle={c.subtitle} />))}
      </div>
    </section>
  );
}
