// emails/ConfirmEmail.tsx
import * as React from 'react';
import ANLayout from './ANLayout';

const palette = {
  muted: 'rgba(255,255,255,0.75)',
  blue: '#0f7edd',
  border: 'rgba(255,255,255,0.12)',
};

export default function ConfirmEmail({
  confirmUrl,
  heroImageUrl,
}: {
  confirmUrl: string;
  heroImageUrl?: string;
}) {
  return (
    <ANLayout
      title="Please confirm your email address to sign into AN World"
      previewText="Confirm your email to complete your sign‑up."
    >
      <h1 style={{ margin: 0, fontSize: 20 }}>Please confirm your email</h1>
      <div style={{ fontSize: 13, color: palette.muted, marginTop: 6 }}>Email Confirmation</div>

      {heroImageUrl && (
        <a href={confirmUrl} target="_blank" rel="noreferrer">
          <img
            src={heroImageUrl}
            alt="Confirm your email"
            width="100%"
            style={{
              marginTop: 16,
              borderRadius: 12,
              border: `1px solid ${palette.border}`,
              display: 'block',
            }}
          />
        </a>
      )}

      <p style={{ marginTop: 16, lineHeight: 1.55 }}>
        Please confirm this is the correct email address to complete your sign‑up for an.world.
      </p>

      {/* Fallback CTA button */}
      <div style={{ marginTop: 12 }}>
        <a
          href={confirmUrl}
          style={{
            display: 'inline-block',
            padding: '12px 18px',
            background: '#FFFFFF',
            color: '#000',
            textDecoration: 'none',
            borderRadius: 999,
            fontWeight: 700,
            boxShadow: `0 0 16px ${palette.blue}88`,
          }}
        >
          Click Here to Confirm
        </a>
      </div>

      <p style={{ marginTop: 18, fontSize: 12, color: palette.muted }}>
        This email was sent to confirm your recent sign‑up to an.world for access to our streaming
        library. If you did not initiate this sign‑up please <a href="https://an.world/help">click here</a> for help.
      </p>
    </ANLayout>
  );
}
