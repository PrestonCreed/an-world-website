// emails/SignUpEmail.tsx
import * as React from 'react';
import ANLayout from './ANLayout';

const palette = {
  fg: '#FFFFFF',
  muted: 'rgba(255,255,255,0.75)',
  blue: '#0f7edd',
  border: 'rgba(255,255,255,0.12)',
  red: '#FF0000',
};

export default function SignUpEmail({
  heroTopImageUrl,
  heroBottomImageUrl,
  ctaUrl,
}: {
  heroTopImageUrl?: string;
  heroBottomImageUrl?: string;
  ctaUrl: string;
}) {
  return (
    <ANLayout
      title="Welcome to AN World!"
      previewText="You are now signed up for an.world — stream AN content for free."
    >
      {/* Title + Subheading */}
      <h1 style={{ margin: 0, fontSize: 22 }}>Welcome to an.world</h1>
      <div style={{ fontSize: 13, color: palette.muted, marginTop: 6 }}>
        Sign‑up Confirmation
      </div>

      {/* HERO TOP image (clickable to CTA) */}
      {heroTopImageUrl && (
        <a href={ctaUrl} target="_blank" rel="noreferrer">
          <img
            src={heroTopImageUrl}
            width="100%"
            alt="Welcome to AN World"
            style={{
              marginTop: 16,
              borderRadius: 12,
              border: `1px solid ${palette.border}`,
              display: 'block',
            }}
          />
        </a>
      )}

      {/* Body */}
      <p style={{ marginTop: 16, lineHeight: 1.55 }}>
        You can now stream all AN content for free! From high‑quality <strong>AN Original</strong>{' '}
        features, to experimental <strong>AN Freeform</strong> shorts, let us be your introduction to
        the new age of entertainment.
      </p>

      {/* HERO BOTTOM image (also clickable to CTA) */}
      {heroBottomImageUrl && (
        <a href={ctaUrl} target="_blank" rel="noreferrer">
          <img
            src={heroBottomImageUrl}
            width="100%"
            alt="Enter the AN portal"
            style={{
              marginTop: 12,
              borderRadius: 12,
              border: `1px solid ${palette.border}`,
              display: 'block',
            }}
          />
        </a>
      )}

      {/* Secondary textual CTA (for clients where image click is unclear) */}
      <div style={{ marginTop: 16 }}>
        <a
          href={ctaUrl}
          style={{
            display: 'inline-block',
            padding: '12px 18px',
            background: palette.fg,
            color: '#000',
            textDecoration: 'none',
            borderRadius: 999,
            boxShadow: `0 0 16px ${palette.blue}88`,
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          Go back to an.world
        </a>
      </div>

      {/* Tiny text */}
      <p style={{ marginTop: 18, fontSize: 12, color: palette.muted }}>
        This email was sent to confirm your recent sign‑up to an.world for access to our streaming
        library. If you did not initiate this sign‑up please <a href="https://an.world/help">click here</a> for help.
      </p>
    </ANLayout>
  );
}
