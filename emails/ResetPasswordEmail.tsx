// emails/ResetPasswordEmail.tsx
import * as React from 'react';
import ANLayout from './ANLayout';

const palette = {
  blue: '#0f7edd',
  muted: 'rgba(255,255,255,0.75)',
};

export default function ResetPasswordEmail({
  resetUrl,
  userEmail,
}: {
  resetUrl: string;
  userEmail?: string;
}) {
  return (
    <ANLayout title="Reset your password for an.world" previewText="Reset your AN World password">
      <h1 style={{ margin: 0, fontSize: 20 }}>Reset your password</h1>
      <p style={{ marginTop: 12, lineHeight: 1.55 }}>
        Click the button below to reset your password{userEmail ? (
          <> for <strong>{userEmail}</strong></>
        ) : null}
        .
      </p>
      <div style={{ marginTop: 12 }}>
        <a
          href={resetUrl}
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
          Reset Password
        </a>
      </div>
      <p style={{ marginTop: 18, fontSize: 12, color: palette.muted }}>
        If you did not request a password reset, you can safely ignore this email.
      </p>
    </ANLayout>
  );
}
