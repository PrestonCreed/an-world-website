// emails/NewsletterEmail.tsx
import * as React from 'react';
import ANLayout from './ANLayout';

export type LinkRef = { title: string; href: string };
export type MediaCard = { imageUrl?: string; title: string; description?: string; href?: string };
export type Teaser = { imageUrl?: string; text: string; href?: string };
export type CreatorSpotlight = { avatarUrl?: string; name: string; blurb?: string; href?: string };
export type AdBlock = { title?: string; copy?: string; ctas?: { label: string; href: string }[] };

export type NewsletterProps = {
  title: string; // email subject / headline
  subheading?: string;
  newsHeadliner?: { title: string; summary?: string; imageUrl?: string; href?: string };

  newContentThisWeek?: MediaCard[];   // ~6
  comingSoon?: MediaCard[];           // ~3
  latestBlogs?: LinkRef[];            // 2–5
  weeklyTeaser?: Teaser;
  creatorOfWeek?: CreatorSpotlight;
  creatorProgramAd?: AdBlock;

  unsubscribeUrl?: string;            // per-user unsubscribe link
};

const palette = {
  border: 'rgba(255,255,255,0.12)',
  muted: 'rgba(255,255,255,0.75)',
  blue: '#0f7edd',
};

export default function NewsletterEmail(data: NewsletterProps) {
  const {
    title,
    subheading,
    newsHeadliner,
    newContentThisWeek = [],
    comingSoon = [],
    latestBlogs = [],
    weeklyTeaser,
    creatorOfWeek,
    creatorProgramAd,
  } = data;

  return (
    <ANLayout title={title} previewText={subheading || 'AN Universe — Weekly'}>
      <h1 style={{ margin: 0, fontSize: 22 }}>{title}</h1>
      {subheading && (
        <div style={{ marginTop: 6, fontSize: 13, color: palette.muted }}>{subheading}</div>
      )}

      {/* News headliner */}
      {newsHeadliner && (
        <section style={{ marginTop: 16 }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>Top Story — {newsHeadliner.title}</h2>
          {newsHeadliner.imageUrl && (
            <a href={newsHeadliner.href} target="_blank" rel="noreferrer">
              <img
                src={newsHeadliner.imageUrl}
                alt={newsHeadliner.title}
                width="100%"
                style={{
                  marginTop: 10,
                  borderRadius: 12,
                  border: `1px solid ${palette.border}`,
                  display: 'block',
                }}
              />
            </a>
          )}
          {newsHeadliner.summary && (
            <p style={{ marginTop: 10, lineHeight: 1.55 }}>{newsHeadliner.summary}</p>
          )}
        </section>
      )}

      {/* New content this week (cards grid 2-col) */}
      {newContentThisWeek.length > 0 && (
        <section style={{ marginTop: 18 }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>New content this week</h2>
          <table role="presentation" width="100%" style={{ marginTop: 10 }}>
            <tbody>
              {chunk(newContentThisWeek, 2).map((row, i) => (
                <tr key={i}>
                  {row.map((item, j) => (
                    <td key={j} width="50%" style={{ verticalAlign: 'top', paddingRight: j === 0 ? 8 : 0, paddingLeft: j === 1 ? 8 : 0 }}>
                      <Card card={item} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Coming soon */}
      {comingSoon.length > 0 && (
        <section style={{ marginTop: 18 }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>Coming soon</h2>
          <table role="presentation" width="100%" style={{ marginTop: 10 }}>
            <tbody>
              {chunk(comingSoon, 3).map((row, i) => (
                <tr key={i}>
                  {row.map((item, j) => (
                    <td key={j} width={`${100 / row.length}%`} style={{ verticalAlign: 'top', padding: j === 1 ? '0 8px' : 0 }}>
                      <Card small card={item} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Latest blogs/news */}
      {latestBlogs.length > 0 && (
        <section style={{ marginTop: 18 }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>Latest blogs, news, and announcements</h2>
          <ul style={{ marginTop: 10, paddingLeft: 18 }}>
            {latestBlogs.map((b, i) => (
              <li key={i} style={{ marginBottom: 6 }}>
                <a href={b.href} style={{ color: '#fff' }}>
                  {b.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Weekly teaser */}
      {weeklyTeaser && (
        <section style={{ marginTop: 18 }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>AN Universe Weekly Teaser</h2>
          {weeklyTeaser.imageUrl && (
            <a href={weeklyTeaser.href} target="_blank" rel="noreferrer">
              <img
                src={weeklyTeaser.imageUrl}
                alt="AN Universe Teaser"
                width="100%"
                style={{
                  marginTop: 10,
                  borderRadius: 12,
                  border: `1px solid ${palette.border}`,
                  display: 'block',
                }}
              />
            </a>
          )}
          <p style={{ marginTop: 10, lineHeight: 1.55 }}>{weeklyTeaser.text}</p>
        </section>
      )}

      {/* Creator of the week */}
      {creatorOfWeek && (
        <section style={{ marginTop: 18 }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>Creator of the Week</h2>
          <table role="presentation" width="100%" style={{ marginTop: 10 }}>
            <tbody>
              <tr>
                <td width="64" style={{ verticalAlign: 'top' }}>
                  {creatorOfWeek.avatarUrl ? (
                    <img
                      src={creatorOfWeek.avatarUrl}
                      width="56"
                      height="56"
                      alt={creatorOfWeek.name}
                      style={{ borderRadius: 999 }}
                    />
                  ) : (
                    <div style={{ width: 56, height: 56, borderRadius: 999, background: '#222' }} />
                  )}
                </td>
                <td style={{ verticalAlign: 'top' }}>
                  <div style={{ fontWeight: 700 }}>{creatorOfWeek.name}</div>
                  {creatorOfWeek.blurb && <div style={{ marginTop: 6, color: '#ccc' }}>{creatorOfWeek.blurb}</div>}
                  {creatorOfWeek.href && (
                    <div style={{ marginTop: 8 }}>
                      <a
                        href={creatorOfWeek.href}
                        style={{
                          display: 'inline-block',
                          padding: '10px 14px',
                          background: '#fff',
                          color: '#000',
                          textDecoration: 'none',
                          borderRadius: 999,
                        }}
                      >
                        View creator
                      </a>
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      )}

      {/* Creator Program Ad */}
      {creatorProgramAd && (
        <section style={{ marginTop: 18 }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>Creator Program</h2>
          {creatorProgramAd.title && (
            <div style={{ marginTop: 8, fontWeight: 700 }}>{creatorProgramAd.title}</div>
          )}
          {creatorProgramAd.copy && <p style={{ marginTop: 6, lineHeight: 1.55 }}>{creatorProgramAd.copy}</p>}
          {creatorProgramAd.ctas?.length ? (
            <div style={{ marginTop: 8 }}>
              {creatorProgramAd.ctas.map((c, i) => (
                <a
                  key={i}
                  href={c.href}
                  style={{
                    display: 'inline-block',
                    padding: '10px 14px',
                    background: '#fff',
                    color: '#000',
                    textDecoration: 'none',
                    borderRadius: 999,
                    marginRight: 8,
                    marginBottom: 6,
                  }}
                >
                  {c.label}
                </a>
              ))}
            </div>
          ) : null}
        </section>
      )}

      {/* Footer unsubscribe handled by header "List-Unsubscribe" + include a visible link here if provided */}
      {data.unsubscribeUrl && (
        <p style={{ marginTop: 18, fontSize: 12, color: '#bbb' }}>
          Don’t want these emails?{' '}
          <a href={data.unsubscribeUrl} style={{ color: '#fff' }}>
            Unsubscribe
          </a>
          .
        </p>
      )}
    </ANLayout>
  );
}

function Card({ card, small }: { card: MediaCard; small?: boolean }) {
  return (
    <div style={{ marginBottom: 12 }}>
      {card.imageUrl && card.href ? (
        <a href={card.href} target="_blank" rel="noreferrer">
          <img
            src={card.imageUrl}
            alt={card.title}
            width="100%"
            style={{ borderRadius: 12, border: `1px solid ${palette.border}`, display: 'block' }}
          />
        </a>
      ) : card.imageUrl ? (
        <img
          src={card.imageUrl}
          alt={card.title}
          width="100%"
          style={{ borderRadius: 12, border: `1px solid ${palette.border}`, display: 'block' }}
        />
      ) : null}
      <div style={{ marginTop: 8, fontWeight: 700, fontSize: small ? 13 : 14 }}>{card.title}</div>
      {card.description && (
        <div style={{ marginTop: 6, color: '#ccc', fontSize: small ? 12 : 13 }}>{card.description}</div>
      )}
      {card.href && (
        <div style={{ marginTop: 8 }}>
          <a
            href={card.href}
            style={{
              display: 'inline-block',
              padding: '8px 12px',
              background: '#fff',
              color: '#000',
              textDecoration: 'none',
              borderRadius: 999,
              fontSize: 13,
            }}
          >
            View
          </a>
        </div>
      )}
    </div>
  );
}

function chunk<T>(arr: T[], n: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}
